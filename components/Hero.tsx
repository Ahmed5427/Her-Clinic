'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Sparkles, Heart, Star, Flower2 } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const [logoOk, setLogoOk] = useState(true);

  const float = (delay = 0, range = 22) => ({
    animate: {
      y: [0, -range, 0],
      rotate: [0, 6, 0],
      transition: { duration: 6, delay, repeat: Infinity, ease: 'easeInOut' },
    },
  });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16"
    >
      {/* Layered luxury background */}
      <div className="absolute inset-0 -z-10 bg-luxury-gradient" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full bg-gradient-to-br from-rose-200/60 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -right-24 w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-gold-200/50 to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[22rem] h-[22rem] rounded-full bg-gradient-to-br from-cream-100 to-rose-100 blur-3xl opacity-60" />
      </div>

      {/* Floating ornaments */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div {...float(0)} className="absolute top-28 left-8 md:left-20 text-rose-300/70">
          <Flower2 className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.2} />
        </motion.div>
        <motion.div {...float(1, 28)} className="absolute top-32 right-8 md:right-24 text-gold-400/70">
          <Sparkles className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.2} />
        </motion.div>
        <motion.div {...float(2, 18)} className="absolute bottom-32 left-1/4 text-rose-300/60">
          <Star className="w-9 h-9 md:w-12 md:h-12" strokeWidth={1.2} />
        </motion.div>
        <motion.div {...float(1.5, 24)} className="absolute bottom-24 right-1/3 text-primary-300/60">
          <Heart className="w-10 h-10 md:w-14 md:h-14" strokeWidth={1.2} />
        </motion.div>

        {/* Sparkle dots */}
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="absolute block w-1.5 h-1.5 rounded-full bg-gold-400/70 animate-sparkle"
            style={{
              top: `${(i * 53) % 90 + 5}%`,
              left: `${(i * 37) % 90 + 5}%`,
              animationDelay: `${(i * 0.35) % 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo medallion */}
        <motion.div
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.9, type: 'spring', stiffness: 120 }}
          className="inline-block mb-8 relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, #f5e0c2, #dcb766, #c79666, #f5d4cc, #f5e0c2)',
              filter: 'blur(6px)',
              transform: 'scale(1.1)',
            }}
          />
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-luxury ring-2 ring-gold-200 flex items-center justify-center overflow-hidden">
            {logoOk ? (
              // Drop your real logo at /public/logo.png
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/logo.png"
                alt="Dr. Reham Mohamed"
                className="w-full h-full object-cover"
                onError={() => setLogoOk(false)}
              />
            ) : (
              <div className="text-center">
                <div className="font-display italic text-4xl md:text-5xl text-rose-gold leading-none">
                  R<span className="text-gold-500">M</span>
                </div>
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gold-700 mt-1">
                  Clinic
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="ornament-line mb-6"
        >
          {t('subtitle')}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className={`font-display ${
            locale === 'ar' ? 'text-5xl md:text-7xl' : 'text-6xl md:text-8xl'
          } font-medium mb-6 leading-tight`}
        >
          <span className="text-gradient">{t('title')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed font-light"
        >
          {t('description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href={`/${locale}#contact`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="btn-primary"
          >
            <Sparkles className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('cta')}
          </motion.a>
          <motion.a
            href={`/${locale}#about`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="btn-secondary"
          >
            {t('learn')}
          </motion.a>
        </motion.div>

        {/* Bottom shimmer divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 1 }}
          className="mt-16 mx-auto max-w-md"
        >
          <div className="gold-divider" />
          <div className="mt-3 shimmer-text font-display tracking-[0.4em] text-xs uppercase">
            ✦ Bespoke Beauty &amp; Wellness ✦
          </div>
        </motion.div>
      </div>

      {/* Bottom curved fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-cream-50 pointer-events-none" />
    </section>
  );
}
