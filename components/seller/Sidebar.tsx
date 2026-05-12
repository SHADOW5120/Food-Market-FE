'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuIcon, X } from '../auth/Icons';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/seller',
    icon: 'ðŸ“Š',
  },
  {
    label: 'Products',
    href: '/seller/products',
    icon: 'ðŸ“¦',
  },
  {
    label: 'Orders',
    href: '/seller/orders',
    icon: 'ðŸ›’',
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/seller') {
      return pathname === '/seller';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 md:hidden w-12 h-12 bg-success hover:bg-success text-success-foreground rounded-full flex items-center justify-center shadow-lg transition-all"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MenuIcon className="w-6 h-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-muted/60 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-muted text-foreground z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-muted">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success flex items-center justify-center text-lg font-bold">
              ðŸ½ï¸
            </div>
            <div>
              <h1 className="font-bold text-lg">Food Market</h1>
              <p className="text-xs text-muted-foreground">Seller Dashboard</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.href)
                  ? 'bg-success text-success-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-muted">
          <button className="w-full px-4 py-2 bg-destructive hover:bg-destructive text-destructive-foreground rounded-lg transition-colors font-medium">
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}


