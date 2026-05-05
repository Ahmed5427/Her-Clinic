import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import ServiceEditor from '@/components/admin/ServiceEditor';

export const dynamic = 'force-dynamic';

export default async function NewServicePage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content/services" className="text-sm text-[var(--admin-muted)] hover:text-[var(--admin-ink)] inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to services
        </Link>
        <h1 className="font-display text-3xl mt-2">New service</h1>
      </div>
      <ServiceEditor mode="create" />
    </div>
  );
}
