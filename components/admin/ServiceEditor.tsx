'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Trash2 } from 'lucide-react';
import {
  createService,
  updateService,
  deleteService,
} from '@/app/admin/_actions/services';
import type { ServiceRow } from '@/lib/supabase/types';

const ICON_OPTIONS = [
  'Sparkles',
  'Droplet',
  'Zap',
  'Leaf',
  'Activity',
  'Scissors',
  'Heart',
  'Star',
  'Flower2',
];

interface Props {
  mode: 'create' | 'edit';
  initial?: ServiceRow;
}

export default function ServiceEditor({ mode, initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    slug: initial?.slug ?? '',
    icon: initial?.icon ?? 'Sparkles',
    title_en: initial?.title_en ?? '',
    title_ar: initial?.title_ar ?? '',
    description_en: initial?.description_en ?? '',
    description_ar: initial?.description_ar ?? '',
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
        mode === 'create' ? await createService(fd) : await updateService(initial!.id, fd);
      if (result && 'error' in result && result.error) toast.error(result.error);
      else if (mode === 'edit') toast.success('Saved');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card p-6 space-y-4">
          <div>
            <label className="admin-label">Slug</label>
            <input className="admin-input" required value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Icon</label>
            <select className="admin-input" value={form.icon ?? ''}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}>
              {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Title — English</label>
            <input className="admin-input" required value={form.title_en}
              onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Title — Arabic</label>
            <input className="admin-input" required dir="rtl" value={form.title_ar}
              onChange={(e) => setForm({ ...form, title_ar: e.target.value })} />
          </div>
        </div>
        <div className="admin-card p-6 space-y-4">
          <div>
            <label className="admin-label">Description — English</label>
            <textarea className="admin-input" rows={5} value={form.description_en ?? ''}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Description — Arabic</label>
            <textarea className="admin-input" rows={5} dir="rtl" value={form.description_ar ?? ''}
              onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
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
      </div>

      <div className="flex items-center justify-between">
        {mode === 'edit' ? (
          <button type="button" className="admin-btn-danger text-sm" disabled={pending}
            onClick={() => {
              if (!confirm('Delete this service?')) return;
              startTransition(async () => {
                const r = await deleteService(initial!.id);
                if ('error' in r) toast.error(r.error);
                else { toast.success('Deleted'); router.push('/admin/content/services'); }
              });
            }}>
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        ) : <span />}
        <button type="submit" className="admin-btn-primary text-sm" disabled={pending}>
          <Save className="w-4 h-4" />
          {pending ? 'Saving…' : mode === 'create' ? 'Create service' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
