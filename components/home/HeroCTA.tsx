'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export function HeroCTA() {
  const { isAuthenticated, hasHydrated } = useAuth();

  // Prevent hydration mismatch - don't render until auth is hydrated
  if (!hasHydrated) {
    return (
      <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto" />
    );
  }

  if (isAuthenticated) {
    return (
      <Link
        href="/products"
        className="inline-flex items-center px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
      >
        Browse Menu
        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/register"
        className="inline-flex items-center px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
      >
        Create Account
        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
      <Link
        href="/products"
        className="inline-flex items-center px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg border-2 border-orange-600 hover:bg-orange-50 transition-colors"
      >
        Browse Menu
        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
