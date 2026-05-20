'use client';

import { InputHTMLAttributes, useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { interactiveMotion } from '@/components/ui/motion';
import { EyeIcon, EyeOffIcon } from './Icons';

type MotionFriendlyInputAttributes = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragExit'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDrop'
>;

interface InputProps extends MotionFriendlyInputAttributes {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      showPasswordToggle = false,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
  const motionInputProps = props as any;

  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <motion.input
          ref={ref}
          type={inputType}
          {...interactiveMotion}
          className={`w-full px-4 ${icon ? 'pl-12' : ''} py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none ${
            error
              ? 'border-destructive focus:border-destructive'
              : 'border-[color:hsl(var(--border))] focus:border-primary'
          } bg-input text-foreground placeholder-muted-foreground`}
          {...motionInputProps}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
);

Input.displayName = 'Input';
