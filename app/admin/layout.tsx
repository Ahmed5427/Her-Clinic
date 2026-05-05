import './admin.css';
import { Toaster } from 'sonner';
import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/admin/TopBar';
import { getProfile } from '@/lib/auth';

export const metadata = {
  title: 'Her Clinic — Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="admin">
        <Toaster position="top-right" richColors closeButton />
        {!profile || profile.role !== 'admin' ? (
          <div className="min-h-screen flex items-center justify-center p-6">{children}</div>
        ) : (
          <div className="flex">
            <Sidebar />
            <div className="flex-1 min-w-0">
              <TopBar email={profile.email} />
              <main className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
