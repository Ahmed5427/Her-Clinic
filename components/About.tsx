'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Award, Users, Smile } from 'lucide-react';

export default function About() {
  const t = useTranslations('about');

  const stats = [
    { icon: Award, label: t('experience'), value: '10+' },
    { icon: Users, label: t('clients'), value: '2000+' },
    { icon: Smile, label: t('treatments'), value: '50+' },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-primary-50 via-rose-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-300 to-rose-300 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="font-display text-6xl font-bold mb-4"
                  >
                    Dr. Reham
                  </motion.div>
                  <div className="font-display text-3xl">Mohamed</div>
                </div>
              </div>
              {/* Decorative Elements */}
              <motion.div
                className="absolute top-10 right-10 w-20 h-20 bg-white/20 rounded-full"
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute bottom-10 left-10 w-16 h-16 bg-white/20 rounded-full"
                animate={{
                  y: [0, 20, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              />
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
              {t('title')}
            </h2>
            <p className="text-xl text-primary-600 mb-6 font-display">
              {t('subtitle')}
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {t('description')}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white rounded-2xl p-6 shadow-lg"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.2,
                    }}
                  >
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-500" />
                  </motion.div>
                  <div className="font-display text-3xl font-bold text-gradient mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-block"
            >
              Book a Consultation
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
