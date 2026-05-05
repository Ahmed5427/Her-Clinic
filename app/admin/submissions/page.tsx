import { Download } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import SubmissionRow from '@/components/admin/SubmissionRow';
import type { ContactSubmission, SubmissionStatus } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

const STATUSES: ('all' | SubmissionStatus)[] = ['all', 'new', 'contacted', 'archived'];

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  await requireAdmin();
  const status = (searchParams.status ?? 'all') as 'all' | SubmissionStatus;
  const q = (searchParams.q ?? '').trim();

  const supabase = createClient();
  let query = supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
  if (status !== 'all') query = query.eq('status', status);
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,message.ilike.%${q}%`);
  const { data } = await query.limit(500);
  const rows = (data ?? []) as ContactSubmission[];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">Submissions</h1>
          <p className="text-sm text-[var(--admin-muted)] mt-1">
            {rows.length} {rows.length === 1 ? 'inquiry' : 'inquiries'} matching your filters
          </p>
        </div>
        <a href="/api/admin/submissions/export" className="admin-btn-secondary text-sm">
          <Download className="w-4 h-4" /> Export CSV
        </a>
      </div>

      <form className="admin-card p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              name="status"
              value={s}
              type="submit"
              className={`text-xs px-3 py-1.5 rounded-full border ${
                status === s
                  ? 'bg-[var(--admin-ink)] text-white border-[var(--admin-ink)]'
                  : 'bg-white border-[var(--admin-line)] hover:border-[var(--admin-ink)]'
              }`}
            >
              {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, email, phone, message…"
          className="admin-input flex-1 min-w-[220px]"
        />
        <input type="hidden" name="status" value={status} />
        <button type="submit" className="admin-btn-secondary text-sm">Search</button>
      </form>

      <section className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-sm text-[var(--admin-muted)] py-12">
                  No submissions match these filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => <SubmissionRow key={row.id} row={row} />)
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
