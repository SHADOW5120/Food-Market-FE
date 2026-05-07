'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { User } from '@/lib/types';

export default function EditProfilePage() {
  const { user, updateUser, isLoading: authLoading } = useAuth();
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

  const handleSuccess = (updatedUser: User) => {
    // Update the complete user object in auth store with latest data from API
    updateUser({
      username: updatedUser.username,
      phone: updatedUser.phone,
      avatarUrl: updatedUser.avatarUrl,
      email: updatedUser.email,
      id: updatedUser.id,
      role: updatedUser.role,
    });
    
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-600 rounded-full" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/profile')}
          className="text-orange-600 hover:text-orange-700 font-semibold transition-colors flex items-center gap-2 mb-4"
        >
          ← Back to Profile
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Edit Profile Form */}
      <EditProfileForm
        user={user}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}
