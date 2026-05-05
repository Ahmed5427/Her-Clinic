import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import TestimonialEditor from '@/components/admin/TestimonialEditor';

export const dynamic = 'force-dynamic';

export default async function NewTestimonialPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content/testimonials" className="text-sm text-[var(--admin-muted)] hover:text-[var(--admin-ink)] inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to testimonials
        </Link>
        <h1 className="font-display text-3xl mt-2">New testimonial</h1>
      </div>
      <TestimonialEditor mode="create" />
    </div>
  );
}
