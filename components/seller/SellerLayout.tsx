'use client';

import { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { Sidebar } from './Sidebar';

interface SellerLayoutProps {
  children: React.ReactNode;
  user?: User | null;
  storeName?: string;
}

export function SellerLayout({ children, user, storeName }: SellerLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('sellerSidebarCollapsed');
    setIsCollapsed(stored === 'true');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('sellerSidebarCollapsed', String(isCollapsed));
  }, [isCollapsed]);

  return (
    <div className="min-h-screen bg-muted">
      <Sidebar
        user={user}
        storeName={storeName}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <main
        className={`min-h-screen transition-all duration-300 ease-out pt-6 pb-10 px-4 md:px-6 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-72'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

