'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Redirect to dashboard
export default function SellerPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/seller/dashboard');
  }, [router]);

  return null;
}




