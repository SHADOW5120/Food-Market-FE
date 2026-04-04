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
    primary: 'bg-orange-500 hover:bg-orange-600 text-white disabled:bg-orange-300',
    secondary: 'bg-green-500 hover:bg-green-600 text-white disabled:bg-green-300',
    outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50 disabled:opacity-50',
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
