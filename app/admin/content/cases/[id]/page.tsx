import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import CaseEditor from '@/components/admin/CaseEditor';
import type { CaseRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export default async function EditCasePage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase
    .from('before_after_cases')
    .select('*')
    .eq('id', params.id)
    .single();
  const row = data as CaseRow | null;
  if (!row) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/content/cases"
          className="text-sm text-[var(--admin-muted)] hover:text-[var(--admin-ink)] inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to cases
        </Link>
        <h1 className="font-display text-3xl mt-2">Edit case</h1>
        <p className="text-sm text-[var(--admin-muted)]">{row.slug}</p>
      </div>
      <CaseEditor mode="edit" initial={row} />
    </div>
  );
}
