import Link from 'next/link';
import { Inbox, Users, Eye, MessageCircle, ArrowUpRight } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import StatCard from '@/components/admin/StatCard';
import { formatDate, formatNumber } from '@/lib/utils';
import type { ContactSubmission } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

async function loadOverview() {
  const supabase = createClient();
  const since7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [visits7, visits30, submissions7, submissionsTotal, recentSubs, sessions7] =
    await Promise.all([
      supabase
        .from('page_visits')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', since7),
      supabase
        .from('page_visits')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', since30),
      supabase
        .from('contact_submissions')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', since7),
      supabase
        .from('contact_submissions')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('page_visits')
        .select('session_hash')
        .gte('created_at', since7),
    ]);

  const uniqueSessions7 = new Set(
    (sessions7.data ?? []).map((r) => r.session_hash as string)
  ).size;

  return {
    visits7: visits7.count ?? 0,
    visits30: visits30.count ?? 0,
    submissions7: submissions7.count ?? 0,
    submissionsTotal: submissionsTotal.count ?? 0,
    uniqueSessions7,
    recentSubs: (recentSubs.data ?? []) as ContactSubmission[],
  };
}

export default async function AdminOverview() {
  await requireAdmin();
  const data = await loadOverview();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Overview</h1>
        <p className="text-sm text-[var(--admin-muted)] mt-1">
          Key signals from the last 7 and 30 days.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Visits · 7d"
          value={formatNumber(data.visits7)}
          hint={`${formatNumber(data.visits30)} in 30d`}
          icon={Eye}
        />
        <StatCard
          label="Unique visitors · 7d"
          value={formatNumber(data.uniqueSessions7)}
          icon={Users}
        />
        <StatCard
          label="Submissions · 7d"
          value={formatNumber(data.submissions7)}
          hint={`${formatNumber(data.submissionsTotal)} all-time`}
          icon={Inbox}
        />
        <StatCard
          label="Avg per session"
          value={
            data.uniqueSessions7
              ? (data.visits7 / data.uniqueSessions7).toFixed(1)
              : '0'
          }
          icon={MessageCircle}
        />
      </div>

      <section className="admin-card">
        <div className="flex items-center justify-between p-5 border-b border-[var(--admin-line)]">
          <div>
            <h2 className="font-display text-xl">Recent submissions</h2>
            <p className="text-xs text-[var(--admin-muted)] mt-1">Latest 5 inquiries from the contact form</p>
          </div>
          <Link href="/admin/submissions" className="text-sm text-[var(--admin-accent)] hover:underline inline-flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Name</th>
              <th>Service</th>
              <th>Contact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recentSubs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-sm text-[var(--admin-muted)] py-10">
                  No submissions yet. They&apos;ll appear here as soon as the contact form is used.
                </td>
              </tr>
            ) : (
              data.recentSubs.map((s) => (
                <tr key={s.id}>
                  <td className="text-[var(--admin-muted)] text-xs whitespace-nowrap">{formatDate(s.created_at)}</td>
                  <td className="font-medium">{s.name}</td>
                  <td className="text-sm">{s.service ?? '—'}</td>
                  <td className="text-sm">
                    <div>{s.email}</div>
                    <div className="text-xs text-[var(--admin-muted)]">{s.phone ?? ''}</div>
                  </td>
                  <td>
                    <span className={`admin-pill admin-pill-${s.status}`}>{s.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </section>
    </div>
  );
}
