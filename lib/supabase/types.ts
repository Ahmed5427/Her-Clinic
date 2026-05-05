export type SubmissionStatus = 'new' | 'contacted' | 'archived';
export type UserRole = 'admin' | 'viewer';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  locale: string;
  status: SubmissionStatus;
  notes: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface PageVisit {
  id: string;
  path: string;
  locale: string | null;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
  device: string | null;
  session_hash: string;
  created_at: string;
}

export interface CaseRow {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  before_url: string | null;
  after_url: string | null;
  position: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceRow {
  id: string;
  slug: string;
  icon: string | null;
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  position: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestimonialRow {
  id: string;
  name: string;
  role_en: string | null;
  role_ar: string | null;
  quote_en: string;
  quote_ar: string;
  rating: number;
  position: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettingRow {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface FaqRow {
  id: string;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  position: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatbotSettings {
  enabled: boolean;
  greeting_en: string;
  greeting_ar: string;
  persona_en: string;
  persona_ar: string;
  suggested_en: string[];
  suggested_ar: string[];
}

export interface BrandingSettings {
  logo_url: string;
  logo_mark_url: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  location_en: string;
  location_ar: string;
}

export interface WorkingHours {
  en: string;
  ar: string;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  whatsapp: string;
  email: string;
}

export interface SiteSettings {
  branding: BrandingSettings;
  contact_info: ContactInfo;
  working_hours: WorkingHours;
  social_links: SocialLinks;
  chatbot: ChatbotSettings;
}
