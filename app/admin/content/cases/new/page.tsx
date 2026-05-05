import { requireAdmin } from '@/lib/auth';
import CaseEditor from '@/components/admin/CaseEditor';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NewCasePage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/content/cases"
          className="text-sm text-[var(--admin-muted)] hover:text-[var(--admin-ink)] inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to cases
        </Link>
        <h1 className="font-display text-3xl mt-2">New case</h1>
      </div>
      <CaseEditor mode="create" />
    </div>
  );
}
