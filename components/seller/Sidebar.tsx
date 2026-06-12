'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Bell,
  ChevronLeft,
  Home,
  Menu,
  Package,
  ShoppingBag,
  ShoppingCart,
  Store,
  TrendingUp,
  X,
} from 'lucide-react';
import type { User } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

// Import các motion từ file motion của bạn
import { buttonMotion, sectionStagger, gentleSlideUp } from '@/components/ui/motion';

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
];

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const { scrollY } = useScroll();
  // Sidebar Top thay đổi từ 80px xuống 64px khi scroll từ 0 đến 100px (khớp với Navbar)
  const sidebarTop = useTransform(scrollY, [0, 100], [80, 64]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      {/* Nút Mobile dùng buttonMotion */}
      <motion.button
        {...buttonMotion}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-[5.5rem] left-4 z-50 md:hidden w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center transition-colors"
        aria-label="Toggle seller sidebar"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-muted/70 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Đã gỡ overflow-hidden để nút Collapse không bị cắt */}
      <motion.aside
        style={{ top: sidebarTop }}
        className={`fixed left-0 bottom-0 z-40 flex flex-col bg-card border-r border-border shadow-2xl transition-[width] transition-transform duration-300 ease-out ${
          isMobileOpen ? 'w-72 translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-72'}`}
      >
        <div className="flex h-full flex-col pt-6 relative">
          
          {/* NÚT BẤM COLLAPSE */}
          {/* Đã chuyển ra đây để căn giữa dọc so với toàn bộ Sidebar */}
          <motion.button
            {...buttonMotion}
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-0 top-1/2 z-50 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-lg hover:bg-muted hover:text-foreground md:flex"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* Phần Header Logo */}
          <div className="px-4 pb-4 border-b border-border md:px-5">
            <div className="flex items-center justify-between gap-3 relative">
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
            </div>
          </div>

          {/* Wrapper cho animation theo hiệu ứng dây chuyền (stagger) */}
          <motion.div 
            variants={sectionStagger} 
            initial="hidden" 
            animate="visible"
            className="flex-1 overflow-y-auto custom-scrollbar flex flex-col"
          >
            <div className={isCollapsed ? 'grid gap-3 px-4 py-4 md:px-5' : 'grid gap-2 px-4 py-4 md:px-5'}>
              {[
                { label: 'Products', href: '/seller/products/new', icon: Package },
                { label: 'Stores', href: '/seller/stores', icon: Store },
              ].map((action) => (
                <motion.div key={action.href} variants={gentleSlideUp}>
                  <Link
                    href={action.href}
                    title={isCollapsed ? action.label : undefined}
                    className={`group flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-3 text-sm font-medium text-foreground transition hover:border-primary hover:bg-primary/5 ${
                      isCollapsed ? 'justify-center' : ''
                    }`}
                  >
                    <action.icon className="w-5 h-5 text-primary" />
                    {!isCollapsed && <span>{action.label}</span>}
                  </Link>
                </motion.div>
              ))}
            </div>

            <nav className="flex-1 px-2 pb-6 md:px-4">
              {menuSections.map((section) => (
                <div key={section.title} className="mb-4">
                  {!isCollapsed && (
                    <motion.p 
                      variants={gentleSlideUp}
                      className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      {section.title}
                    </motion.p>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <motion.div key={item.href} variants={gentleSlideUp}>
                        <Link
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
                          {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}