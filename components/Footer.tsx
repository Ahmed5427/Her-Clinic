'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Instagram, Facebook, MessageCircle, Mail, Sparkles } from 'lucide-react';
import type { SocialLinks } from '@/lib/supabase/types';

interface FooterProps {
  locale: string;
  logoMarkUrl?: string;
  social?: SocialLinks;
}

export default function Footer({
  locale,
  logoMarkUrl = '/logo-mark.svg',
  social,
}: FooterProps) {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');

  const socialLinks = [
    { icon: Instagram, href: social?.instagram || '', label: 'Instagram' },
    { icon: Facebook, href: social?.facebook || '', label: 'Facebook' },
    { icon: MessageCircle, href: social?.whatsapp || '', label: 'WhatsApp' },
    { icon: Mail, href: social?.email || 'mailto:info@drrehammohamed.com', label: 'Email' },
  ].filter((s) => s.href);

  const quickLinks = [
    { label: navT('home'), href: `/${locale}#home` },
    { label: navT('about'), href: `/${locale}#about` },
    { label: navT('services'), href: `/${locale}#services` },
    { label: navT('gallery'), href: `/${locale}#gallery` },
    { label: navT('contact'), href: `/${locale}#contact` },
  ];

  return (
    <footer className="relative overflow-hidden text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-800 via-rose-800 to-gold-800" />
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-rose-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-gold-500/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 flex items-center justify-center bg-white/95 rounded-full p-1 shadow-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoMarkUrl}
                  alt="Dr. Reham Mohamed"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-display text-2xl">Dr. Reham Mohamed</div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-gold-200">
                  Beauty &amp; Wellness
                </div>
              </div>
            </div>
            <p className="text-white/80 italic font-display text-lg">{t('tagline')}</p>
            <div className="gold-divider w-24 my-5" />
            <p className="text-sm text-white/60 leading-relaxed font-light">
              {t('about')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h3 className="font-display text-xl mb-4">{t('quickLinks')}</h3>
            <div className="gold-divider w-12 mb-5" />
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 6 }}
                    className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-3 h-3 text-gold-300" />
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className="font-display text-xl mb-4">{t('followUs')}</h3>
            <div className="gold-divider w-12 mb-5" />
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/20 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            <p className="mt-6 text-sm text-white/70 font-light">{t('joinUs')}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="border-t border-white/15 pt-6 text-center text-white/60 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2"
        >
          <p>© {new Date().getFullYear()} Dr. Reham Mohamed. {t('rights')}</p>
          <p className="font-display italic text-gold-200">{t('signature')}</p>
        </motion.div>
      </div>
    </footer>
  );
}
