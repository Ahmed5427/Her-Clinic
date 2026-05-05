import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';
import { locales } from '@/i18n';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { getSiteSettings } from '@/lib/site-data';
import '../globals.css';

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const settings = await getSiteSettings();
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'rtl' : ''}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=Cairo:wght@300;400;500;600;700;800&family=Amiri:ital,wght@0,400;0,700;1,400&family=Tajawal:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${isRTL ? 'font-arabic' : 'font-sans'} antialiased overflow-x-hidden`}
        style={{ fontFamily: isRTL ? 'Cairo, Tajawal, system-ui, sans-serif' : 'Inter, system-ui, sans-serif' }}
      >
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll />
          <AnalyticsTracker locale={locale} />
          <Navbar locale={locale} logoMarkUrl={settings.branding.logo_mark_url} />
          <main>{children}</main>
          <Footer
            locale={locale}
            logoMarkUrl={settings.branding.logo_mark_url}
            social={settings.social_links}
          />
        </NextIntlClientProvider>
        <Toaster position="bottom-right" richColors closeButton />
        <Analytics />
      </body>
    </html>
  );
}
