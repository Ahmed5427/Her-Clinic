import { requireAdmin } from '@/lib/auth';
import { getSiteSettings } from '@/lib/site-data';
import LogoUploader from '@/components/admin/LogoUploader';

export const dynamic = 'force-dynamic';

export default async function BrandingPage() {
  await requireAdmin();
  const settings = await getSiteSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Branding & Logo</h1>
        <p className="text-sm text-[var(--admin-muted)] mt-1">
          Replace the brand marks shown across the public site. Changes go live immediately.
        </p>
      </div>
      <LogoUploader initial={settings.branding} />
    </div>
  );
}
