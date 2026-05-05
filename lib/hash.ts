import 'server-only';
import { createHash } from 'crypto';

function todaySalt() {
  return new Date().toISOString().slice(0, 10);
}

export function sessionHash(ip: string, userAgent: string) {
  const secret = process.env.ANALYTICS_SECRET ?? '';
  return createHash('sha256').update(`${ip}|${userAgent}|${todaySalt()}|${secret}`).digest('hex');
}
