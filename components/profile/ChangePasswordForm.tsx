'use client';

import { useState } from 'react';
import { Input } from '../auth/Input';
import { Button } from '../auth/Button';
import { validateChangePasswordForm, validatePasswordStrength } from '@/lib/validators';
import { changePassword } from '@/lib/api';
import Link from 'next/link';

interface ChangePasswordFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function ChangePasswordForm({ onSuccess, onError }: ChangePasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<{
    isStrong: boolean;
    feedback: string[];
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Check password strength
    if (name === 'newPassword' && value) {
      setPasswordStrength(validatePasswordStrength(value));
    } else if (name === 'newPassword') {
      setPasswordStrength(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Validate form
    const validationErrors = validateChangePasswordForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (!response.success) {
        onError(response.error || 'Failed to change password');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      onSuccess();

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
          Change Password
        </h1>
        <p className="text-gray-600">Update your password to keep your account secure</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
          ✓ {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <Input
          label="Current Password"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleInputChange}
          error={errors.currentPassword}
          placeholder="Enter your current password"
          disabled={isLoading}
          showPasswordToggle
          required
        />

        {/* New Password */}
        <div className="space-y-3">
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleInputChange}
            error={errors.newPassword}
            placeholder="Enter your new password"
            disabled={isLoading}
            showPasswordToggle
            required
            minLength={8}
          />

          {/* Password Strength Indicator */}
          {formData.newPassword && passwordStrength && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.isStrong ? 'bg-green-500 w-full' : 'bg-yellow-500 w-2/3'
                    }`}
                  />
                </div>
                <span className="text-xs font-semibold">
                  {passwordStrength.isStrong ? (
                    <span className="text-green-600">Strong</span>
                  ) : (
                    <span className="text-yellow-600">Medium</span>
                  )}
                </span>
              </div>

              {!passwordStrength.isStrong && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-2">Password needs:</p>
                  <ul className="space-y-1">
                    {passwordStrength.feedback.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-gray-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          placeholder="Confirm your new password"
          disabled={isLoading}
          showPasswordToggle
          required
        />

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-900">
            <strong>Password Requirements:</strong>
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ At least 8 characters long</li>
            <li>✓ Contains uppercase letter</li>
            <li>✓ Contains lowercase letter</li>
            <li>✓ Contains number</li>
            <li>✓ Contains special character</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={
              !formData.currentPassword ||
              !formData.newPassword ||
              !formData.confirmPassword ||
              isLoading
            }
            fullWidth
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
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
