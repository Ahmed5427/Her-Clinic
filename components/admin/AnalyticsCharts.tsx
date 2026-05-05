'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const PALETTE = ['#b04632', '#b8893a', '#dc5775', '#dcb766', '#c79666', '#8e3527', '#dab48b'];

export interface SeriesPoint {
  label: string;
  value: number;
}

interface Props {
  daily: SeriesPoint[];
  topPages: SeriesPoint[];
  locales: SeriesPoint[];
  referrers: SeriesPoint[];
  devices: SeriesPoint[];
  hourly: SeriesPoint[];
}

function ChartCard({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="admin-card p-5">
      <div className="mb-4">
        <div className="font-display text-lg leading-tight">{title}</div>
        {hint ? <div className="text-xs text-[var(--admin-muted)] mt-0.5">{hint}</div> : null}
      </div>
      <div style={{ width: '100%', height: 240 }}>{children}</div>
    </div>
  );
}

export default function AnalyticsCharts({ daily, topPages, locales, referrers, devices, hourly }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <ChartCard title="Daily traffic" hint="Page views over the last 30 days">
        <ResponsiveContainer>
          <LineChart data={daily} margin={{ top: 6, right: 6, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={PALETTE[0]} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Peak hours" hint="Visits by hour of day, last 14 days">
        <ResponsiveContainer>
          <BarChart data={hourly} margin={{ top: 6, right: 6, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill={PALETTE[1]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top pages" hint="Most viewed paths, last 30 days">
        <ResponsiveContainer>
          <BarChart data={topPages} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="label" type="category" tick={{ fontSize: 11 }} width={140} />
            <Tooltip />
            <Bar dataKey="value" fill={PALETTE[2]} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top referrers" hint="External hosts driving traffic">
        <ResponsiveContainer>
          <BarChart data={referrers} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="label" type="category" tick={{ fontSize: 11 }} width={140} />
            <Tooltip />
            <Bar dataKey="value" fill={PALETTE[3]} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Locales" hint="Language split">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={locales} dataKey="value" nameKey="label" outerRadius={80} innerRadius={40} paddingAngle={2}>
              {locales.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Devices" hint="Where visitors are coming from">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={devices} dataKey="value" nameKey="label" outerRadius={80} innerRadius={40} paddingAngle={2}>
              {devices.map((_, i) => (
                <Cell key={i} fill={PALETTE[(i + 2) % PALETTE.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
