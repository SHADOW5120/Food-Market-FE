'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { USER_ROLES } from '@/lib/constants';

// Redirect to dashboard
export default function SellerPage() {
  const { role, hasHydrated } = useAuth();
  const router = useRouter();
  const isSeller = role === USER_ROLES.SELLER;

  useEffect(() => {
    if (!hasHydrated || !isSeller) {
      return;
    }
    router.replace('/seller/dashboard');
  }, [hasHydrated, isSeller, router]);

  return (
    <ProtectedRoute requiredRoles={[USER_ROLES.SELLER]}>
      <div />
    </ProtectedRoute>
  );
}




