import Link from 'next/link';
import { Plus, Star } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { togglePublishTestimonial } from '@/app/admin/_actions/testimonials';
import type { TestimonialRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export default async function TestimonialsListPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .order('position', { ascending: true });
  const rows = (data ?? []) as TestimonialRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">Testimonials</h1>
          <p className="text-sm text-[var(--admin-muted)] mt-1">
            Quotes that rotate in the public Testimonials section.
          </p>
        </div>
        <Link href="/admin/content/testimonials/new" className="admin-btn-primary text-sm">
          <Plus className="w-4 h-4" /> New testimonial
        </Link>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rows.length === 0 ? (
          <div className="admin-card p-8 text-sm text-[var(--admin-muted)] text-center col-span-2">
            No testimonials yet.
          </div>
        ) : (
          rows.map((t) => (
            <article key={t.id} className="admin-card p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <form
                  action={async () => {
                    'use server';
                    await togglePublishTestimonial(t.id, !t.published);
                  }}
                >
                  <button type="submit" className={`admin-pill ${t.published ? 'admin-pill-published' : 'admin-pill-draft'}`}>
                    {t.published ? 'Published' : 'Draft'}
                  </button>
                </form>
              </div>
              <p className="font-display italic text-base text-[var(--admin-ink)]/90 mb-3 line-clamp-3">
                “{t.quote_en}”
              </p>
              <div className="text-sm font-medium">{t.name}</div>
              <div className="text-xs text-[var(--admin-muted)]">{t.role_en}</div>
              <div className="mt-4">
                <Link href={`/admin/content/testimonials/${t.id}`} className="admin-btn-secondary text-xs">Edit</Link>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
