import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getAnthropic, CHAT_MODEL } from '@/lib/anthropic';
import { buildChatbotContext } from '@/lib/chatbot';
import { chatRequestSchema } from '@/lib/validators';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
      { status: 400 }
    );
  }

  const ctx = await buildChatbotContext();
  if (!ctx.enabled) {
    return NextResponse.json({ error: 'Chatbot is disabled.' }, { status: 503 });
  }

  // Last message must be from the user.
  const last = parsed.data.messages[parsed.data.messages.length - 1];
  if (!last || last.role !== 'user') {
    return NextResponse.json(
      { error: 'Last message must be from the user.' },
      { status: 400 }
    );
  }

  let anthropic: Anthropic;
  try {
    anthropic = getAnthropic();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Anthropic not configured' },
      { status: 500 }
    );
  }

  const stream = anthropic.messages.stream({
    model: CHAT_MODEL,
    max_tokens: 1024,
    // Disable thinking for low-latency chat replies.
    thinking: { type: 'disabled' },
    // Cache the long, byte-stable system prompt. Subsequent chat turns
    // (within the cache window) reuse it for ~10% the cost.
    system: [
      {
        type: 'text',
        text: ctx.systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: parsed.data.messages.map((m) => ({
      role: m.role,
      // Append the locale hint once at the very last user turn so the
      // system prompt prefix stays byte-stable for cache hits.
      content:
        m === last
          ? `[reply_in_locale=${parsed.data.locale}]\n\n${m.content}`
          : m.content,
    })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Stream error';
        controller.enqueue(encoder.encode(`\n\n[error] ${message}`));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.controller.abort();
    },
  });

  return new Response(readable, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-accel-buffering': 'no',
    },
  });
}
