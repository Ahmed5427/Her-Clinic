import { signOut } from '@/app/admin/_actions/auth';
import { LogOut, Menu } from 'lucide-react';

interface Props {
  email: string;
  onMenuClick?: () => void;
}

export default function TopBar({ email, onMenuClick }: Props) {
  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-4 border-b border-[var(--admin-line)] bg-white/70 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-stone-100 text-[var(--admin-ink)] shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--admin-muted)]">Welcome back</div>
          <div className="font-display text-lg lg:text-xl truncate max-w-[160px] sm:max-w-xs lg:max-w-none">
            {email}
          </div>
        </div>
      </div>
      <form action={signOut} className="shrink-0">
        <button type="submit" className="admin-btn-secondary text-sm">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </form>
    </header>
  );
}
