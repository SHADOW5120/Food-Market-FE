import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from './types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isLoading: boolean;
  hasHydrated: boolean;
  intendedRoute: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (updatedUser: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setIntendedRoute: (route: string | null) => void;
  initializeAuth: () => Promise<void>;
  refetchUserProfile: () => Promise<User | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get, api) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      role: null,
      isLoading: true,
      hasHydrated: false,
      intendedRoute: null,

      login: (user: User, token: string) => {
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          role: user.role,
          isLoading: false,
          hasHydrated: true,
        });
        // Set cookie for middleware
        document.cookie = `accessToken=${token}; path=/; max-age=86400`;
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          role: null,
          isLoading: false,
          hasHydrated: true,
          intendedRoute: null,
        });
        // Clear localStorage
        localStorage.removeItem('auth-storage');
        // Clear cookie
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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

      setIntendedRoute: (route: string | null) => {
        if (get().intendedRoute !== route) {
          set({ intendedRoute: route });
        }
      },

      initializeAuth: async () => {
        if (!get().hasHydrated) {
          await new Promise<void>((resolve) => {
            const unsubscribe = api.subscribe((state) => {
              if (state.hasHydrated) {
                unsubscribe();
                clearTimeout(timer);
                resolve();
              }
            });

            const timer = setTimeout(() => {
              unsubscribe();
              set({ hasHydrated: true, isLoading: false });
              resolve();
            }, 100);
          });
        }

        const accessToken = get().accessToken;
        const validToken = accessToken && accessToken !== 'null' ? accessToken : null;

        if (!validToken) {
          set({
            accessToken: null,
            user: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7225/api'}/user/me`, {
            headers: {
              Authorization: `Bearer ${validToken}`,
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
              get().logout();
            }
          } else if (response.status === 401) {
            get().logout();
          } else {
            get().logout();
          }
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          get().logout();
        }
      },

      refetchUserProfile: async () => {
        const accessToken = get().accessToken;
        const validToken = accessToken && accessToken !== 'null' ? accessToken : null;

        if (!validToken) {
          return null;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7225/api'}/user/me`, {
            headers: {
              Authorization: `Bearer ${validToken}`,
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
              });
              return user;
            }
          } else if (response.status === 401) {
            get().logout();
          }
        } catch (error) {
          console.error('Failed to refetch user profile:', error);
        }
        return null;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        intendedRoute: state.intendedRoute,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to hydrate auth store', error);
        }

        if (state) {
          // The persisted access token may still be invalid.
          // Do not trust persisted auth state until it is revalidated.
          state.hasHydrated = true;
          state.isLoading = false;
          state.isAuthenticated = false;
          state.user = null;
          state.role = null;
        }
      },
    }
  )
);