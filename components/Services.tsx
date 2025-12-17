'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Sparkles, Droplet, Zap, Leaf, Activity, Scissors } from 'lucide-react';

export default function Services() {
  const t = useTranslations('services');

  const services = [
    {
      icon: Droplet,
      title: t('skinCare.title'),
      description: t('skinCare.description'),
      color: 'from-pink-400 to-rose-400',
    },
    {
      icon: Sparkles,
      title: t('aesthetics.title'),
      description: t('aesthetics.description'),
      color: 'from-primary-400 to-pink-400',
    },
    {
      icon: Zap,
      title: t('laser.title'),
      description: t('laser.description'),
      color: 'from-rose-400 to-primary-500',
    },
    {
      icon: Leaf,
      title: t('wellness.title'),
      description: t('wellness.description'),
      color: 'from-primary-400 to-rose-400',
    },
    {
      icon: Activity,
      title: t('body.title'),
      description: t('body.description'),
      color: 'from-pink-400 to-primary-400',
    },
    {
      icon: Scissors,
      title: t('hair.title'),
      description: t('hair.description'),
      color: 'from-rose-400 to-pink-400',
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="relative bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Animated Background Gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />

                {/* Icon */}
                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${service.color} mb-6`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <service.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="font-display text-2xl font-bold text-gray-800 mb-4 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Decorative Element */}
                <motion.div
                  className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-primary-200 to-rose-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
