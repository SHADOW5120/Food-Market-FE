'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/auth/Input';
import { Button } from '@/components/auth/Button';
import { sellerAuthApi } from '@/lib/api';
import { useAuthNavigation } from '@/lib/hooks';
import { validateEmail } from '@/lib/validators';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { sectionStagger, fadeInUp } from '@/components/ui/motion';

export default function SellerLoginPage() {
  const router = useRouter();
  const { loginAndNavigate } = useAuthNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      const response = await sellerAuthApi.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success && response.data?.user && response.data?.accessToken) {
        // Check if user is actually a seller
        if (response.data.user.role !== 'seller') {
          toast.error('This account is not registered as a seller');
          return;
        }

        toast.success('Login successful! Welcome back to your seller dashboard');
        loginAndNavigate(response.data.user, response.data.accessToken, '/seller');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Seller Login"
      subtitle="Access your Food Market seller dashboard"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5"
        variants={sectionStagger}
        initial="hidden"
        animate="visible"
      >
        {/* Email Input */}
        <motion.div variants={fadeInUp}>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="your@email.com"
            icon={<Mail className="w-4 h-4" />}
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            disabled={isLoading}
            autoFocus
          />
        </motion.div>

        {/* Password Input */}
        <motion.div variants={fadeInUp}>
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            icon={<Lock className="w-4 h-4" />}
            showPasswordToggle
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            disabled={isLoading}
          />
        </motion.div>

        {/* Remember Me & Forgot Password */}
        <motion.div variants={fadeInUp} className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-2 border-muted-foreground cursor-pointer accent-primary"
            />
            <span className="text-sm text-muted-foreground">Remember me</span>
          </label>
          <Link
            href="/seller-auth/forgot-password"
            className="text-sm text-primary hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={fadeInUp} className="pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Logging in...' : 'Login to Dashboard'}
          </Button>
        </motion.div>

        {/* Register Link */}
        <motion.div variants={fadeInUp} className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have a seller account?{' '}
            <Link href="/seller-auth/register" className="text-primary hover:underline font-medium">
              Register now
            </Link>
          </p>
        </motion.div>

        {/* Regular User Link */}
        <motion.div variants={fadeInUp} className="text-center pt-2 border-t border-muted">
          <p className="text-xs text-muted-foreground mb-2">
            Shopping as a customer?
          </p>
          <Link href="/login" className="text-sm text-primary hover:underline font-medium">
            Customer Login
          </Link>
        </motion.div>
      </motion.form>
    </AuthCard>
  );
}
