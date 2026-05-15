'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/auth/Input';
import { Button } from '@/components/auth/Button';
import { Icons } from '@/components/auth/Icons';
import { sellerAuthApi } from '@/lib/api';
import { useAuthNavigation } from '@/lib/hooks';
import { validateEmail, validatePassword } from '@/lib/validators';
import { Store, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function SellerRegisterPage() {
  const router = useRouter();
  const { loginAndNavigate } = useAuthNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
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

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zip.trim()) {
      newErrors.zip = 'ZIP code is required';
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
      const response = await sellerAuthApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        storeName: formData.storeName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      });

      if (response.success && response.data?.user && response.data?.accessToken) {
        toast.success('Registration successful! Welcome to Food Market Seller Portal');
        loginAndNavigate(response.data.user, response.data.accessToken, '/seller');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Seller Registration"
      subtitle="Start selling your products on Food Market"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Personal Information Section */}
        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold text-foreground mb-3">Personal Information</h3>
          <Input
            label="Username"
            name="username"
            type="text"
            placeholder="Your username"
            icon={<User className="w-4 h-4" />}
            value={formData.username}
            onChange={handleInputChange}
            error={errors.username}
            disabled={isLoading}
            autoFocus
          />
        </motion.div>

        {/* Email & Password Section */}
        <motion.div variants={itemVariants} className="space-y-4">
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
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            icon={<Lock className="w-4 h-4" />}
            showPasswordToggle
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            disabled={isLoading}
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            icon={<Lock className="w-4 h-4" />}
            showPasswordToggle
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            disabled={isLoading}
          />
        </motion.div>

        {/* Store Information Section */}
        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold text-foreground mb-3">Store Information</h3>
          <Input
            label="Store Name"
            name="storeName"
            type="text"
            placeholder="Your store name"
            icon={<Store className="w-4 h-4" />}
            value={formData.storeName}
            onChange={handleInputChange}
            error={errors.storeName}
            disabled={isLoading}
          />
        </motion.div>

        {/* Contact Information Section */}
        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold text-foreground mb-3">Contact Information</h3>
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            icon={<Phone className="w-4 h-4" />}
            value={formData.phone}
            onChange={handleInputChange}
            error={errors.phone}
            disabled={isLoading}
          />
        </motion.div>

        {/* Address Section */}
        <motion.div variants={itemVariants} className="space-y-4">
          <Input
            label="Address"
            name="address"
            type="text"
            placeholder="Street address"
            icon={<MapPin className="w-4 h-4" />}
            value={formData.address}
            onChange={handleInputChange}
            error={errors.address}
            disabled={isLoading}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              name="city"
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              error={errors.city}
              disabled={isLoading}
            />
            <Input
              label="State"
              name="state"
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={handleInputChange}
              error={errors.state}
              disabled={isLoading}
            />
          </div>

          <Input
            label="ZIP Code"
            name="zip"
            type="text"
            placeholder="12345"
            value={formData.zip}
            onChange={handleInputChange}
            error={errors.zip}
            disabled={isLoading}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Creating Account...' : 'Create Seller Account'}
          </Button>
        </motion.div>

        {/* Login Link */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have a seller account?{' '}
            <Link href="/seller-auth/login" className="text-primary hover:underline font-medium">
              Login
            </Link>
          </p>
        </motion.div>

        {/* Regular User Link */}
        <motion.div variants={itemVariants} className="text-center pt-2 border-t border-muted">
          <p className="text-xs text-muted-foreground mb-2">
            Not a seller?
          </p>
          <Link href="/register" className="text-sm text-primary hover:underline font-medium">
            Register as a customer
          </Link>
        </motion.div>
      </motion.form>
    </AuthCard>
  );
}
