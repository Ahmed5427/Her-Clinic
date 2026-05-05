import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { trackSchema } from '@/lib/validators';
import { isBot, classifyDevice } from '@/lib/ua';
import { sessionHash } from '@/lib/hash';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let parsed;
  try {
    const body = await req.json();
    parsed = trackSchema.safeParse(body);
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  if (!parsed.success) return new NextResponse(null, { status: 204 });

  const { path, locale, referrer } = parsed.data;
  const headers = req.headers;
  const userAgent = headers.get('user-agent') ?? '';

  if (isBot(userAgent)) return new NextResponse(null, { status: 204 });

  const xff = headers.get('x-forwarded-for') ?? '';
  const ip = xff.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown';
  const country = headers.get('x-vercel-ip-country') ?? null;

  try {
    const admin = createAdminClient();
    await admin.from('page_visits').insert({
      path,
      locale: locale ?? null,
      referrer: referrer || headers.get('referer') || null,
      user_agent: userAgent || null,
      country,
      device: classifyDevice(userAgent),
      session_hash: sessionHash(ip, userAgent),
    });
  } catch {
    // Swallow — never let analytics break the page.
  }

  return new NextResponse(null, { status: 204 });
}
