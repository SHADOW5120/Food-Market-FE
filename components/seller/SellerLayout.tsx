'use client';

import { User } from '@/lib/types';
import { Sidebar } from './Sidebar';
import { Topbar } from '../ui/SellerTopbar';

interface SellerLayoutProps {
  children: React.ReactNode;
  user?: User | null;
  storeName?: string;
}

export function SellerLayout({ children, user, storeName }: SellerLayoutProps) {
  return (
    <div className="min-h-screen bg-muted">
      <Sidebar />
      {/* <Topbar user={user ?? undefined} storeName={storeName} /> */}
      
      {/* Main Content */}
      <main className="pt-16 md:ml-64 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}

