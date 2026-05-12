'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export function CTASection() {
  const { isAuthenticated, hasHydrated } = useAuth();

  // Prevent hydration mismatch - don't render until auth is hydrated
  if (!hasHydrated) {
    return (
      <div className="flex gap-4 justify-center">
        <div className="h-12 w-40 bg-muted rounded-lg animate-pulse" />
        <div className="h-12 w-40 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Link
        href="/products"
        className="inline-flex items-center px-8 py-3 border-2 border-[color:hsl(var(--border))] text-foreground font-semibold rounded-lg hover:bg-card hover:text-accent transition-colors"
      >
        Browse Menu
      </Link>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/register"
        className="inline-flex items-center px-8 py-3 bg-card text-primary font-semibold rounded-lg hover:bg-muted transition-colors"
      >
        Create Account
      </Link>
      <Link
        href="/products"
        className="inline-flex items-center px-8 py-3 border-2 border-[color:hsl(var(--border))] text-foreground font-semibold rounded-lg hover:bg-card hover:text-accent transition-colors"
      >
        Browse Menu
      </Link>
    </div>
  );
}


