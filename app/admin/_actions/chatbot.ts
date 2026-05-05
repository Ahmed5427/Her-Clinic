'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { chatbotSettingsSchema } from '@/lib/validators';

function parseList(value: FormDataEntryValue | null): string[] {
  if (typeof value !== 'string') return [];
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export async function updateChatbotSettings(formData: FormData) {
  await requireAdmin();
  const parsed = chatbotSettingsSchema.safeParse({
    enabled: formData.get('enabled') === 'on' || formData.get('enabled') === 'true',
    greeting_en: formData.get('greeting_en'),
    greeting_ar: formData.get('greeting_ar'),
    persona_en: formData.get('persona_en'),
    persona_ar: formData.get('persona_ar'),
    suggested_en: parseList(formData.get('suggested_en')),
    suggested_ar: parseList(formData.get('suggested_ar')),
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'chatbot', value: parsed.data });
  if (error) return { ok: false as const, error: error.message };

  revalidatePath('/admin/content/chatbot');
  revalidatePath('/[locale]', 'layout');
  return { ok: true as const };
}
