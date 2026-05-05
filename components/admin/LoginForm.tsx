'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from '@/app/admin/_actions/auth';
import { Lock, Mail } from 'lucide-react';

export default function LoginForm() {
  const search = useSearchParams();
  const next = search.get('next') ?? '/admin';
  const denied = search.get('denied');
  const [error, setError] = useState<string | null>(
    denied ? 'This account does not have admin access.' : null
  );
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await signIn(formData);
          if (result && 'error' in result) setError(result.error);
        });
      }}
      className="admin-card p-8 w-full max-w-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.svg" alt="" className="w-10 h-10" />
        <div>
          <div className="font-display text-xl leading-tight">Her Clinic</div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--admin-muted)]">Admin sign in</div>
        </div>
      </div>

      <input type="hidden" name="next" value={next} />

      <label className="admin-label" htmlFor="email">Email</label>
      <div className="relative mb-4">
        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]" />
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="admin-input pl-10"
          disabled={pending}
        />
      </div>

      <label className="admin-label" htmlFor="password">Password</label>
      <div className="relative mb-5">
        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]" />
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="admin-input pl-10"
          disabled={pending}
        />
      </div>

      {error ? (
        <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 mb-4">
          {error}
        </div>
      ) : null}

      <button type="submit" className="admin-btn-primary w-full" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-xs text-[var(--admin-muted)] mt-4 text-center">
        Need access? Create a user in your Supabase dashboard, then set the
        profile role to <code className="text-[var(--admin-ink)]">admin</code>.
      </p>
    </form>
  );
}
