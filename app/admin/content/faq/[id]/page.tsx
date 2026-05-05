import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import FaqEditor from '@/components/admin/FaqEditor';
import type { FaqRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export default async function EditFaqPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase.from('faq').select('*').eq('id', params.id).single();
  const row = data as FaqRow | null;
  if (!row) notFound();
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/content/faq"
          className="text-sm text-[var(--admin-muted)] hover:text-[var(--admin-ink)] inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to FAQ
        </Link>
        <h1 className="font-display text-3xl mt-2">Edit FAQ</h1>
      </div>
      <FaqEditor mode="edit" initial={row} />
    </div>
  );
}
