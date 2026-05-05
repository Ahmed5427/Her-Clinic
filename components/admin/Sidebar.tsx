'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  BarChart3,
  Sparkles,
  Image as ImageIcon,
  MessageSquareQuote,
  Palette,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/submissions', label: 'Submissions', icon: Inbox },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/content/cases', label: 'Before & After', icon: ImageIcon },
  { href: '/admin/content/services', label: 'Services', icon: Sparkles },
  { href: '/admin/content/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/content/branding', label: 'Branding & Logo', icon: Palette },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[var(--admin-line)] bg-white/60 backdrop-blur min-h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-[var(--admin-line)]">
        <Link href="/admin" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.svg" alt="" className="w-9 h-9" />
          <div>
            <div className="font-display text-lg leading-tight">Her Clinic</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--admin-muted)]">Admin</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-[var(--admin-ink)] text-white'
                  : 'text-[var(--admin-ink)]/80 hover:bg-stone-100'
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--admin-line)]">
        <a
          href="/en"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between text-xs text-[var(--admin-muted)] hover:text-[var(--admin-ink)] transition-colors"
        >
          View live site
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
}
