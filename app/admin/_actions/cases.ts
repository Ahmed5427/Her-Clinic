'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { caseSchema } from '@/lib/validators';

function fdToCaseInput(formData: FormData) {
  return {
    slug: formData.get('slug'),
    title_en: formData.get('title_en'),
    title_ar: formData.get('title_ar'),
    description_en: formData.get('description_en'),
    description_ar: formData.get('description_ar'),
    position: formData.get('position') ?? 0,
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
  };
}

export async function createCase(formData: FormData) {
  await requireAdmin();
  const parsed = caseSchema.safeParse(fdToCaseInput(formData));
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };

  const supabase = createClient();
  const { data, error } = await supabase
    .from('before_after_cases')
    .insert({
      slug: parsed.data.slug,
      title_en: parsed.data.title_en,
      title_ar: parsed.data.title_ar,
      description_en: parsed.data.description_en || null,
      description_ar: parsed.data.description_ar || null,
      position: parsed.data.position,
      published: parsed.data.published,
    })
    .select('id')
    .single();
  if (error || !data) return { ok: false as const, error: error?.message ?? 'Insert failed.' };

  revalidatePath('/admin/content/cases');
  revalidatePath('/[locale]', 'layout');
  redirect(`/admin/content/cases/${data.id}`);
}

export async function updateCase(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = caseSchema.safeParse(fdToCaseInput(formData));
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };

  const supabase = createClient();
  const { error } = await supabase
    .from('before_after_cases')
    .update({
      slug: parsed.data.slug,
      title_en: parsed.data.title_en,
      title_ar: parsed.data.title_ar,
      description_en: parsed.data.description_en || null,
      description_ar: parsed.data.description_ar || null,
      position: parsed.data.position,
      published: parsed.data.published,
    })
    .eq('id', id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath('/admin/content/cases');
  revalidatePath(`/admin/content/cases/${id}`);
  revalidatePath('/[locale]', 'layout');
  return { ok: true as const };
}

export async function togglePublishCase(id: string, published: boolean) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase
    .from('before_after_cases')
    .update({ published })
    .eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/content/cases');
  revalidatePath('/[locale]', 'layout');
  return { ok: true as const };
}

export async function deleteCase(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('before_after_cases').delete().eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/content/cases');
  revalidatePath('/[locale]', 'layout');
  return { ok: true as const };
}

/**
 * Uploads a single image to the `cases` bucket and saves the public URL
 * on the case row. `kind` selects which column (`before_url` or `after_url`).
 */
export async function uploadCaseImage(id: string, kind: 'before' | 'after', formData: FormData) {
  await requireAdmin();
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: 'No file provided.' };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false as const, error: 'File is larger than 8 MB.' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeKind = kind === 'before' ? 'before' : 'after';
  const key = `${id}/${safeKind}-${Date.now()}.${ext}`;

  const admin = createAdminClient();
  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadErr } = await admin.storage.from('cases').upload(key, Buffer.from(arrayBuffer), {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  });
  if (uploadErr) return { ok: false as const, error: uploadErr.message };

  const {
    data: { publicUrl },
  } = admin.storage.from('cases').getPublicUrl(key);

  const supabase = createClient();
  const column = safeKind === 'before' ? 'before_url' : 'after_url';
  const { error } = await supabase
    .from('before_after_cases')
    .update({ [column]: publicUrl })
    .eq('id', id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath('/admin/content/cases');
  revalidatePath(`/admin/content/cases/${id}`);
  revalidatePath('/[locale]', 'layout');
  return { ok: true as const, url: publicUrl };
}
