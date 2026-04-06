import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from './types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isLoading: boolean;
  intendedRoute: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (updatedUser: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setIntendedRoute: (route: string | null) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      role: null,
      isLoading: true,
      intendedRoute: null,

      login: (user: User, token: string) => {
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          role: user.role,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          role: null,
          isLoading: false,
          intendedRoute: null,
        });
        // Clear localStorage
        localStorage.removeItem('auth-storage');
      },

      setUser: (user: User | null) => {
        set({
          user,
          role: user?.role || null,
          isAuthenticated: !!user,
        });
      },

      updateUser: (updatedUser: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const newUser = { ...currentUser, ...updatedUser };
          set({ user: newUser, role: newUser.role });
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setIntendedRoute: (route: string | null) => set({ intendedRoute: route }),

      initializeAuth: async () => {
        const { accessToken } = get();
        if (accessToken) {
          try {
            // Call /me to get user info
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7225/api'}/auth/me`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.data) {
                const user = data.data;
                set({
                  user,
                  role: user.role,
                  isAuthenticated: true,
                  isLoading: false,
                });
              } else {
                // Invalid token, logout
                get().logout();
              }
            } else if (response.status === 401) {
              // Token expired, logout
              get().logout();
            } else {
              // Other error, logout
              get().logout();
            }
          } catch (error) {
            console.error('Failed to fetch user info:', error);
            get().logout();
          }
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);