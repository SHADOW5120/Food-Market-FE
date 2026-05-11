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
      className="text-orange-500 hover:text-orange-400 font-medium"
    >
      Logout
    </button>
  ) : (
    <Link href="/login" className="hover:text-white">
      Sign In
    </Link>
  );
}
