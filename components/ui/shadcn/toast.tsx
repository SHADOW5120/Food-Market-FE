'use client';

import toast, { Toaster } from 'react-hot-toast';

export const AppToaster = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: '#111827',
        color: '#f8fafc',
        borderRadius: '1rem',
        padding: '14px 18px',
        boxShadow: '0 24px 65px rgba(15, 23, 42, 0.16)',
      },
      success: {
        iconTheme: {
          primary: '#22c55e',
          secondary: '#fff',
        },
      },
      error: {
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      },
    }}
  />
);

export { toast };
