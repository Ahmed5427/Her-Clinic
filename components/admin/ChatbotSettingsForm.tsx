'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { updateChatbotSettings } from '@/app/admin/_actions/chatbot';
import type { ChatbotSettings } from '@/lib/supabase/types';

interface Props {
  initial: ChatbotSettings;
}

export default function ChatbotSettingsForm({ initial }: Props) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    enabled: initial.enabled,
    greeting_en: initial.greeting_en,
    greeting_ar: initial.greeting_ar,
    persona_en: initial.persona_en,
    persona_ar: initial.persona_ar,
    suggested_en: (initial.suggested_en ?? []).join('\n'),
    suggested_ar: (initial.suggested_ar ?? []).join('\n'),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set('enabled', form.enabled ? 'true' : 'false');
    fd.set('greeting_en', form.greeting_en);
    fd.set('greeting_ar', form.greeting_ar);
    fd.set('persona_en', form.persona_en);
    fd.set('persona_ar', form.persona_ar);
    fd.set('suggested_en', form.suggested_en);
    fd.set('suggested_ar', form.suggested_ar);
    startTransition(async () => {
      const r = await updateChatbotSettings(fd);
      if (r && 'error' in r && r.error) toast.error(r.error);
      else toast.success('Saved');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="admin-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-display text-xl">Chatbot</div>
            <p className="text-xs text-[var(--admin-muted)] mt-1">
              Toggle the floating concierge on or off across the public site.
            </p>
          </div>
          <label className="inline-flex items-center gap-3 cursor-pointer">
            <span className="text-sm text-[var(--admin-muted)]">{form.enabled ? 'On' : 'Off'}</span>
            <span className="relative inline-flex h-6 w-11 items-center">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              />
              <span className="absolute inset-0 rounded-full bg-stone-200 peer-checked:bg-[var(--admin-ink)] transition-colors" />
              <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </span>
          </label>
        </div>
      </section>

      <section className="admin-card p-6 space-y-4">
        <div>
          <div className="font-display text-xl">Greeting</div>
          <p className="text-xs text-[var(--admin-muted)] mt-1">First message shown when the chat opens.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">English</label>
            <textarea
              rows={3}
              className="admin-input"
              value={form.greeting_en}
              onChange={(e) => setForm({ ...form, greeting_en: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">Arabic</label>
            <textarea
              rows={3}
              dir="rtl"
              className="admin-input"
              value={form.greeting_ar}
              onChange={(e) => setForm({ ...form, greeting_ar: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="admin-card p-6 space-y-4">
        <div>
          <div className="font-display text-xl">Persona &amp; tone</div>
          <p className="text-xs text-[var(--admin-muted)] mt-1">
            How the chatbot should sound. Keep this short and concrete — it&apos;s
            included in every message to the AI.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">English</label>
            <textarea
              rows={5}
              className="admin-input"
              value={form.persona_en}
              onChange={(e) => setForm({ ...form, persona_en: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">Arabic</label>
            <textarea
              rows={5}
              dir="rtl"
              className="admin-input"
              value={form.persona_ar}
              onChange={(e) => setForm({ ...form, persona_ar: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="admin-card p-6 space-y-4">
        <div>
          <div className="font-display text-xl">Suggested questions</div>
          <p className="text-xs text-[var(--admin-muted)] mt-1">
            One question per line, max 8 each. Shown as one-tap chips when the chat opens.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">English</label>
            <textarea
              rows={6}
              className="admin-input font-mono text-xs"
              value={form.suggested_en}
              onChange={(e) => setForm({ ...form, suggested_en: e.target.value })}
              placeholder={'What services do you offer?\nWhat are your working hours?'}
            />
          </div>
          <div>
            <label className="admin-label">Arabic</label>
            <textarea
              rows={6}
              dir="rtl"
              className="admin-input font-mono text-xs"
              value={form.suggested_ar}
              onChange={(e) => setForm({ ...form, suggested_ar: e.target.value })}
              placeholder={'ما هي الخدمات؟\nما هي ساعات العمل؟'}
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" className="admin-btn-primary text-sm" disabled={pending}>
          <Save className="w-4 h-4" /> {pending ? 'Saving…' : 'Save chatbot settings'}
        </button>
      </div>
    </form>
  );
}
