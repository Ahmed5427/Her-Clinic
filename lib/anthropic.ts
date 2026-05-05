import 'server-only';
import Anthropic from '@anthropic-ai/sdk';

let cached: Anthropic | null = null;

export function getAnthropic() {
  if (cached) return cached;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error('Missing ANTHROPIC_API_KEY env var');
  }
  cached = new Anthropic({ apiKey: key });
  return cached;
}

export const CHAT_MODEL = 'claude-haiku-4-5';
