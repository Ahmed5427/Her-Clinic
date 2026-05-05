import { z } from 'zod';

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(4).max(40).optional().or(z.literal('')),
  service: z.string().trim().max(80).optional().or(z.literal('')),
  message: z.string().trim().max(4000).optional().or(z.literal('')),
  locale: z.enum(['en', 'ar']).default('en'),
});

export const trackSchema = z.object({
  path: z.string().min(1).max(256),
  locale: z.string().max(8).optional(),
  referrer: z.string().max(512).optional().or(z.literal('')),
  sessionId: z.string().max(64).optional(),
});

export const caseSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'lowercase letters, numbers and dashes only'),
  title_en: z.string().trim().min(2).max(120),
  title_ar: z.string().trim().min(2).max(120),
  description_en: z.string().trim().max(2000).optional().or(z.literal('')),
  description_ar: z.string().trim().max(2000).optional().or(z.literal('')),
  position: z.coerce.number().int().min(0).max(999).default(0),
  published: z.coerce.boolean().default(false),
});

export const serviceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'lowercase letters, numbers and dashes only'),
  icon: z.string().trim().max(40).optional().or(z.literal('')),
  title_en: z.string().trim().min(2).max(120),
  title_ar: z.string().trim().min(2).max(120),
  description_en: z.string().trim().max(2000).optional().or(z.literal('')),
  description_ar: z.string().trim().max(2000).optional().or(z.literal('')),
  position: z.coerce.number().int().min(0).max(999).default(0),
  published: z.coerce.boolean().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role_en: z.string().trim().max(120).optional().or(z.literal('')),
  role_ar: z.string().trim().max(120).optional().or(z.literal('')),
  quote_en: z.string().trim().min(4).max(2000),
  quote_ar: z.string().trim().min(4).max(2000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  position: z.coerce.number().int().min(0).max(999).default(0),
  published: z.coerce.boolean().default(true),
});

export const contactInfoSchema = z.object({
  phone: z.string().trim().max(40),
  email: z.string().trim().email().max(200),
  location_en: z.string().trim().max(200),
  location_ar: z.string().trim().max(200),
});

export const workingHoursSchema = z.object({
  en: z.string().trim().max(200),
  ar: z.string().trim().max(200),
});

export const socialLinksSchema = z.object({
  instagram: z.string().trim().max(300).optional().or(z.literal('')),
  facebook: z.string().trim().max(300).optional().or(z.literal('')),
  whatsapp: z.string().trim().max(300).optional().or(z.literal('')),
  email: z.string().trim().max(300).optional().or(z.literal('')),
});

export const faqSchema = z.object({
  question_en: z.string().trim().min(2).max(400),
  question_ar: z.string().trim().min(2).max(400),
  answer_en: z.string().trim().min(2).max(4000),
  answer_ar: z.string().trim().min(2).max(4000),
  position: z.coerce.number().int().min(0).max(999).default(0),
  published: z.coerce.boolean().default(true),
});

export const chatbotSettingsSchema = z.object({
  enabled: z.coerce.boolean().default(true),
  greeting_en: z.string().trim().min(2).max(600),
  greeting_ar: z.string().trim().min(2).max(600),
  persona_en: z.string().trim().min(2).max(2000),
  persona_ar: z.string().trim().min(2).max(2000),
  suggested_en: z.array(z.string().trim().min(2).max(200)).max(8).default([]),
  suggested_ar: z.array(z.string().trim().min(2).max(200)).max(8).default([]),
});

export const chatRequestSchema = z.object({
  locale: z.enum(['en', 'ar']).default('en'),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(40),
});
