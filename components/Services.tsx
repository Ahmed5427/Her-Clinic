'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Sparkles, Droplet, Zap, Leaf, Activity, Scissors } from 'lucide-react';

export default function Services() {
  const t = useTranslations('services');

  const services = [
    { icon: Droplet, title: t('skinCare.title'), description: t('skinCare.description'), color: 'from-rose-300 to-rose-500' },
    { icon: Sparkles, title: t('aesthetics.title'), description: t('aesthetics.description'), color: 'from-primary-300 to-primary-500' },
    { icon: Zap, title: t('laser.title'), description: t('laser.description'), color: 'from-gold-300 to-gold-500' },
    { icon: Leaf, title: t('wellness.title'), description: t('wellness.description'), color: 'from-rose-200 to-gold-400' },
    { icon: Activity, title: t('body.title'), description: t('body.description'), color: 'from-primary-300 to-rose-400' },
    { icon: Scissors, title: t('hair.title'), description: t('hair.description'), color: 'from-gold-200 to-primary-400' },
  ];

  return (
    <section id="services" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream-50 via-white to-cream-50" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-rose-100/50 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-gold-100/50 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="ornament-line mb-4">{t('eyebrow')}</span>
          <h2 className="font-display text-4xl md:text-6xl font-medium text-gradient mt-2 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: (index % 3) * 0.1 }}
              className="group"
            >
              <div className="luxury-card p-8 h-full overflow-hidden">
                {/* Subtle gradient halo */}
                <motion.div
                  className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${service.color} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity duration-500`}
                />

                {/* Icon medallion */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.06 }}
                  transition={{ duration: 0.8 }}
                  className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} shadow-soft mb-6`}
                >
                  <service.icon className="w-8 h-8 text-white" strokeWidth={1.6} />
                  <span className="absolute inset-0 rounded-2xl ring-1 ring-white/40" />
                </motion.div>

                <h3 className="font-display text-2xl md:text-3xl font-medium text-gray-900 group-hover:text-rose-700 transition-colors mb-3">
                  {service.title}
                </h3>
                <div className="gold-divider w-16 mb-4" />
                <p className="text-gray-600 leading-relaxed font-light">
                  {service.description}
                </p>

                {/* Floating decorative dot */}
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3 + index * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-6 right-6 inline-block w-2 h-2 rounded-full bg-gold-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
