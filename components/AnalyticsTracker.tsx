'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const SESSION_KEY = '_hc_sess';

function getSessionId() {
  if (typeof window === 'undefined') return '';
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return '';
  }
}

interface Props {
  locale: string;
}

export default function AnalyticsTracker({ locale }: Props) {
  const pathname = usePathname();
  const sentRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!pathname) return;
    const sessionId = getSessionId();
    const key = `${sessionId}|${pathname}`;
    if (sentRef.current.has(key)) return;
    sentRef.current.add(key);

    const payload = JSON.stringify({
      path: pathname,
      locale,
      referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
      sessionId,
    });

    try {
      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        const blob = new Blob([payload], { type: 'application/json' });
        const ok = navigator.sendBeacon('/api/track', blob);
        if (ok) return;
      }
    } catch {
      // fall through to fetch
    }
    fetch('/api/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      /* swallow */
    });
  }, [pathname, locale]);

  return null;
}
