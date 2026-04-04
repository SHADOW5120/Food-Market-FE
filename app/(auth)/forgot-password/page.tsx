'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/auth/Input';
import { Button } from '@/components/auth/Button';
import { MailIcon, CheckIcon } from '@/components/auth/Icons';
import { forgotPassword } from '@/lib/api';
import { validateEmail } from '@/lib/validators';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Autofocus first input
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    const error = validateEmail(value);
    setEmailError(error || '');
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPassword({ email });

      if (response.success) {
        setSuccessMessage(
          'If an account exists with this email, you will receive a password reset link within a few minutes.'
        );
        setEmail('');
        setEmailError('');
      } else {
        setApiError(response.error || 'Failed to process request');
      }
    } catch (error) {
      setApiError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && email && !emailError) {
      handleSubmit(e as any);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your email to receive a reset link"
    >
      <div className="space-y-6">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex gap-3">
            <CheckIcon />
            <div>{successMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!successMessage && (
            <>
              <Input
                ref={emailInputRef}
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                error={emailError}
                icon={<MailIcon />}
                disabled={isLoading}
              />

              <Button
                type="submit"
                isLoading={isLoading}
                disabled={!email || !!emailError || isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </>
          )}

          <div className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link
              href="/login"
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </AuthCard>
  );
}
