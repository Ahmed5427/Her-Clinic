'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Award, Users, Smile, Sparkles, GraduationCap } from 'lucide-react';

export default function About() {
  const t = useTranslations('about');
  const locale = useLocale();

  const stats = [
    { icon: Award, label: t('experience'), value: '10+' },
    { icon: Users, label: t('clients'), value: '2000+' },
    { icon: Smile, label: t('treatments'), value: '50+' },
  ];

  return (
    <section id="about" className="relative py-28 overflow-hidden bg-cream-50">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-rose-100/60 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-gold-100/50 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="ornament-line mb-4">{t('eyebrow')}</span>
          <h2 className="font-display text-4xl md:text-6xl font-medium text-gradient mt-2">
            {t('title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Doctor portrait card */}
          <motion.div
            initial={{ opacity: 0, x: locale === 'ar' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
              {/* Decorative frame */}
              <motion.div
                animate={{ rotate: [0, 1.5, -1.5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-3 rounded-[2.5rem] bg-rose-gold opacity-40 blur-md"
              />
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden ring-1 ring-gold-200 shadow-luxury bg-gradient-to-br from-rose-200 via-cream-100 to-gold-100">
                <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                  <div>
                    <motion.div
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      className="font-display italic text-5xl md:text-6xl text-rose-gold leading-tight"
                    >
                      Dr. Reham
                    </motion.div>
                    <div className="font-display text-3xl md:text-4xl text-primary-700 mt-1">
                      Mohamed
                    </div>
                    <div className="gold-divider my-5 w-32 mx-auto" />
                    <div className="text-xs uppercase tracking-[0.4em] text-gold-700 inline-flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {t('credential')}
                    </div>
                  </div>
                </div>

                {/* Floating petals */}
                <motion.div
                  className="absolute top-6 right-6 w-16 h-16 rounded-full bg-white/40 backdrop-blur"
                  animate={{ y: [0, -14, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute bottom-6 left-6 w-12 h-12 rounded-full bg-gold-200/60 backdrop-blur"
                  animate={{ y: [0, 14, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
                />
                <motion.div
                  className="absolute top-1/2 left-4 text-gold-600/70"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              </div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass-card rounded-full px-6 py-3 flex items-center gap-3 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span className="font-display italic text-primary-700 tracking-wide">
                  {t('badge')}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: locale === 'ar' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-2xl md:text-3xl font-display italic text-rose-gold mb-4">
              {t('subtitle')}
            </p>
            <div className="gold-divider w-24 mb-6" />
            <p className="text-gray-700 leading-loose mb-10 text-lg font-light">
              {t('description')}
            </p>

            <div className="grid grid-cols-3 gap-3 md:gap-5 mb-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  whileHover={{ y: -6 }}
                  className="luxury-card text-center px-3 py-6"
                >
                  <motion.div
                    animate={{ rotate: [0, 6, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-gold-100 mb-3"
                  >
                    <stat.icon className="w-6 h-6 text-rose-600" />
                  </motion.div>
                  <div className="font-display text-3xl md:text-4xl font-medium text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href={`/${locale}#contact`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-primary"
            >
              {t('cta')}
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
