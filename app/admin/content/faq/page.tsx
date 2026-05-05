import Link from 'next/link';
import { Plus } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { togglePublishFaq } from '@/app/admin/_actions/faq';
import type { FaqRow } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export default async function FaqListPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase
    .from('faq')
    .select('*')
    .order('position', { ascending: true });
  const rows = (data ?? []) as FaqRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">FAQ</h1>
          <p className="text-sm text-[var(--admin-muted)] mt-1">
            Questions and answers the chatbot leans on. Edit anytime — the chatbot picks up your changes on the next message.
          </p>
        </div>
        <Link href="/admin/content/faq/new" className="admin-btn-primary text-sm">
          <Plus className="w-4 h-4" /> New FAQ
        </Link>
      </div>

      <section className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-sm text-[var(--admin-muted)] py-12">
                  No FAQ entries yet.
                </td>
              </tr>
            ) : (
              rows.map((f) => (
                <tr key={f.id}>
                  <td className="text-[var(--admin-muted)] text-xs">{f.position}</td>
                  <td>
                    <div className="font-medium">{f.question_en}</div>
                    <div className="text-xs text-[var(--admin-muted)]" dir="rtl">{f.question_ar}</div>
                  </td>
                  <td>
                    <form
                      action={async () => {
                        'use server';
                        await togglePublishFaq(f.id, !f.published);
                      }}
                    >
                      <button
                        type="submit"
                        className={`admin-pill ${f.published ? 'admin-pill-published' : 'admin-pill-draft'}`}
                      >
                        {f.published ? 'Published' : 'Draft'}
                      </button>
                    </form>
                  </td>
                  <td>
                    <Link href={`/admin/content/faq/${f.id}`} className="admin-btn-secondary text-xs">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
