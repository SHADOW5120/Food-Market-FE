/**
 * Validation utilities for auth forms
 */

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export type FormErrors = Record<string, string>;

export function validateEmail(email: string): string | undefined {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return undefined;
}

export function validatePassword(password: string, minLength = 8): string | undefined {
  if (!password) return 'Password is required';
  if (password.length < minLength) return `Password must be at least ${minLength} characters`;
  return undefined;
}

export function validateUsername(username: string): string | undefined {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 20) return 'Username must be at most 20 characters';
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return 'Username can only contain letters, numbers, hyphens, and underscores';
  }
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | undefined {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return undefined;
}

export function validateLoginForm(data: {
  email: string;
  password: string;
}): FormErrors {
  const errors: FormErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateRegisterForm(data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): FormErrors {
  const errors: FormErrors = {};

  const usernameError = validateUsername(data.username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  return errors;
}

export function validatePhone(phone: string): string | undefined {
  if (!phone) return 'Phone number is required';
  // Allow various phone formats (10-15 digits, with optional spaces or dashes)
  const phoneRegex = /^[\d\s\-\(\)]{10,15}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Please enter a valid phone number';
  }
  return undefined;
}

export function validatePasswordStrength(password: string): {
  isStrong: boolean;
  feedback: string[];
} {
  const feedback: string[] = [];
  let isStrong = true;

  if (password.length < 8) {
    feedback.push('At least 8 characters');
    isStrong = false;
  }
  if (!/[A-Z]/.test(password)) {
    feedback.push('One uppercase letter');
    isStrong = false;
  }
  if (!/[a-z]/.test(password)) {
    feedback.push('One lowercase letter');
    isStrong = false;
  }
  if (!/[0-9]/.test(password)) {
    feedback.push('One number');
    isStrong = false;
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('One special character');
    isStrong = false;
  }

  return { isStrong, feedback };
}

export function validateChangePasswordForm(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): FormErrors {
  const errors: FormErrors = {};

  if (!data.currentPassword) {
    errors.currentPassword = 'Current password is required';
  }

  const newPasswordError = validatePassword(data.newPassword);
  if (newPasswordError) {
    errors.newPassword = newPasswordError;
  }

  if (data.currentPassword === data.newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }

  const confirmError = validateConfirmPassword(data.newPassword, data.confirmPassword);
  if (confirmError) {
    errors.confirmPassword = confirmError;
  }

  return errors;
}

export function validateEditProfileForm(data: {
  username: string;
  phone?: string;
}): FormErrors {
  const errors: FormErrors = {};

  const usernameError = validateUsername(data.username);
  if (usernameError) errors.username = usernameError;

  if (data.phone) {
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.phone = phoneError;
  }

  return errors;
}

