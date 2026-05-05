import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { toCsv } from '@/lib/csv';
import type { ContactSubmission } from '@/lib/supabase/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  const rows = ((data ?? []) as ContactSubmission[]).map((r) => ({
    created_at: r.created_at,
    name: r.name,
    email: r.email,
    phone: r.phone ?? '',
    service: r.service ?? '',
    message: (r.message ?? '').replace(/\r?\n/g, ' '),
    locale: r.locale,
    status: r.status,
    notes: (r.notes ?? '').replace(/\r?\n/g, ' '),
  }));

  const csv = toCsv(rows);
  const filename = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${filename}"`,
      'cache-control': 'no-store',
    },
  });
}
