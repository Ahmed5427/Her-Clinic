'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will contact you soon.');
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t('location'),
      value: 'Cairo, Egypt',
      color: 'from-primary-400 to-rose-400',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+20 123 456 7890',
      color: 'from-rose-400 to-pink-400',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'info@herclinic.com',
      color: 'from-pink-400 to-primary-400',
    },
    {
      icon: Clock,
      label: t('hours'),
      value: t('hoursValue'),
      color: 'from-primary-400 to-rose-400',
    },
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('name')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('email')}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('service')}
                </label>
                <select
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-400 focus:outline-none transition-colors"
                >
                  <option value="">Select a service</option>
                  <option value="skincare">Skin Care</option>
                  <option value="aesthetics">Aesthetic Treatments</option>
                  <option value="laser">Laser Treatments</option>
                  <option value="wellness">Wellness Programs</option>
                  <option value="body">Body Treatments</option>
                  <option value="hair">Hair Treatments</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('message')}
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-400 focus:outline-none transition-colors resize-none"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary w-full"
              >
                {t('send')}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8">
              <h3 className="font-display text-2xl font-bold text-gradient mb-6">
                {t('info')}
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="flex items-start space-x-4 rtl:space-x-reverse"
                  >
                    <motion.div
                      className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <info.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">{info.label}</div>
                      <div className="text-gray-800 font-medium">{info.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="h-64 bg-gradient-to-br from-primary-200 to-rose-200 rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="w-full h-full flex items-center justify-center text-white/40 font-display text-3xl">
                Map Location
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
