import Link from 'next/link';
import { Plus, ImageIcon } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { togglePublishCase } from '@/app/admin/_actions/cases';
import type { CaseRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export default async function CasesListPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase
    .from('before_after_cases')
    .select('*')
    .order('position', { ascending: true });
  const rows = (data ?? []) as CaseRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">Before & After</h1>
          <p className="text-sm text-[var(--admin-muted)] mt-1">
            Manage the use cases that show in the public Results gallery.
          </p>
        </div>
        <Link href="/admin/content/cases/new" className="admin-btn-primary text-sm">
          <Plus className="w-4 h-4" /> New case
        </Link>
      </div>

      <section className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Slug</th>
              <th>Images</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-sm text-[var(--admin-muted)] py-12">
                  No cases yet. <Link href="/admin/content/cases/new" className="text-[var(--admin-accent)] underline">Create one</Link>.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="text-[var(--admin-muted)] text-xs">{row.position}</td>
                  <td>
                    <div className="font-medium">{row.title_en}</div>
                    <div className="text-xs text-[var(--admin-muted)]" dir="rtl">{row.title_ar}</div>
                  </td>
                  <td className="text-xs font-mono text-[var(--admin-muted)]">{row.slug}</td>
                  <td>
                    <div className="flex items-center gap-2 text-xs">
                      <Pill on={!!row.before_url} label="Before" />
                      <Pill on={!!row.after_url} label="After" />
                    </div>
                  </td>
                  <td>
                    <form
                      action={async () => {
                        'use server';
                        await togglePublishCase(row.id, !row.published);
                      }}
                    >
                      <button
                        type="submit"
                        className={`admin-pill ${row.published ? 'admin-pill-published' : 'admin-pill-draft'}`}
                      >
                        {row.published ? 'Published' : 'Draft'}
                      </button>
                    </form>
                  </td>
                  <td>
                    <Link href={`/admin/content/cases/${row.id}`} className="admin-btn-secondary text-xs">
                      Edit
                    </Link>
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

function Pill({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
        on ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
      }`}
    >
      <ImageIcon className="w-3 h-3" /> {label}
    </span>
  );
}
