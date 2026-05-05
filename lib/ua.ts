const BOT_RE = /bot|crawler|spider|crawling|preview|facebookexternalhit|headlesschrome|whatsapp|slackbot|twitterbot|googlebot/i;

export function isBot(userAgent: string | null | undefined) {
  if (!userAgent) return false;
  return BOT_RE.test(userAgent);
}

export function classifyDevice(userAgent: string | null | undefined): string {
  if (!userAgent) return 'unknown';
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad/.test(ua)) return 'tablet';
  if (/mobile|iphone|android.*mobile|blackberry|iemobile|opera mini/.test(ua)) return 'mobile';
  if (BOT_RE.test(userAgent)) return 'bot';
  return 'desktop';
}

export function refererHost(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  try {
    const u = new URL(referrer);
    return u.host || null;
  } catch {
    return null;
  }
}
