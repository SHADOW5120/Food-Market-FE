# Hydration Best Practices Guide

Quick reference for avoiding hydration mismatches in Food-Market-FE

## ❌ DON'T DO THIS

### 1. Access `window` or `localStorage` in useState initializer
```tsx
// ❌ WRONG - Causes hydration mismatch
const [value, setValue] = useState(() => localStorage.getItem('key'));
```

### 2. Use `typeof window !== 'undefined'` in render logic
```tsx
// ❌ WRONG - Causes conditional rendering mismatch
export function Component() {
  if (typeof window === 'undefined') return <ServerVersion />;
  return <ClientVersion />;
}
```

### 3. Modify DOM in useEffect without hydration guard
```tsx
// ❌ WRONG - May modify DOM before React hydration
useEffect(() => {
  document.documentElement.classList.add('dark');
}, []);
```

### 4. Use `Date.now()` or `Math.random()` for IDs or rendering
```tsx
// ❌ WRONG - Different on server vs client
const id = Date.now(); // Server: 1000, Client: 2000
```

---

## ✅ DO THIS INSTEAD

### 1. Initialize with safe default value, load in useEffect
```tsx
// ✅ CORRECT
const [theme, setTheme] = useState('light'); // Default on server and client

useEffect(() => {
  // Load actual value after hydration
  const stored = localStorage.getItem('theme') ?? 'light';
  setTheme(stored);
}, []);
```

### 2. Use hydration guard component
```tsx
// ✅ CORRECT
import { ClientHydrationGuard } from '@/components/ClientHydrationGuard';

export function Component() {
  return (
    <ClientHydrationGuard fallback={<Skeleton />}>
      <ClientOnlyContent />
    </ClientHydrationGuard>
  );
}
```

### 3. Only modify DOM after hydration confirmed
```tsx
// ✅ CORRECT
const [isHydrated, setIsHydrated] = useState(false);

useEffect(() => {
  setIsHydrated(true);
}, []);

useEffect(() => {
  if (!isHydrated) return;
  document.documentElement.classList.toggle('dark', isDark);
}, [isDark, isHydrated]);
```

### 4. Use stable IDs from data or context
```tsx
// ✅ CORRECT
const id = item.id; // Stable across server and client

// Or for temporary IDs:
import { useId } from 'react';
const id = useId(); // Stable unique ID from React
```

---

## Common Patterns

### Pattern 1: Theme/Preference Loading
```tsx
'use client';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light'); // Safe default
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Load preference after hydration
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Apply to DOM only after hydration
    if (isHydrated) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, isHydrated]);

  return <>{children}</>;
}
```

### Pattern 2: Auth-Dependent Content
```tsx
'use client';

export function NavAuth() {
  const { hasHydrated, isAuthenticated } = useAuth();

  // Don't render until auth context is ready
  if (!hasHydrated) return <NavSkeleton />;

  return isAuthenticated ? <AuthMenu /> : <LoginLink />;
}
```

### Pattern 3: Browser API Usage
```tsx
'use client';

export function WindowSize() {
  const [width, setWidth] = useState(0); // 0 on server

  useEffect(() => {
    // Only run on client
    setWidth(window.innerWidth);
    
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handle);
    return () => removeEventListener('resize', handle);
  }, []);

  return <div>{width ? `Width: ${width}px` : 'Loading...'}</div>;
}
```

### Pattern 4: Conditional Imports (when absolutely necessary)
```tsx
'use client';

let THREE: typeof import('three') | null = null;

useEffect(() => {
  import('three').then(module => {
    THREE = module;
  });
}, []);

// Or use dynamic imports:
import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('./Canvas'), { ssr: false });
```

---

## Checklist Before Commit

- [ ] No `typeof window !== 'undefined'` checks in render logic
- [ ] No `localStorage.getItem()` calls outside useEffect
- [ ] No DOM mutations in useEffect without hydration guard
- [ ] No `Date.now()` or `Math.random()` used for rendering IDs
- [ ] Context providers use proper hydration patterns
- [ ] Client-only components wrapped in `ClientHydrationGuard`
- [ ] Test in production build (`npm run build && npm run start`)
- [ ] Run `npm run lint` before pushing
- [ ] No hydration warnings in browser console

---

## Files to Reference

### Core Hydration Infrastructure
- [lib/useTheme.tsx](lib/useTheme.tsx) - ✅ Proper theme hydration pattern
- [components/ClientHydrationGuard.tsx](components/ClientHydrationGuard.tsx) - ✅ Hydration guard
- [lib/auth-context.tsx](lib/auth-context.tsx) - ✅ Proper context with hasHydrated
- [app/layout.tsx](app/layout.tsx) - ✅ Layout with suppressHydrationWarning

### Examples in Project
- [components/ui/Navbar.tsx](components/ui/Navbar.tsx) - Uses `hasHydrated` correctly
- [components/ui/ActionMenu.tsx](components/ui/ActionMenu.tsx) - Renders fallback before hydration

---

## Debugging Hydration Issues

### Step 1: Check Browser Console
Look for warnings like:
- `"A tree hydrated but some attributes of the server rendered HTML didn't match"`
- `"Detected scroll-behavior: smooth on the <html> element"`

### Step 2: Find the Component
The warning usually shows which component caused the issue. Look at its render logic.

### Step 3: Apply Fix Pattern
- If accessing browser APIs → Wrap in `useEffect`
- If checking authentication → Check `hasHydrated` first
- If conditional rendering → Use `ClientHydrationGuard`

### Step 4: Test
```bash
npm run build
npm run start
# Check console for warnings
```

---

## Performance Considerations

✅ **Good for performance:**
- useEffect loading is fast (typically <50ms)
- Browser caching means subsequent navigations are instant
- No layout shift if fallback is properly sized

⚠️ **Watch out for:**
- Fallback components should match content height/width
- Don't load large data before hydration guard
- Cache API responses to avoid loading on every hydration

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Dark mode flashes on load | Theme applied after hydration | Load theme in first useEffect |
| "Hydration mismatch" warning | Server/client render differently | Use `ClientHydrationGuard` or `useEffect` |
| Auth menu shows/hides | Auth state not ready on server | Check `hasHydrated` before rendering |
| Extension injects attributes | Third-party extensions modify DOM | Use `suppressHydrationWarning` on parent |

---

## Additional Resources

- [HYDRATION_FIXES.md](HYDRATION_FIXES.md) - Detailed explanation of fixes applied
- [Next.js Hydration Docs](https://nextjs.org/docs/app/building-your-application/rendering/server-components#hydration)
- [React Hydration API](https://react.dev/reference/react-dom/hydrateRoot)

