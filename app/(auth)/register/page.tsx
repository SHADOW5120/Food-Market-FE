'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/auth/Input';
import { Button } from '@/components/auth/Button';
import { MailIcon, LockIcon, UserIcon } from '@/components/auth/Icons';
import { register } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { validateRegisterForm } from '@/lib/validators';

export default function RegisterPage() {
  const router = useRouter();
  const { login: loginUser, refetchUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const usernameInputRef = useRef<HTMLInputElement>(null);

  // Autofocus first input
  useEffect(() => {
    usernameInputRef.current?.focus();
  }, []);

  const isFormValid =
    formData.username &&
    formData.email &&
    formData.password &&
    formData.confirmNewPassword &&
    Object.keys(errors).length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    const newErrors = validateRegisterForm({
      ...formData,
      [name]: value,
    });
    setErrors(newErrors);
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.success && response.data) {
        loginUser(response.data.user, response.data.accessToken);
        await refetchUserProfile();
        router.push('/');
      } else {
        setApiError(response.error || 'Registration failed');
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
      title="Create Account"
      subtitle="Join us to start ordering delicious food"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

        <Input
          ref={usernameInputRef}
          label="Username"
          name="username"
          type="text"
          placeholder="foodlover123"
          value={formData.username}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          error={errors.username}
          icon={<UserIcon />}
          disabled={isLoading}
        />

        <Input
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

        <Input
          label="Confirm Password"
          name="confirmNewPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          error={errors.confirmNewPassword}
          icon={<LockIcon />}
          showPasswordToggle
          disabled={isLoading}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
