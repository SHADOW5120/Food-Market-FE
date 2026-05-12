'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';

export default function ChangePasswordPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [user, authLoading, router]);

  const handleSuccess = () => {
    // Redirect back to profile after 2 seconds
    setTimeout(() => {
      router.push('/profile');
    }, 2000);
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-[color:hsl(var(--border))] border-t-orange-600 rounded-full" />
          </div>
          <p className="mt-4 text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/profile')}
          className="text-primary hover:text-primary font-semibold transition-colors flex items-center gap-2 mb-4"
        >
          â† Back to Profile
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium">
          âš ï¸ {errorMessage}
        </div>
      )}

      {/* Change Password Form */}
      <ChangePasswordForm
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}



