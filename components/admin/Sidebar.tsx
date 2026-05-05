'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition, useState, useEffect, type MouseEvent } from 'react';
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
  HelpCircle,
  Bot,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const links: NavLink[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/submissions', label: 'Submissions', icon: Inbox },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/content/cases', label: 'Before & After', icon: ImageIcon },
  { href: '/admin/content/services', label: 'Services', icon: Sparkles },
  { href: '/admin/content/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/content/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/content/chatbot', label: 'Chatbot', icon: Bot },
  { href: '/admin/content/branding', label: 'Branding & Logo', icon: Palette },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

function NavLinkItem({
  link,
  active,
  pending,
  onClick,
}: {
  link: NavLink;
  active: boolean;
  pending: boolean;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      href={link.href}
      prefetch
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative',
        active
          ? 'bg-[var(--admin-ink)] text-white'
          : pending
            ? 'bg-stone-200 text-[var(--admin-ink)]'
            : 'text-[var(--admin-ink)]/80 hover:bg-stone-100'
      )}
    >
      <link.icon className="w-4 h-4" />
      <span className="flex-1">{link.label}</span>
      {pending ? (
        <span className="w-3 h-3 rounded-full border-2 border-[var(--admin-gold)] border-t-transparent animate-spin" />
      ) : null}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const navigate = (href: string) => {
    if (href === pathname) return;
    setPendingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  // When the route actually changes, clear pending state.
  useEffect(() => {
    if (pendingHref && (pathname === pendingHref || pathname.startsWith(pendingHref + '/'))) {
      setPendingHref(null);
    }
  }, [pathname, pendingHref]);

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[var(--admin-line)] bg-white/60 backdrop-blur min-h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-[var(--admin-line)]">
        <Link href="/admin" prefetch className="flex items-center gap-3">
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
          const pending = pendingHref === link.href && !active;
          return (
            <NavLinkItem
              key={link.href}
              link={link}
              active={active}
              pending={pending}
              onClick={(e) => {
                e.preventDefault();
                navigate(link.href);
              }}
            />
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
