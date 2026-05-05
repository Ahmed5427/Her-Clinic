'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import type { BrandingSettings } from '@/lib/supabase/types';

const DEFAULTS: BrandingSettings = { logo_url: '/logo.svg', logo_mark_url: '/logo-mark.svg' };

async function readBranding(): Promise<BrandingSettings> {
  const supabase = createClient();
  const { data } = await supabase.from('site_settings').select('*').eq('key', 'branding').single();
  const row = data as { value: Partial<BrandingSettings> } | null;
  return { ...DEFAULTS, ...(row?.value ?? {}) };
}

async function writeBranding(next: Partial<BrandingSettings>) {
  const supabase = createClient();
  const current = await readBranding();
  const merged = { ...current, ...next };
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'branding', value: merged });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/content/branding');
  revalidatePath('/[locale]', 'layout');
  return { ok: true as const, branding: merged };
}

async function uploadToBranding(file: File, prefix: string) {
  if (file.size === 0) return { ok: false as const, error: 'No file provided.' };
  if (file.size > 4 * 1024 * 1024) return { ok: false as const, error: 'File is larger than 4 MB.' };
  const ext = file.name.split('.').pop()?.toLowerCase() || 'svg';
  const key = `${prefix}-${Date.now()}.${ext}`;
  const admin = createAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage
    .from('branding')
    .upload(key, buffer, { contentType: file.type || 'image/svg+xml', upsert: false });
  if (error) return { ok: false as const, error: error.message };
  const {
    data: { publicUrl },
  } = admin.storage.from('branding').getPublicUrl(key);
  return { ok: true as const, url: publicUrl };
}

export async function uploadLogo(formData: FormData) {
  await requireAdmin();
  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false as const, error: 'No file provided.' };
  const result = await uploadToBranding(file, 'logo');
  if (!result.ok) return result;
  return await writeBranding({ logo_url: result.url });
}

export async function uploadLogoMark(formData: FormData) {
  await requireAdmin();
  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false as const, error: 'No file provided.' };
  const result = await uploadToBranding(file, 'logo-mark');
  if (!result.ok) return result;
  return await writeBranding({ logo_mark_url: result.url });
}

export async function resetLogo() {
  await requireAdmin();
  return await writeBranding(DEFAULTS);
}
