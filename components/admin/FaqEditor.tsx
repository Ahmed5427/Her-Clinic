'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Trash2 } from 'lucide-react';
import {
  createFaq,
  updateFaq,
  deleteFaq,
} from '@/app/admin/_actions/faq';
import type { FaqRow } from '@/lib/supabase/types';

interface Props {
  mode: 'create' | 'edit';
  initial?: FaqRow;
}

export default function FaqEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    question_en: initial?.question_en ?? '',
    question_ar: initial?.question_ar ?? '',
    answer_en: initial?.answer_en ?? '',
    answer_ar: initial?.answer_ar ?? '',
    position: initial?.position ?? 0,
    published: initial?.published ?? true,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (typeof v === 'boolean') fd.set(k, v ? 'true' : 'false');
      else fd.set(k, String(v ?? ''));
    });
    startTransition(async () => {
      const result =
        mode === 'create' ? await createFaq(fd) : await updateFaq(initial!.id, fd);
      if (result && 'error' in result && result.error) toast.error(result.error);
      else if (mode === 'edit') toast.success('Saved');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card p-6 space-y-4">
          <div>
            <label className="admin-label">Question — English</label>
            <input
              required
              className="admin-input"
              value={form.question_en}
              onChange={(e) => setForm({ ...form, question_en: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">Question — Arabic</label>
            <input
              required
              dir="rtl"
              className="admin-input"
              value={form.question_ar}
              onChange={(e) => setForm({ ...form, question_ar: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Position</label>
              <input
                type="number"
                min={0}
                max={999}
                className="admin-input"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--admin-line)]"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                <span className="text-sm">Published</span>
              </label>
            </div>
          </div>
        </div>
        <div className="admin-card p-6 space-y-4">
          <div>
            <label className="admin-label">Answer — English</label>
            <textarea
              required
              rows={6}
              className="admin-input"
              value={form.answer_en}
              onChange={(e) => setForm({ ...form, answer_en: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">Answer — Arabic</label>
            <textarea
              required
              rows={6}
              dir="rtl"
              className="admin-input"
              value={form.answer_ar}
              onChange={(e) => setForm({ ...form, answer_ar: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {mode === 'edit' ? (
          <button
            type="button"
            className="admin-btn-danger text-sm"
            disabled={pending}
            onClick={() => {
              if (!confirm('Delete this FAQ?')) return;
              startTransition(async () => {
                const r = await deleteFaq(initial!.id);
                if ('error' in r) toast.error(r.error);
                else {
                  toast.success('Deleted');
                  router.push('/admin/content/faq');
                }
              });
            }}
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="admin-btn-primary text-sm" disabled={pending}>
          <Save className="w-4 h-4" />
          {pending ? 'Saving…' : mode === 'create' ? 'Create FAQ' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
