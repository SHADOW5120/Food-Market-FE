'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { ActionMenu } from './ActionMenu';

export function Navbar() {
  const { role, hasHydrated } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 100], [80, 64]);
  const headerOpacity = useTransform(scrollY, [0, 50], [0.9, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 50], [12, 20]);

  useEffect(() => {
    const updateScrolled = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(prev => prev !== scrolled ? scrolled : prev); // Prevent unnecessary updates
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', updateScrolled, { passive: true });
    updateScrolled();

    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  return (
    <motion.header
      initial={false} // Prevent initial animation on mount
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: headerHeight,
        backdropFilter: `blur(${headerBlur}px)`,
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-card/95 border-b border-white/20 shadow-[0_8px_32px_rgba(15,23,42,0.15)]'
          : 'bg-card/90 border-b border-white/10 shadow-[0_24px_80px_rgba(15,23,42,0.12)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <ShoppingBag className="w-8 h-8 text-primary-foreground" />
            <motion.h1
              animate={{ fontSize: isScrolled ? '1.25rem' : '1.5rem' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="font-bold text-foreground"
            >
              Food Market
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="group">
              <motion.span
                whileHover={{ y: -1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                className="text-muted-foreground hover:text-accent font-medium transition-colors"
              >
                Home
              </motion.span>
            </Link>
            <Link href="/products" className="group">
              <motion.span
                whileHover={{ y: -1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                className="text-muted-foreground hover:text-accent font-medium transition-colors"
              >
                Menu
              </motion.span>
            </Link>

            {hasHydrated && role === 'seller' && (
              <Link href="/seller" className="text-muted-foreground hover:text-accent font-medium transition-colors">
                Seller Dashboard
              </Link>
            )}

            {hasHydrated && <ActionMenu />}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-accent transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden border-t border-white/10 py-4 overflow-hidden"
          >
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-muted-foreground hover:text-accent font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-muted-foreground hover:text-accent font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>

              {hasHydrated && role === 'seller' && (
                <Link
                  href="/seller"
                  className="text-muted-foreground hover:text-accent font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Seller Dashboard
                </Link>
              )}

              {hasHydrated && (
                <div className="border-t border-white/10 pt-4 mt-4">
                  <ActionMenu />
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}