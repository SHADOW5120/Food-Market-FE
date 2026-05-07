'use client';

export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/auth/Input';
import { Button } from '@/components/auth/Button';
import { MailIcon, LockIcon } from '@/components/auth/Icons';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { validateLoginForm } from '@/lib/validators';
import { AuthLoginResponse } from '@/lib/types';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const authStore = useAuthStore();
  const [redirectRoute, setRedirectRoute] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Autofocus first input and capture redirect param from URL
  useEffect(() => {
    emailInputRef.current?.focus();
    const searchParams = new URLSearchParams(window.location.search);
    setRedirectRoute(searchParams.get('redirect'));
  }, []);

  const isFormValid = formData.email && formData.password && Object.keys(errors).length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    const newErrors = validateLoginForm({
      ...formData,
      [name]: value,
    });
    setErrors(newErrors);
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response: AuthLoginResponse = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success && response.data) {
        const { user, accessToken } = response.data;
        authStore.login(user, accessToken);
        await authStore.refetchUserProfile();

        toast.success('Login successful!');

        // Redirect logic
        const intendedRoute = authStore.intendedRoute || redirectRoute;
        if (intendedRoute) {
          authStore.setIntendedRoute(null);
          router.push(intendedRoute);
        } else {
          // Role-based redirect
          if (user.role === 'seller') {
            router.push('/seller');
          } else {
            router.push('/');
          }
        }
      } else {
        setApiError(response.error || 'Login failed');
        toast.error(response.error || 'Login failed');
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setApiError(errorMessage);
      toast.error(errorMessage);
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
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

        <Input
          ref={emailInputRef}
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          error={errors.email}
          icon={<MailIcon />}
          disabled={isLoading}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          error={errors.password}
          icon={<LockIcon />}
          showPasswordToggle
          disabled={isLoading}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="space-y-3 text-center text-sm">
          <div>
            <Link
              href="/forgot-password"
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </AuthCard>
  );
}
