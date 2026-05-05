import { requireAdmin } from '@/lib/auth';
import { getSiteSettings } from '@/lib/site-data';
import SettingsForm from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  await requireAdmin();
  const s = await getSiteSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Site settings</h1>
        <p className="text-sm text-[var(--admin-muted)] mt-1">
          Contact info, working hours and social links shown across the public site.
        </p>
      </div>
      <SettingsForm contact={s.contact_info} hours={s.working_hours} social={s.social_links} />
    </div>
  );
}
