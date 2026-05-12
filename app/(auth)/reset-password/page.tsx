'use client';

export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/auth/Input';
import { Button } from '@/components/auth/Button';
import { LockIcon } from '@/components/auth/Icons';
import { resetPassword } from '@/lib/api';
import { validatePassword, validateConfirmPassword } from '@/lib/validators';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Autofocus first input
  useEffect(() => {
    passwordInputRef.current?.focus();
  }, []);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      setApiError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  const isFormValid =
    formData.password &&
    formData.confirmPassword &&
    Object.keys(errors).length === 0 &&
    token;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    const newErrors: Record<string, string> = {};

    if (name === 'password') {
      const passwordError = validatePassword(value);
      if (passwordError) newErrors.password = passwordError;
    }

    const confirmError = validateConfirmPassword(
      name === 'password' ? value : formData.password,
      name === 'confirmPassword' ? value : formData.confirmPassword
    );
    if (confirmError) newErrors.confirmPassword = confirmError;

    setErrors(newErrors);
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!token) {
      setApiError('Invalid reset token');
      return;
    }

    const newErrors: Record<string, string> = {};
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmError) newErrors.confirmPassword = confirmError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword({
        token,
        password: formData.password,
      });

      if (response.success) {
        setSuccessMessage('Your password has been reset successfully.');
        setFormData({ password: '', confirmPassword: '' });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setApiError(response.error || 'Failed to reset password');
      }
    } catch (error) {
      setApiError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid) {
      handleSubmit(e as any);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {apiError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

        {successMessage && (
          <div className="bg-muted border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] text-success px-4 py-3 rounded-lg">
            {successMessage}
            <p className="text-sm mt-2">Redirecting to login...</p>
          </div>
        )}

        {!successMessage && token && (
          <>
            <Input
              ref={passwordInputRef}
              label="New Password"
              name="password"
              type="password"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              error={errors.password}
              icon={<LockIcon />}
              showPasswordToggle
              disabled={isLoading}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              value={formData.confirmPassword}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              error={errors.confirmPassword}
              icon={<LockIcon />}
              showPasswordToggle
              disabled={isLoading}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </>
        )}

        <div className="text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link
            href="/login"
            className="text-accent hover:text-accent font-medium transition-colors"
          >
            Back to login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}



