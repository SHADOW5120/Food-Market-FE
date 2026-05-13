'use client';

import { useEffect, useState, ReactNode } from 'react';

/**
 * ClientHydrationGuard: Prevents hydration mismatches by ensuring
 * children are only rendered after hydration completes.
 * 
 * Use this to wrap components that:
 * - Access localStorage/sessionStorage
 * - Access browser APIs (matchMedia, navigator, etc.)
 * - Use dynamic state based on client-only conditions
 * - Check user authentication/roles from context
 * 
 * Example:
 * ```tsx
 * <ClientHydrationGuard fallback={<Skeleton />}>
 *   <NavLinks />
 * </ClientHydrationGuard>
 * ```
 */
export function ClientHydrationGuard({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return fallback ?? null;
  }

  return <>{children}</>;
}
