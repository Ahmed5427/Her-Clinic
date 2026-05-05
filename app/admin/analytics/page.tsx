import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import AnalyticsCharts, { type SeriesPoint } from '@/components/admin/AnalyticsCharts';
import StatCard from '@/components/admin/StatCard';
import { Eye, Users, Globe2, MousePointerClick } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { refererHost } from '@/lib/ua';
import type { PageVisit } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

function bucketByDay(rows: PageVisit[]): SeriesPoint[] {
  const map = new Map<string, number>();
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    map.set(d.toISOString().slice(0, 10), 0);
  }
  for (const r of rows) {
    const day = r.created_at.slice(0, 10);
    if (map.has(day)) map.set(day, (map.get(day) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([k, v]) => ({
    label: k.slice(5),
    value: v,
  }));
}

function bucketByHour(rows: PageVisit[]): SeriesPoint[] {
  const counts = new Array(24).fill(0);
  for (const r of rows) {
    const hour = new Date(r.created_at).getHours();
    counts[hour]++;
  }
  return counts.map((value, i) => ({ label: String(i).padStart(2, '0'), value }));
}

function topGroup(rows: PageVisit[], key: 'path' | 'locale' | 'device', limit = 8): SeriesPoint[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const v = (r[key] as string | null) || 'unknown';
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

function topReferrers(rows: PageVisit[], limit = 8): SeriesPoint[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const host = refererHost(r.referrer) ?? 'direct';
    map.set(host, (map.get(host) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

export default async function AnalyticsPage() {
  await requireAdmin();
  const supabase = createClient();
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const since14 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [visits30, visits14] = await Promise.all([
    supabase
      .from('page_visits')
      .select('*')
      .gte('created_at', since30)
      .order('created_at', { ascending: false })
      .limit(20000),
    supabase
      .from('page_visits')
      .select('created_at')
      .gte('created_at', since14)
      .limit(20000),
  ]);

  const rows30 = (visits30.data ?? []) as PageVisit[];
  const rows14 = (visits14.data ?? []) as PageVisit[];
  const uniqueSessions = new Set(rows30.map((r) => r.session_hash)).size;
  const topCountries = topGroup(rows30 as PageVisit[], 'locale', 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Analytics</h1>
        <p className="text-sm text-[var(--admin-muted)] mt-1">
          Visitor insights from the last 30 days. Vercel Analytics tracks Web
          Vitals separately in production.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Visits · 30d" value={formatNumber(rows30.length)} icon={Eye} />
        <StatCard label="Unique sessions" value={formatNumber(uniqueSessions)} icon={Users} />
        <StatCard
          label="Avg per session"
          value={uniqueSessions ? (rows30.length / uniqueSessions).toFixed(1) : '0'}
          icon={MousePointerClick}
        />
        <StatCard
          label="Top locale"
          value={topCountries[0]?.label?.toUpperCase() ?? '—'}
          icon={Globe2}
        />
      </div>

      <AnalyticsCharts
        daily={bucketByDay(rows30)}
        hourly={bucketByHour(rows14)}
        topPages={topGroup(rows30, 'path', 8)}
        locales={topGroup(rows30, 'locale', 5)}
        devices={topGroup(rows30, 'device', 5)}
        referrers={topReferrers(rows30, 8)}
      />
    </div>
  );
}
