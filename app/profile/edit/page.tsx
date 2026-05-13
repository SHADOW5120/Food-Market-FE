'use client';

import { AlertTriangle, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { getProfile } from '@/lib/api';
import { UserProfile } from '@/lib/types';

export default function EditProfilePage() {
  const { updateUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [userProfile, setUser] = useState<UserProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to load profile for edit:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSuccess = (updatedUserProfile: UserProfile) => {
    updateUser({
      username: updatedUserProfile.username,
      phone: updatedUserProfile.phone,
      avatarUrl: updatedUserProfile.avatarUrl,
      email: updatedUserProfile.email,
      id: updatedUserProfile.id,
      role: updatedUserProfile.role,
    });

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
          <p className="mt-4 text-muted-foreground font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
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
          <ChevronLeft className="w-4 h-4" />
          Back to Profile
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {errorMessage}
        </div>
      )}

      {/* Edit Profile Form */}
      <EditProfileForm
        userProfile={userProfile}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}



