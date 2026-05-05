'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';

interface ChatbotProps {
  locale: string;
  greeting: string;
  suggested: string[];
  enabled: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const MAX_HISTORY = 12;

export default function Chatbot({ locale, greeting, suggested, enabled }: ChatbotProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isAr = locale === 'ar';

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { id: 'greeting', role: 'assistant', content: greeting },
      ]);
    }
  }, [open, greeting, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pending]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  if (!enabled) return null;

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setError(null);
    setInput('');

    const next: Message[] = [
      ...messages,
      { id: `u-${Date.now()}`, role: 'user', content: trimmed },
    ];
    setMessages(next);

    // Send only the recent slice to the API (skip the greeting placeholder).
    const apiMessages = next
      .filter((m) => m.id !== 'greeting')
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content }));

    setPending(true);
    abortRef.current = new AbortController();
    const assistantId = `a-${Date.now()}`;
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ locale, messages: apiMessages }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m))
        );
      }
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === 'AbortError'
          ? null
          : err instanceof Error
            ? err.message
            : 'Something went wrong.';
      if (msg) {
        setError(msg);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      }
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open ? (
          <motion.button
            key="chat-btn"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className={`fixed z-50 bottom-6 ${
              isAr ? 'left-6' : 'right-6'
            } group`}
            aria-label="Open chat"
          >
            <span className="absolute inset-0 rounded-full bg-rose-gold opacity-60 blur-xl scale-110 animate-pulse-slow" />
            <span className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-rose-500 via-primary-500 to-gold-500 text-white shadow-luxury">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium pr-1 hidden sm:inline">
                {isAr ? 'تحدثي معنا' : 'Chat with us'}
              </span>
              <Sparkles className="w-4 h-4 text-white/80" />
            </span>
          </motion.button>
        ) : null}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            dir={isAr ? 'rtl' : 'ltr'}
            className={`fixed z-50 bottom-6 ${
              isAr ? 'left-6' : 'right-6'
            } w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100vh-3rem))] flex flex-col rounded-3xl overflow-hidden border border-white/60 shadow-luxury bg-white/85 backdrop-blur-xl`}
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center gap-3 border-b border-cream-200 bg-gradient-to-r from-rose-50 via-cream-50 to-gold-50">
              <div className="w-10 h-10 rounded-full bg-white ring-1 ring-gold-200 shadow-soft flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mark.svg" alt="" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-lg leading-tight text-rose-gold">
                  {isAr ? 'كونسيرج العيادة' : 'Clinic Concierge'}
                </div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-gold-700">
                  {isAr ? 'مساعدة فورية' : 'Always here for you'}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-rose-600 transition-colors p-1.5"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
              {messages.map((m) => (
                <Bubble key={m.id} role={m.role} text={m.content} pending={pending && m.id === messages[messages.length - 1]?.id && m.role === 'assistant' && m.content === ''} isAr={isAr} />
              ))}

              {/* Suggested questions (only before user has interacted) */}
              {messages.length <= 1 && suggested.length > 0 ? (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-gold-700">
                    {isAr ? 'اقتراحات' : 'Try asking'}
                  </div>
                  {suggested.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      disabled={pending}
                      className="block w-full text-start text-sm bg-white/70 hover:bg-white border border-cream-200 hover:border-gold-300 rounded-2xl px-3 py-2 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              ) : null}

              {error ? (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  {error}
                </div>
              ) : null}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="px-3 py-3 border-t border-cream-200 bg-white/80 flex items-end gap-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder={isAr ? 'اكتبي رسالتك…' : 'Type your message…'}
                rows={1}
                disabled={pending}
                className="flex-1 resize-none rounded-2xl border border-cream-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-200/60 bg-white px-4 py-2.5 text-sm outline-none transition-colors max-h-32"
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-rose-500 via-primary-500 to-gold-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-center text-[10px] text-gold-700/70 pb-2 px-3">
              {isAr
                ? 'الردود مدعومة بالذكاء الاصطناعي وقد لا تكون كاملة. للتأكد، احجزي استشارة.'
                : 'Replies are AI-assisted and may be incomplete. For details, please book a consultation.'}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function Bubble({
  role,
  text,
  pending,
  isAr,
}: {
  role: 'user' | 'assistant';
  text: string;
  pending: boolean;
  isAr: boolean;
}) {
  const isUser = role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-gradient-to-br from-rose-500 to-primary-500 text-white shadow-soft'
            : 'bg-white border border-cream-200 text-gray-800 shadow-soft'
        }`}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {pending ? (
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '120ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '240ms' }} />
          </span>
        ) : (
          text || ' '
        )}
      </div>
    </motion.div>
  );
}
