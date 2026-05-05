import { requireAdmin } from '@/lib/auth';
import { getSiteSettings } from '@/lib/site-data';
import ChatbotSettingsForm from '@/components/admin/ChatbotSettingsForm';

export const dynamic = 'force-dynamic';

export default async function ChatbotPage() {
  await requireAdmin();
  const settings = await getSiteSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Chatbot</h1>
        <p className="text-sm text-[var(--admin-muted)] mt-1">
          Tone, greeting, and suggested questions for the public concierge. The
          chatbot reads everything you publish on the site (services, cases,
          testimonials, FAQ, contact info) and answers in the user&apos;s language.
        </p>
      </div>
      <ChatbotSettingsForm initial={settings.chatbot} />
    </div>
  );
}
