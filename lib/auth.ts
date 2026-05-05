import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/supabase/types';

/**
 * Cached for the lifetime of a single request — avoids hitting Supabase
 * twice when both the admin layout and a server action call into auth
 * helpers on the same render.
 */
export const getSessionUser = cache(async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return ((data as Profile | null) ?? null) as Profile | null;
});

/**
 * Redirects to /admin/login when no session, or to
 * /admin/login?denied=1 when the user lacks the admin role.
 * Returns { user, profile } when allowed.
 */
export const requireAdmin = cache(async () => {
  const profile = await getProfile();
  if (!profile) redirect('/admin/login');
  if (profile.role !== 'admin') redirect('/admin/login?denied=1');
  return { profile };
});
