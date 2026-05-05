'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { contactSubmissionSchema } from '@/lib/validators';
import { sessionHash } from '@/lib/hash';
import { headers } from 'next/headers';
import type { SubmissionStatus } from '@/lib/supabase/types';

/**
 * Public action — invoked from the contact form on the marketing site.
 * Inserts via the service-role client so we can sanitize and tag with
 * a hashed IP without exposing IP/UA details to the browser.
 */
export async function submitContactForm(formData: FormData) {
  const parsed = contactSubmissionSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    service: formData.get('service'),
    message: formData.get('message'),
    locale: formData.get('locale') ?? 'en',
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const h = headers();
  const ua = h.get('user-agent') ?? '';
  const xff = h.get('x-forwarded-for') ?? '';
  const ip = xff.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';

  try {
    const admin = createAdminClient();
    const row = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      service: parsed.data.service || null,
      message: parsed.data.message || null,
      locale: parsed.data.locale,
      ip_hash: sessionHash(ip, ua),
      user_agent: ua || null,
    };
    const { error } = await admin.from('contact_submissions').insert(row);
    if (error) return { ok: false as const, error: error.message };
  } catch (err) {
    return {
      ok: false as const,
      error: err instanceof Error ? err.message : 'Submission failed.',
    };
  }

  return { ok: true as const };
}

export async function updateSubmissionStatus(id: string, status: SubmissionStatus) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase
    .from('contact_submissions')
    .update({ status })
    .eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/submissions');
  revalidatePath('/admin');
  return { ok: true as const };
}

export async function updateSubmissionNotes(id: string, notes: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase
    .from('contact_submissions')
    .update({ notes })
    .eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/submissions');
  return { ok: true as const };
}

export async function deleteSubmission(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/admin/submissions');
  revalidatePath('/admin');
  return { ok: true as const };
}
