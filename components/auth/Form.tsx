'use client';

/**
 * Reusable form component with validation
 * Can be used for auth forms and other forms
 */

interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function AuthForm({ onSubmit, children, className = '', isLoading = false }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`} noValidate>
      {children}
    </form>
  );
}

/**
 * Form field wrapper component
 */
interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export function FormField({ children, className = '' }: FormFieldProps) {
  return <div className={`w-full ${className}`}>{children}</div>;
}

/**
 * Form actions (buttons) container
 */
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function FormActions({ children, className = '' }: FormActionsProps) {
  return (
    <div className={`flex gap-2 pt-2 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Form footer (links, dividers, etc)
 */
interface FormFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function FormFooter({ children, className = '' }: FormFooterProps) {
  return (
    <div className={`pt-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
}
