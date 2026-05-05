import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import ServiceEditor from '@/components/admin/ServiceEditor';
import type { ServiceRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export default async function EditServicePage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase.from('services').select('*').eq('id', params.id).single();
  const row = data as ServiceRow | null;
  if (!row) notFound();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content/services" className="text-sm text-[var(--admin-muted)] hover:text-[var(--admin-ink)] inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to services
        </Link>
        <h1 className="font-display text-3xl mt-2">Edit service</h1>
        <p className="text-sm text-[var(--admin-muted)]">{row.slug}</p>
      </div>
      <ServiceEditor mode="edit" initial={row} />
    </div>
  );
}
