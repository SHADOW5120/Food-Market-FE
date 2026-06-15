'use client';

import { useEffect } from 'react';
import { initMocking } from '@/lib/mock/mockFetch';

export default function MockInitializer() {
  useEffect(() => {
    try {
      initMocking();
    } catch (err) {
      // ignore in production
      // console.error('Failed to initialize mock', err);
    }
  }, []);

  return null;
}
