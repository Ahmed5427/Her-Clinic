import 'server-only';
import {
  getCases,
  getServices,
  getTestimonials,
  getSiteSettings,
  getFaq,
} from './site-data';
import type {
  CaseRow,
  ServiceRow,
  TestimonialRow,
  FaqRow,
  SiteSettings,
} from './supabase/types';

/**
 * Builds the static system prompt for the public chatbot. Everything the
 * admin manages flows into this prompt; the user's question and locale
 * are appended via messages, after the cache breakpoint.
 *
 * IMPORTANT: this string must be byte-stable across requests for prompt
 * caching to fire. Order rows deterministically (by `position`), strip
 * trailing whitespace, and avoid any timestamps or per-request data.
 */
export interface ChatbotContext {
  systemPrompt: string;
  enabled: boolean;
  greeting: { en: string; ar: string };
  suggested: { en: string[]; ar: string[] };
}

function fmtCases(rows: CaseRow[]) {
  if (rows.length === 0) return 'No published before/after cases yet.';
  return rows
    .map(
      (c, i) =>
        `${i + 1}. ${c.title_en} / ${c.title_ar}` +
        (c.description_en ? `\n   • EN: ${c.description_en}` : '') +
        (c.description_ar ? `\n   • AR: ${c.description_ar}` : '')
    )
    .join('\n');
}

function fmtServices(rows: ServiceRow[]) {
  if (rows.length === 0) return 'No published services.';
  return rows
    .map(
      (s, i) =>
        `${i + 1}. ${s.title_en} / ${s.title_ar}` +
        (s.description_en ? `\n   • EN: ${s.description_en}` : '') +
        (s.description_ar ? `\n   • AR: ${s.description_ar}` : '')
    )
    .join('\n');
}

function fmtTestimonials(rows: TestimonialRow[]) {
  if (rows.length === 0) return 'No published testimonials yet.';
  return rows
    .map((t, i) => `${i + 1}. ${t.name} (${t.role_en ?? ''}): "${t.quote_en}"`)
    .join('\n');
}

function fmtFaq(rows: FaqRow[]) {
  if (rows.length === 0) return 'No FAQ entries yet.';
  return rows
    .map(
      (f, i) =>
        `${i + 1}. EN — Q: ${f.question_en}\n     A: ${f.answer_en}\n   AR — س: ${f.question_ar}\n     ج: ${f.answer_ar}`
    )
    .join('\n\n');
}

function fmtSettings(s: SiteSettings) {
  return [
    `Phone: ${s.contact_info.phone}`,
    `Email: ${s.contact_info.email}`,
    `Location (EN): ${s.contact_info.location_en}`,
    `Location (AR): ${s.contact_info.location_ar}`,
    `Working hours (EN): ${s.working_hours.en}`,
    `Working hours (AR): ${s.working_hours.ar}`,
    s.social_links.instagram ? `Instagram: ${s.social_links.instagram}` : null,
    s.social_links.facebook ? `Facebook: ${s.social_links.facebook}` : null,
    s.social_links.whatsapp ? `WhatsApp: ${s.social_links.whatsapp}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

export async function buildChatbotContext(): Promise<ChatbotContext> {
  const [cases, services, testimonials, settings, faq] = await Promise.all([
    getCases(),
    getServices(),
    getTestimonials(),
    getSiteSettings(),
    getFaq(),
  ]);

  const { chatbot } = settings;

  const systemPrompt = [
    "# Role",
    chatbot.persona_en.trim(),
    '',
    chatbot.persona_ar.trim(),
    '',
    '# Behaviour rules',
    "1. Detect the user's language from their message (English or Arabic) and respond in that language.",
    '2. Keep answers brief (2–4 short sentences) unless the user asks for detail.',
    '3. Only answer using information in this prompt. If a question is outside scope (medical advice, exact prices we did not list, comparisons with competitors), politely steer the user to a private consultation.',
    '4. Never invent prices, durations, ingredients, or doctor credentials. If a fact is missing, say so warmly and offer to book a consultation.',
    '5. When relevant, encourage the user to use the contact form, WhatsApp, or to call. Never share credentials or admin links.',
    '6. Stay refined and feminine — no slang, no emoji unless the user uses them first.',
    '',
    '# About the clinic',
    'Dr. Reham Mohamed is a certified aesthetic physician. Her clinic is a luxury beauty atelier offering skin care, aesthetic treatments, laser, body, hair and wellness programmes. The signature promise is natural-looking, refined results.',
    '',
    '# Services (published)',
    fmtServices(services),
    '',
    '# Before & after cases (published)',
    fmtCases(cases),
    '',
    '# Testimonials (published)',
    fmtTestimonials(testimonials),
    '',
    '# Frequently asked questions',
    fmtFaq(faq),
    '',
    '# Contact information',
    fmtSettings(settings),
    '',
    '# Closing',
    'If the user expresses interest in booking, give them the most direct option (WhatsApp link if set, otherwise the contact form on the site).',
  ].join('\n');

  return {
    systemPrompt,
    enabled: chatbot.enabled,
    greeting: { en: chatbot.greeting_en, ar: chatbot.greeting_ar },
    suggested: { en: chatbot.suggested_en, ar: chatbot.suggested_ar },
  };
}
