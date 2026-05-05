'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Trash2, Star } from 'lucide-react';
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '@/app/admin/_actions/testimonials';
import type { TestimonialRow } from '@/lib/supabase/types';

interface Props {
  mode: 'create' | 'edit';
  initial?: TestimonialRow;
}

export default function TestimonialEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    role_en: initial?.role_en ?? '',
    role_ar: initial?.role_ar ?? '',
    quote_en: initial?.quote_en ?? '',
    quote_ar: initial?.quote_ar ?? '',
    rating: initial?.rating ?? 5,
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
      const result = mode === 'create' ? await createTestimonial(fd) : await updateTestimonial(initial!.id, fd);
      if (result && 'error' in result && result.error) toast.error(result.error);
      else if (mode === 'edit') toast.success('Saved');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card p-6 space-y-4">
          <div>
            <label className="admin-label">Client name</label>
            <input className="admin-input" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Role — English</label>
              <input className="admin-input" value={form.role_en ?? ''}
                onChange={(e) => setForm({ ...form, role_en: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Role — Arabic</label>
              <input className="admin-input" dir="rtl" value={form.role_ar ?? ''}
                onChange={(e) => setForm({ ...form, role_ar: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="admin-label">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  className="p-1"
                  aria-label={`${n} stars`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      n <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Position</label>
              <input className="admin-input" type="number" min={0} max={999} value={form.position}
                onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox"
                  className="h-4 w-4 rounded border-[var(--admin-line)]"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                <span className="text-sm">Published</span>
              </label>
            </div>
          </div>
        </div>

        <div className="admin-card p-6 space-y-4">
          <div>
            <label className="admin-label">Quote — English</label>
            <textarea className="admin-input" rows={5} required value={form.quote_en}
              onChange={(e) => setForm({ ...form, quote_en: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Quote — Arabic</label>
            <textarea className="admin-input" rows={5} required dir="rtl" value={form.quote_ar}
              onChange={(e) => setForm({ ...form, quote_ar: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {mode === 'edit' ? (
          <button type="button" className="admin-btn-danger text-sm" disabled={pending}
            onClick={() => {
              if (!confirm('Delete this testimonial?')) return;
              startTransition(async () => {
                const r = await deleteTestimonial(initial!.id);
                if ('error' in r) toast.error(r.error);
                else { toast.success('Deleted'); router.push('/admin/content/testimonials'); }
              });
            }}>
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        ) : <span />}
        <button type="submit" className="admin-btn-primary text-sm" disabled={pending}>
          <Save className="w-4 h-4" />
          {pending ? 'Saving…' : mode === 'create' ? 'Create testimonial' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
