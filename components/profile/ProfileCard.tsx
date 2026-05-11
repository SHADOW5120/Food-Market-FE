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
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full mx-auto">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-5xl overflow-hidden mb-4 flex-shrink-0">
        <Avatar
          src={userProfile.avatarUrl}
          username={userProfile.username}
          size={96}
          className="w-full h-full"
        />
      </div>
        <Link href="/profile/edit">
          <button className="text-sm text-orange-500 hover:text-orange-600 font-semibold transition-colors">
            Change Avatar
          </button>
        </Link>
      </div>

      {/* Personal Info Section */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h2>
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-gray-100">
            <label className="text-sm font-medium text-gray-600 mb-2 md:mb-0">Username</label>
            <span className="text-gray-900 font-medium">{userProfile.username}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-gray-100">
            <label className="text-sm font-medium text-gray-600 mb-2 md:mb-0">Email</label>
            <span className="text-gray-900 font-medium break-all">{userProfile.email}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3">
            <label className="text-sm font-medium text-gray-600 mb-2 md:mb-0">Phone</label>
            <span className="text-gray-900 font-medium">{userProfile.phone || 'Not set'}</span>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Security</h2>
        <p className="text-sm text-gray-600 mb-6">
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
          className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {/* Account Info */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Account Created: {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
        </p>
      </div>
    </div>
  );
}
