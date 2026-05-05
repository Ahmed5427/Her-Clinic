'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { CaseRow } from '@/lib/supabase/types';

interface Case {
  key: string;
  title?: string;
  description?: string;
  before: string;
  after: string;
}

interface SliderProps {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
}

/**
 * Interactive before/after slider. Drop image files at /public/cases/<name>.jpg
 * Falls back to a tasteful gradient placeholder if the image isn't present yet.
 */
function ComparisonSlider({ before, after, beforeLabel, afterLabel }: SliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [beforeOk, setBeforeOk] = useState(true);
  const [afterOk, setAfterOk] = useState(true);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition((x / rect.width) * 100);
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      updateFromClientX(clientX);
    };
    const stop = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchend', stop);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchend', stop);
    };
  }, [dragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-gold-200 shadow-luxury select-none cursor-ew-resize bg-gradient-to-br from-rose-100 via-cream-100 to-gold-100"
      onMouseDown={(e) => {
        setDragging(true);
        updateFromClientX(e.clientX);
      }}
      onTouchStart={(e) => {
        setDragging(true);
        updateFromClientX(e.touches[0].clientX);
      }}
    >
      {/* AFTER (full) */}
      {afterOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={after}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
          onError={() => setAfterOk(false)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-200 via-cream-200 to-gold-200">
          <div className="text-center">
            <Sparkles className="w-10 h-10 text-rose-500 mx-auto mb-2" />
            <div className="font-display italic text-3xl text-rose-gold">{afterLabel}</div>
          </div>
        </div>
      )}

      {/* BEFORE (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {beforeOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={before}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable={false}
            onError={() => setBeforeOk(false)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300">
            <div className="text-center">
              <div className="font-display italic text-3xl text-gray-700">{beforeLabel}</div>
            </div>
          </div>
        )}
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/55 backdrop-blur text-white text-xs uppercase tracking-[0.3em]">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-rose-gold text-white text-xs uppercase tracking-[0.3em] shadow-soft">
        {afterLabel}
      </div>

      {/* Drag handle line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]"
        style={{ left: `${position}%` }}
      />
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-luxury ring-2 ring-gold-400 flex items-center justify-center"
        style={{ left: `${position}%` }}
        animate={dragging ? { scale: 1.12 } : { scale: 1 }}
      >
        <ChevronLeft className="w-4 h-4 text-rose-600" />
        <ChevronRight className="w-4 h-4 text-rose-600" />
      </motion.div>
    </div>
  );
}

interface BeforeAfterProps {
  cases?: CaseRow[];
}

export default function BeforeAfter({ cases: dbCases = [] }: BeforeAfterProps) {
  const t = useTranslations('gallery');
  const locale = useLocale();

  const cases: Case[] = dbCases.length > 0
    ? dbCases.map((c) => ({
        key: c.slug,
        title: locale === 'ar' ? c.title_ar : c.title_en,
        description: (locale === 'ar' ? c.description_ar : c.description_en) ?? '',
        before: c.before_url ?? `/cases/${c.slug}-before.jpg`,
        after: c.after_url ?? `/cases/${c.slug}-after.jpg`,
      }))
    : [
        { key: 'skin', before: '/cases/skin-before.jpg', after: '/cases/skin-after.jpg' },
        { key: 'lips', before: '/cases/lips-before.jpg', after: '/cases/lips-after.jpg' },
        { key: 'laser', before: '/cases/laser-before.jpg', after: '/cases/laser-after.jpg' },
        { key: 'contour', before: '/cases/contour-before.jpg', after: '/cases/contour-after.jpg' },
      ];

  const [active, setActive] = useState(0);

  const next = () => setActive((p) => (p + 1) % cases.length);
  const prev = () => setActive((p) => (p - 1 + cases.length) % cases.length);

  const current = cases[active];

  return (
    <section
      id="gallery"
      className="relative py-28 overflow-hidden bg-gradient-to-b from-cream-50 via-white to-rose-50/40"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] rounded-full bg-rose-100/40 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] rounded-full bg-gold-100/40 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="ornament-line mb-4">{t('eyebrow')}</span>
          <h2 className="font-display text-4xl md:text-6xl font-medium text-gradient mt-2 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          {/* Slider */}
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <ComparisonSlider
              before={current.before}
              after={current.after}
              beforeLabel={t('before')}
              afterLabel={t('after')}
            />
            <p className="text-center text-xs uppercase tracking-[0.4em] text-gold-700 mt-4 font-display">
              ✦ {t('dragHint')} ✦
            </p>
          </motion.div>

          {/* Case picker */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: locale === 'ar' ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              key={`title-${active}`}
            >
              <h3 className="font-display italic text-3xl md:text-4xl text-rose-gold mb-2">
                {current.title ?? t(`cases.${current.key}.title`)}
              </h3>
              <div className="gold-divider w-20 mb-4" />
              <p className="text-gray-700 leading-relaxed font-light">
                {current.description ?? t(`cases.${current.key}.description`)}
              </p>
            </motion.div>

            <div className="space-y-2 pt-4">
              {cases.map((c, i) => (
                <motion.button
                  key={c.key}
                  onClick={() => setActive(i)}
                  whileHover={{ x: locale === 'ar' ? -6 : 6 }}
                  className={`w-full text-left rtl:text-right px-5 py-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                    active === i
                      ? 'border-gold-400 bg-white shadow-soft'
                      : 'border-cream-200 bg-white/40 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-display ${
                        active === i
                          ? 'bg-rose-gold text-white shadow-soft'
                          : 'bg-cream-100 text-gold-700'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-lg text-gray-900">
                      {c.title ?? t(`cases.${c.key}.title`)}
                    </span>
                  </div>
                  <Sparkles
                    className={`w-4 h-4 transition-opacity ${
                      active === i ? 'text-rose-500 opacity-100' : 'opacity-0'
                    }`}
                  />
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={prev}
                className="w-11 h-11 rounded-full border border-gold-300 bg-white/60 hover:bg-gold-50 transition-colors flex items-center justify-center"
                aria-label="Previous"
              >
                <ChevronLeft className={`w-5 h-5 text-rose-600 ${locale === 'ar' ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={next}
                className="w-11 h-11 rounded-full border border-gold-300 bg-white/60 hover:bg-gold-50 transition-colors flex items-center justify-center"
                aria-label="Next"
              >
                <ChevronRight className={`w-5 h-5 text-rose-600 ${locale === 'ar' ? 'rotate-180' : ''}`} />
              </button>
              <span className="ml-auto rtl:ml-0 rtl:mr-auto text-sm text-gold-700 font-display">
                {String(active + 1).padStart(2, '0')} / {String(cases.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-12 max-w-2xl mx-auto font-light italic">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
}
