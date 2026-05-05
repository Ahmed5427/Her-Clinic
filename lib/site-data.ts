import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type {
  CaseRow,
  ServiceRow,
  TestimonialRow,
  SiteSettingRow,
  BrandingSettings,
  ContactInfo,
  WorkingHours,
  SocialLinks,
  ChatbotSettings,
  FaqRow,
} from '@/lib/supabase/types';

const FALLBACK_BRANDING: BrandingSettings = {
  logo_url: '/logo.svg',
  logo_mark_url: '/logo-mark.svg',
};

const FALLBACK_CONTACT: ContactInfo = {
  phone: '+20 123 456 7890',
  email: 'info@drrehammohamed.com',
  location_en: 'Cairo, Egypt',
  location_ar: 'القاهرة، مصر',
};

const FALLBACK_HOURS: WorkingHours = {
  en: 'Sat – Thu · 10:00 AM – 8:00 PM',
  ar: 'السبت – الخميس · ١٠:٠٠ صباحاً – ٨:٠٠ مساءً',
};

const FALLBACK_SOCIAL: SocialLinks = {
  instagram: '',
  facebook: '',
  whatsapp: '',
  email: 'mailto:info@drrehammohamed.com',
};

const FALLBACK_CHATBOT: ChatbotSettings = {
  enabled: true,
  greeting_en:
    "Hi, beautiful! I'm Reham — Dr. Reham's clinic concierge. Ask me anything about treatments, results, prices, or booking.",
  greeting_ar:
    'أهلاً يا جميلة! أنا ريهام، الكونسيرج الرقمي لعيادة د. ريهام. اسأليني عن أي علاج، نتائج، أسعار أو حجز.',
  persona_en:
    "You are a warm, elegant beauty concierge for Dr. Reham Mohamed's clinic.",
  persona_ar: 'أنتِ كونسيرج جمالي راقي لعيادة الدكتورة ريهام محمد.',
  suggested_en: [
    'What services do you offer?',
    'Can I see before & after results?',
    'What are your working hours?',
  ],
  suggested_ar: [
    'ما هي الخدمات المتوفرة؟',
    'هل يمكنني رؤية نتائج قبل وبعد؟',
    'ما هي ساعات العمل؟',
  ],
};

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getCases(): Promise<CaseRow[]> {
  return safe(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('before_after_cases')
      .select('*')
      .eq('published', true)
      .order('position', { ascending: true });
    return (data ?? []) as CaseRow[];
  }, []);
}

export async function getServices(): Promise<ServiceRow[]> {
  return safe(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('published', true)
      .order('position', { ascending: true });
    return (data ?? []) as ServiceRow[];
  }, []);
}

export async function getTestimonials(): Promise<TestimonialRow[]> {
  return safe(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('published', true)
      .order('position', { ascending: true });
    return (data ?? []) as TestimonialRow[];
  }, []);
}

export async function getSiteSettings() {
  const map: Record<string, Record<string, unknown>> = await safe(async () => {
    const supabase = createClient();
    const { data } = await supabase.from('site_settings').select('*');
    const out: Record<string, Record<string, unknown>> = {};
    for (const row of (data ?? []) as SiteSettingRow[]) {
      out[row.key] = row.value;
    }
    return out;
  }, {});

  return {
    branding: { ...FALLBACK_BRANDING, ...(map.branding as Partial<BrandingSettings> | undefined) },
    contact_info: {
      ...FALLBACK_CONTACT,
      ...(map.contact_info as Partial<ContactInfo> | undefined),
    },
    working_hours: {
      ...FALLBACK_HOURS,
      ...(map.working_hours as Partial<WorkingHours> | undefined),
    },
    social_links: {
      ...FALLBACK_SOCIAL,
      ...(map.social_links as Partial<SocialLinks> | undefined),
    },
    chatbot: {
      ...FALLBACK_CHATBOT,
      ...(map.chatbot as Partial<ChatbotSettings> | undefined),
    },
  };
}

export async function getFaq(): Promise<FaqRow[]> {
  return safe(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('faq')
      .select('*')
      .eq('published', true)
      .order('position', { ascending: true });
    return (data ?? []) as FaqRow[];
  }, []);
}
