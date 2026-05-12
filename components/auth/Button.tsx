'use client';

import { ButtonHTMLAttributes } from 'react';
import { Loader } from './Icons';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  isLoading = false,
  fullWidth = true,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-primary hover:bg-primary text-primary-foreground disabled:opacity-50',
    secondary: 'bg-secondary hover:bg-secondary text-secondary-foreground disabled:opacity-50',
    outline: 'border-2 border-primary text-primary hover:bg-muted disabled:opacity-50',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} disabled:cursor-not-allowed`}
      {...props}
    >
      {isLoading && <Loader className="animate-spin" />}
      {children}
    </button>
  );
}
