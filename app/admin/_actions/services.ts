'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { serviceSchema } from '@/lib/validators';

function parseInput(formData: FormData) {
  return serviceSchema.safeParse({
    slug: formData.get('slug'),
    icon: formData.get('icon'),
    title_en: formData.get('title_en'),
    title_ar: formData.get('title_ar'),
    description_en: formData.get('description_en'),
    description_ar: formData.get('description_ar'),
    position: formData.get('position') ?? 0,
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
  });
}

export async function createService(formData: FormData) {
  await requireAdmin();
  const parsed = parseInput(formData);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  const supabase = createClient();
  const { data, error } = await supabase
    .from('services')
    .insert({
      slug: parsed.data.slug,
      icon: parsed.data.icon || null,
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
  revalidatePath('/admin/content/services');
  revalidatePath('/[locale]', 'layout');
  redirect(`/admin/content/services/${data.id}`);
}

export async function updateService(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseInput(formData);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  const supabase = createClient();
  const { error } = await supabase
    .from('services')
    .update({
      slug: parsed.data.slug,
      icon: parsed.data.icon || null,
      title_en: parsed.data.title_en,
      title_ar: parsed.data.title_ar,
      description_en: parsed.data.description_en || null,
      description_ar: parsed.data.description_ar || null,
      position: parsed.data.position,
      published: parsed.data.published,
    })
    .eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/content/services');
  revalidatePath('/[locale]', 'layout');
  return { ok: true as const };
}

export async function togglePublishService(id: string, published: boolean) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('services').update({ published }).eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/content/services');
  revalidatePath('/[locale]', 'layout');
  return { ok: true as const };
}

export async function deleteService(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/content/services');
  revalidatePath('/[locale]', 'layout');
  return { ok: true as const };
}
