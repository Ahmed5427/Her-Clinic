import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}

export default function StatCard({ label, value, hint, icon: Icon }: Props) {
  return (
    <div className="admin-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-[var(--admin-muted)]">{label}</div>
          <div className="font-display text-3xl mt-2">{value}</div>
          {hint ? <div className="text-xs text-[var(--admin-muted)] mt-2">{hint}</div> : null}
        </div>
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--admin-ink)]" />
        </div>
      </div>
    </div>
  );
}
