'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Quote, Star } from 'lucide-react';
import type { TestimonialRow } from '@/lib/supabase/types';

interface TestimonialsProps {
  testimonials?: TestimonialRow[];
}

interface Item {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

export default function Testimonials({ testimonials = [] }: TestimonialsProps) {
  const t = useTranslations('testimonials');
  const locale = useLocale();
  const [active, setActive] = useState(0);

  const items = useMemo<Item[]>(() => {
    if (testimonials.length > 0) {
      return testimonials.map((row) => ({
        quote: locale === 'ar' ? row.quote_ar : row.quote_en,
        name: row.name,
        role: (locale === 'ar' ? row.role_ar : row.role_en) ?? '',
        rating: row.rating,
      }));
    }
    return (['one', 'two', 'three'] as const).map((k) => ({
      quote: t(`items.${k}.quote`),
      name: t(`items.${k}.name`),
      role: t(`items.${k}.role`),
      rating: 5,
    }));
  }, [testimonials, locale, t]);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => setActive((p) => (p + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;
  const current = items[active] ?? items[0];

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-50 via-cream-50 to-gold-50" />
      <div className="absolute inset-0 -z-10 opacity-50">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gold-200/40 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="ornament-line mb-4">{t('eyebrow')}</span>
          <h2 className="font-display text-4xl md:text-6xl font-medium text-gradient mt-2">
            {t('title')}
          </h2>
        </motion.div>

        <div className="relative min-h-[280px] md:min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6 }}
              className="luxury-card p-8 md:p-12 text-center"
            >
              <Quote className="w-10 h-10 text-rose-300 mx-auto mb-4" />
              <p className="font-display italic text-xl md:text-2xl text-gray-800 leading-relaxed max-w-3xl mx-auto">
                “{current.quote}”
              </p>
              <div className="flex items-center justify-center gap-1 mt-6 text-gold-500">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="mt-4">
                <div className="font-display text-lg text-rose-gold">{current.name}</div>
                {current.role ? (
                  <div className="text-xs uppercase tracking-[0.3em] text-gold-700 mt-1">{current.role}</div>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? 'w-10 bg-rose-gold' : 'w-3 bg-gold-200'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
