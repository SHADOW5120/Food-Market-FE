'use client';

import { UserProfile } from '@/lib/types';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '../auth/Button';

interface ProfileCardProps {
  userProfile: UserProfile;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export function ProfileCard({ userProfile, onLogout, isLoggingOut = false }: ProfileCardProps) {
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full mx-auto">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-primary-foreground text-5xl overflow-hidden mb-4 flex-shrink-0">
        <Avatar
          src={userProfile.avatarUrl}
          username={userProfile.username}
          size={96}
          className="w-full h-full"
        />
      </div>
        <Link href="/profile/edit">
          <button className="text-sm text-accent hover:text-accent font-semibold transition-colors">
            Change Avatar
          </button>
        </Link>
      </div>

      {/* Personal Info Section */}
      <div className="mb-8 pb-8 border-b border-[color:hsl(var(--border))]">
        <h2 className="text-lg font-bold text-foreground mb-6">Personal Information</h2>
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-[color:hsl(var(--border))]">
            <label className="text-sm font-medium text-muted-foreground mb-2 md:mb-0">Username</label>
            <span className="text-foreground font-medium">{userProfile.username}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-[color:hsl(var(--border))]">
            <label className="text-sm font-medium text-muted-foreground mb-2 md:mb-0">Email</label>
            <span className="text-foreground font-medium break-all">{userProfile.email}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3">
            <label className="text-sm font-medium text-muted-foreground mb-2 md:mb-0">Phone</label>
            <span className="text-foreground font-medium">{userProfile.phone || 'Not set'}</span>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="mb-8 pb-8 border-b border-[color:hsl(var(--border))]">
        <h2 className="text-lg font-bold text-foreground mb-6">Security</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Manage your password and secure your account
        </p>
        <Link href="/profile/change-password" className="w-full block">
          <Button variant="secondary" fullWidth>
            Change Password
          </Button>
        </Link>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link href="/profile/edit" className="w-full block">
          <Button variant="primary" fullWidth>
            Edit Profile
          </Button>
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-destructive hover:bg-destructive text-destructive-foreground disabled:bg-destructive disabled:cursor-not-allowed"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {/* Account Info */}
      <div className="mt-8 pt-8 border-t border-[color:hsl(var(--border))] border-[color:hsl(var(--border))]">
        <p className="text-xs text-muted-foreground text-center">
          Account Created: {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
        </p>
      </div>
    </div>
  );
}



