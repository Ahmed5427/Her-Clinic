'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('nav');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('home'), href: `/${locale}#home` },
    { label: t('about'), href: `/${locale}#about` },
    { label: t('services'), href: `/${locale}#services` },
    { label: t('gallery'), href: `/${locale}#gallery` },
    { label: t('contact'), href: `/${locale}#contact` },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-effect py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} aria-label="Her Clinic">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-3"
            >
              <div className="relative w-11 h-11 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-mark.svg"
                  alt="Dr. Reham Mohamed"
                  className="w-full h-full object-contain drop-shadow-[0_2px_6px_rgba(199,150,102,0.35)]"
                />
              </div>
              <div className="leading-tight">
                <div className="font-display text-xl md:text-2xl text-rose-gold tracking-wide">
                  Dr. Reham Mohamed
                </div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-gold-600">
                  Beauty &amp; Wellness
                </div>
              </div>
            </motion.div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="relative text-gray-700 hover:text-rose-600 font-medium transition-colors group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-rose-500 to-gold-500 transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
            <LanguageSwitcher currentLocale={locale} />
            <motion.a
              href={`/${locale}#contact`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-primary"
            >
              {t('book')}
            </motion.a>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-rose-600 transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:hidden mt-4 space-y-3 pb-4"
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-700 hover:text-rose-600 font-medium py-2"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href={`/${locale}#contact`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.06 }}
                onClick={() => setIsOpen(false)}
                className="btn-primary block text-center"
              >
                {t('book')}
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
