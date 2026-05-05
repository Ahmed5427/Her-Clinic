'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import {
  contactInfoSchema,
  workingHoursSchema,
  socialLinksSchema,
} from '@/lib/validators';

async function upsertSetting(key: string, value: Record<string, unknown>) {
  const supabase = createClient();
  const { error } = await supabase.from('site_settings').upsert({ key, value });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/settings');
  revalidatePath('/[locale]', 'layout');
  return { ok: true as const };
}

export async function updateContactInfo(formData: FormData) {
  await requireAdmin();
  const parsed = contactInfoSchema.safeParse({
    phone: formData.get('phone'),
    email: formData.get('email'),
    location_en: formData.get('location_en'),
    location_ar: formData.get('location_ar'),
  });
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  return await upsertSetting('contact_info', parsed.data);
}

export async function updateWorkingHours(formData: FormData) {
  await requireAdmin();
  const parsed = workingHoursSchema.safeParse({
    en: formData.get('en'),
    ar: formData.get('ar'),
  });
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  return await upsertSetting('working_hours', parsed.data);
}

export async function updateSocialLinks(formData: FormData) {
  await requireAdmin();
  const parsed = socialLinksSchema.safeParse({
    instagram: formData.get('instagram'),
    facebook: formData.get('facebook'),
    whatsapp: formData.get('whatsapp'),
    email: formData.get('email'),
  });
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  return await upsertSetting('social_links', {
    instagram: parsed.data.instagram ?? '',
    facebook: parsed.data.facebook ?? '',
    whatsapp: parsed.data.whatsapp ?? '',
    email: parsed.data.email ?? '',
  });
}
