'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Trash2 } from 'lucide-react';
import {
  createCase,
  updateCase,
  deleteCase,
  uploadCaseImage,
} from '@/app/admin/_actions/cases';
import ImageDropzone from './ImageDropzone';
import type { CaseRow } from '@/lib/supabase/types';

type Mode = 'create' | 'edit';

interface Props {
  mode: Mode;
  initial?: CaseRow;
}

export default function CaseEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    slug: initial?.slug ?? '',
    title_en: initial?.title_en ?? '',
    title_ar: initial?.title_ar ?? '',
    description_en: initial?.description_en ?? '',
    description_ar: initial?.description_ar ?? '',
    position: initial?.position ?? 0,
    published: initial?.published ?? false,
  });

  function buildFormData() {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (typeof v === 'boolean') fd.set(k, v ? 'true' : 'false');
      else fd.set(k, String(v ?? ''));
    });
    return fd;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const fd = buildFormData();
      const result = mode === 'create' ? await createCase(fd) : await updateCase(initial!.id, fd);
      if (result && 'error' in result && result.error) {
        toast.error(result.error);
      } else if (mode === 'edit') {
        toast.success('Saved');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card p-6 space-y-4">
          <div>
            <label className="admin-label" htmlFor="slug">Slug</label>
            <input
              id="slug"
              required
              className="admin-input"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="lips, skin, contour…"
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="title_en">Title — English</label>
            <input id="title_en" required className="admin-input" value={form.title_en}
              onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
          </div>
          <div>
            <label className="admin-label" htmlFor="title_ar">Title — Arabic</label>
            <input id="title_ar" required className="admin-input" dir="rtl" value={form.title_ar}
              onChange={(e) => setForm({ ...form, title_ar: e.target.value })} />
          </div>
          <div>
            <label className="admin-label" htmlFor="description_en">Description — English</label>
            <textarea id="description_en" rows={4} className="admin-input"
              value={form.description_en}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
          </div>
          <div>
            <label className="admin-label" htmlFor="description_ar">Description — Arabic</label>
            <textarea id="description_ar" rows={4} dir="rtl" className="admin-input"
              value={form.description_ar}
              onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label" htmlFor="position">Position</label>
              <input id="position" type="number" min={0} max={999} className="admin-input"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--admin-line)] text-[var(--admin-ink)] focus:ring-[var(--admin-gold)]"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                <span className="text-sm">Published</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {mode === 'edit' && initial ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ImageDropzone
                label="Before"
                currentUrl={initial.before_url}
                onUpload={(fd) => uploadCaseImage(initial.id, 'before', fd)}
              />
              <ImageDropzone
                label="After"
                currentUrl={initial.after_url}
                onUpload={(fd) => uploadCaseImage(initial.id, 'after', fd)}
              />
            </div>
          ) : (
            <div className="admin-card p-6 text-sm text-[var(--admin-muted)]">
              Save the case first, then upload before / after images.
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {mode === 'edit' ? (
          <button
            type="button"
            className="admin-btn-danger text-sm"
            disabled={pending}
            onClick={() => {
              if (!confirm('Delete this case? This cannot be undone.')) return;
              startTransition(async () => {
                const r = await deleteCase(initial!.id);
                if ('error' in r) toast.error(r.error);
                else {
                  toast.success('Case deleted');
                  router.push('/admin/content/cases');
                }
              });
            }}
          >
            <Trash2 className="w-4 h-4" /> Delete case
          </button>
        ) : <span />}
        <button type="submit" className="admin-btn-primary text-sm" disabled={pending}>
          <Save className="w-4 h-4" />
          {pending ? 'Saving…' : mode === 'create' ? 'Create case' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
