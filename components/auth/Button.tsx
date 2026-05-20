'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { btnMotion } from '@/components/ui/motion';
import { Loader } from './Icons';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = true,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2';
  const sizeStyles =
    size === 'sm'
      ? 'py-2 px-3 text-sm'
      : size === 'lg'
      ? 'py-4 px-5 text-base'
      : 'py-3 px-4 text-sm';

  const variantStyles = {
    primary: 'bg-primary hover:bg-primary text-primary-foreground disabled:opacity-50',
    secondary: 'bg-secondary hover:bg-secondary text-secondary-foreground disabled:opacity-50',
    outline: 'border-2 border-primary text-primary hover:bg-muted disabled:opacity-50',
  };

  const sizeStyle =
    size === 'sm'
      ? 'py-2 px-3 text-sm'
      : size === 'lg'
      ? 'py-4 px-5 text-base'
      : 'py-3 px-4 text-sm';
  const widthStyle = fullWidth ? 'w-full' : '';

  const motionProps = disabled || isLoading ? {} : btnMotion;

  return (
    <motion.button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyle} ${variantStyles[variant]} ${widthStyle} disabled:cursor-not-allowed`}
      {...motionProps}
      {...props}
    >
      {isLoading && <Loader className="animate-spin" />}
      {children}
    </motion.button>
  );
}
