import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import BeforeAfter from '@/components/BeforeAfter';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import {
  getCases,
  getServices,
  getTestimonials,
  getSiteSettings,
} from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  const [cases, services, testimonials, settings] = await Promise.all([
    getCases(),
    getServices(),
    getTestimonials(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero logoUrl={settings.branding.logo_url} />
      <About />
      <Services services={services} />
      <BeforeAfter cases={cases} />
      <Testimonials testimonials={testimonials} />
      <Contact
        locale={locale}
        contact={settings.contact_info}
        hours={settings.working_hours}
      />
    </>
  );
}
