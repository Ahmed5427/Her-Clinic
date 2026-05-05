'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface Props {
  email: string;
  children: React.ReactNode;
}

export default function AdminShell({ email, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0">
        <TopBar email={email} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
