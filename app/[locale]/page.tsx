import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import BeforeAfter from '@/components/BeforeAfter';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <BeforeAfter />
      <Testimonials />
      <Contact />
    </>
  );
}
