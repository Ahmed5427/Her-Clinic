'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import {
  updateContactInfo,
  updateWorkingHours,
  updateSocialLinks,
} from '@/app/admin/_actions/settings';
import type { ContactInfo, WorkingHours, SocialLinks } from '@/lib/supabase/types';

interface Props {
  contact: ContactInfo;
  hours: WorkingHours;
  social: SocialLinks;
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="admin-card p-6">
      <div className="mb-5">
        <div className="font-display text-xl">{title}</div>
        {hint ? <div className="text-xs text-[var(--admin-muted)] mt-1">{hint}</div> : null}
      </div>
      {children}
    </section>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <div className="mt-5 flex justify-end">
      <button type="submit" className="admin-btn-primary text-sm" disabled={pending}>
        <Save className="w-4 h-4" /> Save
      </button>
    </div>
  );
}

export default function SettingsForm({ contact, hours, social }: Props) {
  const [pending, startTransition] = useTransition();

  function wrap(action: (fd: FormData) => Promise<{ ok: boolean; error?: string } | undefined>) {
    return (fd: FormData) =>
      startTransition(async () => {
        const r = await action(fd);
        if (r && 'error' in r && r.error) toast.error(r.error);
        else toast.success('Saved');
      });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form action={wrap(updateContactInfo)}>
        <Section title="Contact info" hint="Phone, email and clinic address shown on the public site">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Phone</label>
              <input name="phone" defaultValue={contact.phone} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Email</label>
              <input name="email" type="email" defaultValue={contact.email} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Location — English</label>
              <input name="location_en" defaultValue={contact.location_en} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Location — Arabic</label>
              <input name="location_ar" dir="rtl" defaultValue={contact.location_ar} className="admin-input" />
            </div>
          </div>
          <SubmitButton pending={pending} />
        </Section>
      </form>

      <form action={wrap(updateWorkingHours)}>
        <Section title="Working hours" hint="Free-form line shown on the public site">
          <div className="space-y-4">
            <div>
              <label className="admin-label">English</label>
              <input name="en" defaultValue={hours.en} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Arabic</label>
              <input name="ar" dir="rtl" defaultValue={hours.ar} className="admin-input" />
            </div>
          </div>
          <SubmitButton pending={pending} />
        </Section>
      </form>

      <form action={wrap(updateSocialLinks)} className="lg:col-span-2">
        <Section title="Social links" hint="Full URLs (or mailto:/tel:). Leave empty to hide an icon.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Instagram</label>
              <input name="instagram" defaultValue={social.instagram} className="admin-input" placeholder="https://instagram.com/…" />
            </div>
            <div>
              <label className="admin-label">Facebook</label>
              <input name="facebook" defaultValue={social.facebook} className="admin-input" placeholder="https://facebook.com/…" />
            </div>
            <div>
              <label className="admin-label">WhatsApp</label>
              <input name="whatsapp" defaultValue={social.whatsapp} className="admin-input" placeholder="https://wa.me/20XXXXXXXXX" />
            </div>
            <div>
              <label className="admin-label">Email</label>
              <input name="email" defaultValue={social.email} className="admin-input" placeholder="mailto:info@…" />
            </div>
          </div>
          <SubmitButton pending={pending} />
        </Section>
      </form>
    </div>
  );
}
