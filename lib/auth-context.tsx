'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from './auth-store';
import { User, UserRole } from './types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isLoading: boolean;
  hasHydrated: boolean;
  intendedRoute: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (updatedUser: Partial<User>) => void;
  setIntendedRoute: (route: string | null) => void;
  refetchUserProfile: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const store = useAuthStore();

  useEffect(() => {
    store.initializeAuth();
  }, []);

  const value: AuthContextType = {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    role: store.role,
    isLoading: store.isLoading,
    hasHydrated: store.hasHydrated,
    intendedRoute: store.intendedRoute,
    login: store.login,
    logout: store.logout,
    setUser: store.setUser,
    updateUser: store.updateUser,
    setIntendedRoute: store.setIntendedRoute,
    refetchUserProfile: store.refetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
