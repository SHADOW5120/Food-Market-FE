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
    confirmNewPassword: '',
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
        confirmNewPassword: formData.confirmNewPassword,
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
        confirmNewPassword: '',
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
    <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Change Password
        </h1>
        <p className="text-muted-foreground">Update your password to keep your account secure</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-muted border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] rounded-lg text-success text-sm font-medium">
          âœ“ {successMessage}
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
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.isStrong ? 'bg-success w-full' : 'bg-warning w-2/3'
                    }`}
                  />
                </div>
                <span className="text-xs font-semibold">
                  {passwordStrength.isStrong ? (
                    <span className="text-success">Strong</span>
                  ) : (
                    <span className="text-warning">Medium</span>
                  )}
                </span>
              </div>

              {!passwordStrength.isStrong && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                  <p className="font-semibold mb-2">Password needs:</p>
                  <ul className="space-y-1">
                    {passwordStrength.feedback.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-muted-foreground">â€¢</span>
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
          name="confirmNewPassword"
          type="password"
          value={formData.confirmNewPassword}
          onChange={handleInputChange}
          error={errors.confirmNewPassword}
          placeholder="Confirm your new password"
          disabled={isLoading}
          showPasswordToggle
          required
        />

        {/* Info Box */}
        <div className="bg-muted border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] rounded-lg p-4 space-y-2">
          <p className="text-sm text-foreground">
            <strong>Password Requirements:</strong>
          </p>
          <ul className="text-sm text-secondary space-y-1">
            <li>âœ“ At least 8 characters long</li>
            <li>âœ“ Contains uppercase letter</li>
            <li>âœ“ Contains lowercase letter</li>
            <li>âœ“ Contains number</li>
            <li>âœ“ Contains special character</li>
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
              !formData.confirmNewPassword ||
              isLoading
            }
            fullWidth
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </Button>
          <Link href="/profile" className="w-full">
            <button
              type="button"
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 border-2 border-[color:hsl(var(--border))] text-foreground hover:bg-muted disabled:opacity-50"
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




