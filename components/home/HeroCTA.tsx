'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

const buttonMotion = {
  whileHover: { y: -3, scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 260, damping: 24 },
};

export function HeroCTA() {
  const { isAuthenticated, hasHydrated } = useAuth();

  // Prevent hydration mismatch - don't render until auth is hydrated
  if (!hasHydrated) {
    return (
      <div className="h-12 w-48 bg-muted rounded-lg animate-pulse mx-auto" />
    );
  }

  if (isAuthenticated) {
    return (
      <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div {...buttonMotion} className="inline-flex rounded-lg">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary transition-colors"
          >
            Browse Menu
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col sm:flex-row gap-4 justify-center">
      <motion.div {...buttonMotion} className="inline-flex rounded-lg">
        <Link
          href="/register"
          className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary transition-colors"
        >
          Create Account
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
      <motion.div {...buttonMotion} className="inline-flex rounded-lg">
        <Link
          href="/products"
          className="inline-flex items-center px-8 py-3 bg-card text-primary font-semibold rounded-lg border-2 border-accent hover:bg-primary/10 transition-colors"
        >
          Browse Menu
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
    </motion.div>
  );
}


