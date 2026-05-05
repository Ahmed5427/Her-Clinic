'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { submitContactForm } from '@/app/admin/_actions/submissions';
import type { ContactInfo, WorkingHours } from '@/lib/supabase/types';

interface ContactProps {
  locale: string;
  contact?: ContactInfo;
  hours?: WorkingHours;
}

export default function Contact({ locale, contact, hours }: ContactProps) {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.set(k, v));
    fd.set('locale', locale);

    startTransition(async () => {
      const result = await submitContactForm(fd);
      if (!result.ok) {
        toast.error(result.error ?? 'Submission failed.');
        return;
      }
      toast.success(t('thankYou'));
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    });
  }

  const phone = contact?.phone ?? '+20 123 456 7890';
  const email = contact?.email ?? 'info@drrehammohamed.com';
  const location =
    locale === 'ar'
      ? contact?.location_ar ?? 'القاهرة، مصر'
      : contact?.location_en ?? 'Cairo, Egypt';
  const hoursValue =
    locale === 'ar'
      ? hours?.ar ?? t('hoursValue')
      : hours?.en ?? t('hoursValue');

  const contactInfo = [
    { icon: MapPin, label: t('location'), value: location },
    { icon: Phone, label: t('phone'), value: phone },
    { icon: Mail, label: t('email'), value: email },
    { icon: Clock, label: t('hours'), value: hoursValue },
  ];

  const inputCls =
    'w-full px-5 py-3.5 rounded-2xl bg-white/70 backdrop-blur border border-cream-200 focus:border-gold-400 focus:bg-white focus:ring-2 focus:ring-gold-200/60 outline-none transition-all duration-300 font-light';

  return (
    <section id="contact" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream-50 via-white to-cream-50" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-rose-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gold-100/40 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="ornament-line mb-4">{t('eyebrow')}</span>
          <h2 className="font-display text-4xl md:text-6xl font-medium text-gradient mt-2 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="luxury-card p-8 md:p-10 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm tracking-[0.2em] uppercase text-gold-700 mb-2">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputCls}
                    disabled={pending}
                  />
                </div>
                <div>
                  <label className="block text-sm tracking-[0.2em] uppercase text-gold-700 mb-2">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={inputCls}
                    disabled={pending}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm tracking-[0.2em] uppercase text-gold-700 mb-2">
                  {t('email')}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputCls}
                  disabled={pending}
                />
              </div>

              <div>
                <label className="block text-sm tracking-[0.2em] uppercase text-gold-700 mb-2">
                  {t('service')}
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className={inputCls}
                  disabled={pending}
                >
                  <option value="">{t('selectService')}</option>
                  <option value="skincare">{t('options.skincare')}</option>
                  <option value="aesthetics">{t('options.aesthetics')}</option>
                  <option value="laser">{t('options.laser')}</option>
                  <option value="wellness">{t('options.wellness')}</option>
                  <option value="body">{t('options.body')}</option>
                  <option value="hair">{t('options.hair')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm tracking-[0.2em] uppercase text-gold-700 mb-2">
                  {t('message')}
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${inputCls} resize-none`}
                  disabled={pending}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: pending ? 1 : 1.02 }}
                whileTap={{ scale: pending ? 1 : 0.98 }}
                className="btn-primary w-full"
                disabled={pending}
              >
                <Send className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {pending ? '…' : t('send')}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="luxury-card p-8">
              <h3 className="font-display text-2xl text-rose-gold mb-2">{t('info')}</h3>
              <div className="gold-divider w-16 mb-6" />
              <div className="space-y-5">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    whileHover={{ x: 6 }}
                    className="flex items-start gap-4"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.7 }}
                      className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-rose-100 to-gold-100 ring-1 ring-gold-200 flex items-center justify-center"
                    >
                      <info.icon className="w-5 h-5 text-rose-600" />
                    </motion.div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.3em] text-gold-700 mb-1">
                        {info.label}
                      </div>
                      <div className="text-gray-800">{info.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative h-56 rounded-3xl overflow-hidden ring-1 ring-gold-200 shadow-luxury bg-gradient-to-br from-rose-200 via-cream-100 to-gold-200"
            >
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div>
                  <MapPin className="w-10 h-10 text-rose-600 mx-auto mb-2" />
                  <div className="font-display italic text-rose-gold text-2xl">
                    {t('mapLabel')}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
