import { signOut } from '@/app/admin/_actions/auth';
import { LogOut } from 'lucide-react';

interface Props {
  email: string;
}

export default function TopBar({ email }: Props) {
  return (
    <header className="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-[var(--admin-line)] bg-white/70 backdrop-blur sticky top-0 z-10">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--admin-muted)]">Welcome back</div>
        <div className="font-display text-xl">{email}</div>
      </div>
      <form action={signOut}>
        <button type="submit" className="admin-btn-secondary text-sm">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </form>
    </header>
  );
}
