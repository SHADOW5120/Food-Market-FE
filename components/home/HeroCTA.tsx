'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { btnMotion, buttonMotion, subtleFade } from '@/components/ui/motion';

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
      <motion.div variants={subtleFade} initial="hidden" animate="visible">
        <motion.div {...btnMotion} className="inline-flex rounded-lg">
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
    <motion.div variants={subtleFade} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-4 justify-center">
      <motion.div {...btnMotion} className="inline-flex rounded-lg">
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


