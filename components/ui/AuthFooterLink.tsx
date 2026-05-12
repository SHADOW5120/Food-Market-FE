'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export function AuthFooterLink() {
  const { isAuthenticated, hasHydrated, logout } = useAuth();

  if (!hasHydrated) {
    return null;
  }

  return isAuthenticated ? (
    <button
      type="button"
      onClick={logout}
      className="text-accent hover:text-accent-foreground font-medium"
    >
      Logout
    </button>
  ) : (
    <Link href="/login" className="hover:text-accent">
      Sign In
    </Link>
  );
}
