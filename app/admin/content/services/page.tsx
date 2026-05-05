import Link from 'next/link';
import { Plus } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { togglePublishService } from '@/app/admin/_actions/services';
import type { ServiceRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export default async function ServicesListPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase
    .from('services')
    .select('*')
    .order('position', { ascending: true });
  const rows = (data ?? []) as ServiceRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">Services</h1>
          <p className="text-sm text-[var(--admin-muted)] mt-1">
            Manage the cards rendered in the public Services section.
          </p>
        </div>
        <Link href="/admin/content/services/new" className="admin-btn-primary text-sm">
          <Plus className="w-4 h-4" /> New service
        </Link>
      </div>

      <section className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Slug</th>
              <th>Icon</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-sm text-[var(--admin-muted)] py-12">No services yet.</td></tr>
            ) : (
              rows.map((s) => (
                <tr key={s.id}>
                  <td className="text-[var(--admin-muted)] text-xs">{s.position}</td>
                  <td>
                    <div className="font-medium">{s.title_en}</div>
                    <div className="text-xs text-[var(--admin-muted)]" dir="rtl">{s.title_ar}</div>
                  </td>
                  <td className="text-xs font-mono text-[var(--admin-muted)]">{s.slug}</td>
                  <td className="text-xs">{s.icon ?? '—'}</td>
                  <td>
                    <form
                      action={async () => {
                        'use server';
                        await togglePublishService(s.id, !s.published);
                      }}
                    >
                      <button type="submit" className={`admin-pill ${s.published ? 'admin-pill-published' : 'admin-pill-draft'}`}>
                        {s.published ? 'Published' : 'Draft'}
                      </button>
                    </form>
                  </td>
                  <td>
                    <Link href={`/admin/content/services/${s.id}`} className="admin-btn-secondary text-xs">Edit</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
