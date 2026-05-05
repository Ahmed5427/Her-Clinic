'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { testimonialSchema } from '@/lib/validators';

function parseInput(formData: FormData) {
  return testimonialSchema.safeParse({
    name: formData.get('name'),
    role_en: formData.get('role_en'),
    role_ar: formData.get('role_ar'),
    quote_en: formData.get('quote_en'),
    quote_ar: formData.get('quote_ar'),
    rating: formData.get('rating') ?? 5,
    position: formData.get('position') ?? 0,
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
  });
}

export async function createTestimonial(formData: FormData) {
  await requireAdmin();
  const parsed = parseInput(formData);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  const supabase = createClient();
  const { data, error } = await supabase
    .from('testimonials')
    .insert({
      name: parsed.data.name,
      role_en: parsed.data.role_en || null,
      role_ar: parsed.data.role_ar || null,
      quote_en: parsed.data.quote_en,
      quote_ar: parsed.data.quote_ar,
      rating: parsed.data.rating,
      position: parsed.data.position,
      published: parsed.data.published,
    })
    .select('id')
    .single();
  if (error || !data) return { ok: false as const, error: error?.message ?? 'Insert failed.' };
  revalidatePath('/admin/content/testimonials');
  revalidatePath('/[locale]', 'layout');
  redirect(`/admin/content/testimonials/${data.id}`);
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseInput(formData);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  const supabase = createClient();
  const { error } = await supabase
    .from('testimonials')
    .update({
      name: parsed.data.name,
      role_en: parsed.data.role_en || null,
      role_ar: parsed.data.role_ar || null,
      quote_en: parsed.data.quote_en,
      quote_ar: parsed.data.quote_ar,
      rating: parsed.data.rating,
      position: parsed.data.position,
      published: parsed.data.published,
    })
    .eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/content/testimonials');
  revalidatePath('/[locale]', 'layout');
  return { ok: true as const };
}

export async function togglePublishTestimonial(id: string, published: boolean) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('testimonials').update({ published }).eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/content/testimonials');
  revalidatePath('/[locale]', 'layout');
  return { ok: true as const };
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/content/testimonials');
  revalidatePath('/[locale]', 'layout');
  return { ok: true as const };
}
