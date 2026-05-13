'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'theme-preference';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * ThemeProvider: Handles theme switching with proper SSR/hydration support
 * 
 * HYDRATION FIX:
 * - Server always renders with 'light' theme (no localStorage access)
 * - Client hydrates with 'light' first (matches server)
 * - useEffect loads actual theme from localStorage/system preference
 * - DOM only modified after React hydration completes
 * - isHydrated flag prevents theme-dependent UI from rendering before hydration
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always initialize with 'light' on both server and client
  // This ensures server and client render identically
  const [theme, setTheme] = useState<Theme>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  // After hydration completes, load the actual theme preference
  useEffect(() => {
    // At this point, hydration is complete and we're safe to access localStorage
    const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
    let initialTheme: Theme = 'light';

    if (storedTheme === 'light' || storedTheme === 'dark') {
      initialTheme = storedTheme;
    } else {
      // Check system preference only if no stored preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? 'dark' : 'light';
    }

    setTheme(initialTheme);
    setIsHydrated(true);
  }, []);

  // Apply theme to DOM only after hydration
  useEffect(() => {
    if (isHydrated) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme, isHydrated]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
      isHydrated,
    }),
    [theme, isHydrated],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
