'use client';

import { Bell } from 'lucide-react';
import { User } from '@/lib/types';
import Link from 'next/link';

interface TopbarProps {
  user?: User;
  storeName?: string;
}

export function Topbar({ user, storeName = 'My Store' }: TopbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 h-16 bg-card border-b border-[color:hsl(var(--border))] z-30">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left - Store Info */}
        <div className="hidden md:flex items-center gap-3">
          <h1 className="text-lg font-bold text-foreground">{storeName}</h1>
          <span className="px-3 py-1 bg-success text-success text-xs font-semibold rounded-full">
            Active
          </span>
        </div>

        {/* Right - User Info */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <button className="relative w-10 h-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </button>

          {/* User Profile */}
          <Link href="/profile">
            <button className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center text-success-foreground text-sm font-bold">
                {user?.username?.[0]?.toUpperCase() || 'S'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">{user?.username}</p>
                <p className="text-xs text-muted-foreground">Seller</p>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}



