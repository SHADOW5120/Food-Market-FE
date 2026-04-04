'use client';

import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Hook to get current authenticated user
 */
export function useUser() {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

/**
 * Hook to handle login/logout with navigation
 */
export function useAuthNavigation() {
  const { login, logout } = useAuth();
  const router = useRouter();

  const loginAndNavigate = useCallback(
    (user: any, token: string, redirectTo = '/') => {
      login(user, token);
      router.push(redirectTo);
    },
    [login, router]
  );

  const logoutAndNavigate = useCallback(
    (redirectTo = '/login') => {
      logout();
      router.push(redirectTo);
    },
    [logout, router]
  );

  return { loginAndNavigate, logoutAndNavigate };
}

/**
 * Hook to require authentication on a page
 */
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading && !isAuthenticated) {
    router.push(redirectTo);
  }

  return { isAuthenticated, isLoading };
}
