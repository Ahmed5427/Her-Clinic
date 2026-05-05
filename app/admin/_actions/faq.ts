'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { faqSchema } from '@/lib/validators';

function parseInput(formData: FormData) {
  return faqSchema.safeParse({
    question_en: formData.get('question_en'),
    question_ar: formData.get('question_ar'),
    answer_en: formData.get('answer_en'),
    answer_ar: formData.get('answer_ar'),
    position: formData.get('position') ?? 0,
    published: formData.get('published') === 'on' || formData.get('published') === 'true',
  });
}

export async function createFaq(formData: FormData) {
  await requireAdmin();
  const parsed = parseInput(formData);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  const supabase = createClient();
  const { data, error } = await supabase
    .from('faq')
    .insert({
      question_en: parsed.data.question_en,
      question_ar: parsed.data.question_ar,
      answer_en: parsed.data.answer_en,
      answer_ar: parsed.data.answer_ar,
      position: parsed.data.position,
      published: parsed.data.published,
    })
    .select('id')
    .single();
  if (error || !data) return { ok: false as const, error: error?.message ?? 'Insert failed.' };
  revalidatePath('/admin/content/faq');
  redirect(`/admin/content/faq/${data.id}`);
}

export async function updateFaq(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseInput(formData);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  const supabase = createClient();
  const { error } = await supabase
    .from('faq')
    .update({
      question_en: parsed.data.question_en,
      question_ar: parsed.data.question_ar,
      answer_en: parsed.data.answer_en,
      answer_ar: parsed.data.answer_ar,
      position: parsed.data.position,
      published: parsed.data.published,
    })
    .eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/content/faq');
  return { ok: true as const };
}

export async function togglePublishFaq(id: string, published: boolean) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('faq').update({ published }).eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/content/faq');
  return { ok: true as const };
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('faq').delete().eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/content/faq');
  return { ok: true as const };
}
