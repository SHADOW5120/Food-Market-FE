'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  ChevronLeft,
  Home,
  Inbox,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  ShoppingCart,
  Store,
  Settings,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import type { User } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

interface SidebarProps {
  user?: User | null;
  storeName?: string;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const menuSections: {
  title: string;
  items: { label: string; href: string; icon: LucideIcon }[];
}[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/seller/dashboard', icon: Home },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Analytics', href: '/seller/analytics', icon: TrendingUp },
    ],
  },
];

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-[5.5rem] left-4 z-50 md:hidden w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105"
        aria-label="Toggle seller sidebar"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-muted/70 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-16 md:top-20 bottom-0 z-40 flex flex-col bg-card border-r border-border shadow-2xl transition-all duration-300 ease-out overflow-hidden ${
          isMobileOpen ? 'w-72 translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-72'}`}
      >
        <div className="flex h-full flex-col pt-6">
          <div className="px-4 pb-4 border-b border-border md:px-5">
            <div className="flex items-center justify-between gap-3">
              <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Seller Dashboard</h2>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute right-0 top-1/2 z-50 hidden h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-lg transition hover:bg-muted hover:text-foreground md:flex"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* compact spacer */}
          <div className={isCollapsed ? 'h-4' : 'h-6'} />

          <nav className="flex-1 overflow-y-auto px-2 pb-6 md:px-4">
            {menuSections.map((section) => (
              <div key={section.title} className="mb-4">
                {!isCollapsed && (
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {section.title}
                  </p>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={isCollapsed ? item.label : undefined}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${
                        isActive(item.href)
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed ? <span>{item.label}</span> : null}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}


