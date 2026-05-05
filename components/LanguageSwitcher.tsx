'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useTransition } from 'react';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = () => {
    const newLocale = currentLocale === 'en' ? 'ar' : 'en';

    // Remove the current locale from pathname if it exists
    const pathnameWithoutLocale = pathname.replace(/^\/(en|ar)/, '');

    // Build the new path with the new locale
    const newPathname = `/${newLocale}${pathnameWithoutLocale || ''}`;

    startTransition(() => {
      router.push(newPathname);
      router.refresh();
    });
  };

  return (
    <motion.button
      onClick={switchLanguage}
      disabled={isPending}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold-300 text-primary-700 bg-white/40 backdrop-blur hover:bg-gold-50 hover:border-gold-500 transition-all duration-300 disabled:opacity-50"
    >
      <Languages className="w-4 h-4" />
      <span className="text-sm font-medium">{currentLocale === 'en' ? 'العربية' : 'English'}</span>
    </motion.button>
  );
}
