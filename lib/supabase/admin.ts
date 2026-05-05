import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './db';

let cached: ReturnType<typeof createSupabaseClient<Database>> | null = null;

/**
 * Service-role client. Bypasses RLS — only use from server-side code
 * (route handlers, server actions) AFTER you've verified the user is
 * an admin via requireAdmin(), or for trusted server inserts where the
 * caller is anonymous (e.g. /api/track).
 */
export function createAdminClient() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Missing Supabase admin env vars (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)'
    );
  }
  cached = createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
