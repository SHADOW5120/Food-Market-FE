'use client';

import { useState, useRef } from 'react';
import { User } from '@/lib/types';
import { Input } from '../auth/Input';
import { Button } from '../auth/Button';
import { AvatarUpload } from './AvatarUpload';
import { validateEditProfileForm, validatePhone } from '@/lib/validators';
import { updateProfile, uploadAvatar } from '@/lib/api';
import Link from 'next/link';

interface EditProfileFormProps {
  user: User;
  onSuccess: (updatedUser: User) => void;
  onError: (error: string) => void;
}

export function EditProfileForm({ user, onSuccess, onError }: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    username: user.username || '',
    phone: user.phone || '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Validate form
    const validationErrors = validateEditProfileForm({
      username: formData.username,
      phone: formData.phone,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      let updatedUserData: User = user;

      // Update profile
      const profileResponse = await updateProfile({
        username: formData.username,
        phone: formData.phone,
      });

      if (!profileResponse.success) {
        onError(profileResponse.error || 'Failed to update profile');
        setIsLoading(false);
        return;
      }

      if (profileResponse.data?.user) {
        updatedUserData = profileResponse.data.user;
      }

      // Upload avatar if provided
      if (avatarFile) {
        const avatarResponse = await uploadAvatar(avatarFile);
        if (!avatarResponse.success) {
          onError(avatarResponse.error || 'Failed to upload avatar');
          setIsLoading(false);
          return;
        }

        if (avatarResponse.data?.url) {
          updatedUserData = { ...updatedUserData, avatar: avatarResponse.data.url };
        }
      }

      setSuccessMessage('Profile updated successfully!');
      setHasChanges(false);
      setAvatarFile(null);
      onSuccess(updatedUserData);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Edit Profile
        </h1>
        <p className="text-gray-600">Update your profile information</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
          ✓ {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="border-b border-gray-200 pb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Picture</h2>
          <AvatarUpload
            currentAvatar={user.avatar}
            username={user.username}
            onAvatarChange={handleAvatarChange}
            isLoading={isLoading}
          />
        </div>

        {/* Personal Info Section */}
        <div className="border-b border-gray-200 pb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-600 font-medium cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <Input
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              error={errors.username}
              placeholder="Enter your username"
              disabled={isLoading}
              minLength={3}
              maxLength={20}
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!hasChanges || isLoading}
            fullWidth
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Link href="/profile" className="w-full">
            <button
              type="button"
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
