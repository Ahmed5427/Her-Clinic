import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dr. Reham Mohamed · Beauty & Wellness Atelier',
  description:
    'A bespoke beauty atelier by Dr. Reham Mohamed. Advanced aesthetic medicine, laser, and wellness rituals — designed to elevate your natural elegance.',
  keywords:
    'Dr. Reham Mohamed, beauty clinic, aesthetic medicine, skin care, laser treatments, wellness, Cairo, تجميل, د. ريهام محمد',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
