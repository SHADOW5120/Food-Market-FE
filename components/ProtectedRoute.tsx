'use client';

import { useAuth } from '@/lib/auth-context';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  fallbackPath = '/'
}: ProtectedRouteProps) {
  const { isAuthenticated, role, isLoading, hasHydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasHydrated || isLoading) {
      return;
    }

    if (!isAuthenticated) {
      // Save intended route
      const authStore = useAuthStore.getState();
      if (authStore.intendedRoute !== pathname) {
        authStore.setIntendedRoute(pathname);
      }
      router.push('/login');
      return;
    }

    if (requiredRoles.length > 0 && role && !requiredRoles.includes(role)) {
      router.push(fallbackPath);
      return;
    }
  }, [hasHydrated, isLoading, isAuthenticated, role, requiredRoles, router, pathname, fallbackPath]);

  if (!hasHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles.length > 0 && role && !requiredRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">403 - Unauthorized</h1>
          <p className="text-muted-foreground">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


