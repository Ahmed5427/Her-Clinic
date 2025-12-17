import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Her Clinic - Health and Wellness by Dr. Reham Mohamed',
  description: 'Premium beauty and wellness treatments by Dr. Reham Mohamed. Experience excellence in aesthetic medicine and holistic wellness care.',
  keywords: 'beauty clinic, wellness, aesthetic medicine, Dr. Reham Mohamed, skin care, laser treatments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
