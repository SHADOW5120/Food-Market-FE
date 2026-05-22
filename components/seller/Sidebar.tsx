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
import { useAuth } from '@/lib/auth-context';
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
      { label: 'Orders', href: '/seller/orders', icon: ShoppingCart },
      { label: 'Products', href: '/seller/products', icon: Package },
      { label: 'Stores', href: '/seller/stores', icon: Store },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Analytics', href: '/seller/analytics', icon: TrendingUp },
      { label: 'Notifications', href: '/seller/notifications', icon: Bell },
    ],
  },
  {
    title: 'Configure',
    items: [
      { label: 'Store Settings', href: '/seller/settings', icon: Settings },
      { label: 'Account', href: '/profile', icon: Users },
    ],
  },
];

export function Sidebar({ user, storeName, isCollapsed, setIsCollapsed }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

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
        className={`fixed inset-y-0 left-0 top-0 z-40 flex flex-col bg-card border-r border-border shadow-2xl transition-all duration-300 ease-out overflow-hidden ${
          isMobileOpen ? 'w-72 translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-72'}`}
      >
        <div className="flex h-full flex-col pt-20 md:pt-6">
          <div className="px-4 pb-4 border-b border-border md:px-5">
            <div className="flex items-center justify-between gap-3">
              <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Food Market</h2>
                    <p className="text-xs text-muted-foreground">Seller dashboard</p>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground md:flex"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <div className="space-y-3 px-4 py-4 md:px-5">
            <div
              className="group relative rounded-3xl border border-border bg-muted p-4 transition hover:border-primary"
              title={isCollapsed ? `${storeName ?? 'My Store'} - Active` : undefined}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-success to-success/70 text-success-foreground text-lg font-semibold">
                  {user?.username?.charAt(0)?.toUpperCase() ?? 'S'}
                </div>
                {!isCollapsed ? (
                  <div>
                    <p className="font-semibold text-foreground">{user?.username ?? 'Seller'}</p>
                    <p className="text-sm text-muted-foreground">{storeName ?? 'My Store'}</p>
                    <span className="mt-2 inline-flex rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                      Active
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className={isCollapsed ? 'grid gap-3' : 'grid gap-2'}>
              {[
                { label: 'Add product', href: '/seller/products/new', icon: Package },
                { label: 'Stores', href: '/seller/stores', icon: Store },
                { label: 'Settings', href: '/seller/settings', icon: Settings },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  title={isCollapsed ? action.label : undefined}
                  className={`group flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-3 text-sm font-medium text-foreground transition hover:border-primary hover:bg-primary/5 ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                >
                  <action.icon className="w-5 h-5 text-primary" />
                  {!isCollapsed ? <span>{action.label}</span> : null}
                </Link>
              ))}
            </div>
          </div>

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

          <div className="px-4 pb-6 md:px-5">
            <div className="rounded-3xl border border-border bg-muted p-4 text-sm text-muted-foreground">
              {!isCollapsed ? (
                <>
                  <p className="font-semibold text-foreground">Seller support</p>
                  <p className="mt-1">Review notifications, store status, and account actions.</p>
                </>
              ) : (
                <div className="flex items-center justify-center">
                  <Inbox className="w-5 h-5" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className={`mt-4 flex w-full items-center gap-3 rounded-2xl border border-border px-3 py-3 text-sm font-semibold text-destructive transition hover:bg-destructive/10 ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed ? 'Logout' : null}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}


