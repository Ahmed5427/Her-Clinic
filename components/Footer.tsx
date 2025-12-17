'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Heart, Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: 'mailto:info@herclinic.com', label: 'Email' },
  ];

  const quickLinks = [
    { label: navT('home'), href: '#home' },
    { label: navT('about'), href: '#about' },
    { label: navT('services'), href: '#services' },
    { label: navT('contact'), href: '#contact' },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary-900 via-rose-900 to-pink-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <Heart className="w-8 h-8" />
              <span className="font-display text-2xl font-bold">Her Clinic</span>
            </div>
            <p className="text-white/80 mb-4">{t('tagline')}</p>
            <p className="text-sm text-white/60">Dr. Reham Mohamed</p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-display text-xl font-bold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-white/80 hover:text-white transition-colors inline-block"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="font-display text-xl font-bold mb-4">{t('followUs')}</h3>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="border-t border-white/10 pt-8 text-center text-white/60 text-sm"
        >
          <p>
            © {new Date().getFullYear()} Her Clinic. {t('rights')}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
