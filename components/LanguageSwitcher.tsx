'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = () => {
    const newLocale = currentLocale === 'en' ? 'ar' : 'en';
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <motion.button
      onClick={switchLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-full border-2 border-primary-400 text-primary-600 hover:bg-primary-50 transition-all duration-300"
    >
      <Languages className="w-4 h-4" />
      <span className="text-sm font-medium">{currentLocale === 'en' ? 'العربية' : 'English'}</span>
    </motion.button>
  );
}
