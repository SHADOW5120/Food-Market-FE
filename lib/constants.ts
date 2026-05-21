/**
 * Application constants
 */

export const APP_NAME = 'Food Market';

/**
 * Validation constraints
 */
export const VALIDATION = {
  USERNAME: {
    MIN: 3,
    MAX: 20,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  PASSWORD: {
    MIN: 8,
    MAX: 100,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    PROFILE: '/users/me',
    UPDATE: '/users/profile',
  },
} as const;

/**
 * User roles
 */
export const USER_ROLES = {
  ADMIN: 'Admin',
  USER: 'User',
  SELLER: 'Seller',
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 8 characters.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  LOGIN_FAILED: 'Invalid email or password.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  RESET_FAILED: 'Failed to reset password. The link may have expired.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email.',
  PASSWORD_RESET_SUCCESS: 'Password reset successful!',
  LOGOUT_SUCCESS: 'You have been logged out.',
} as const;

/**
 * Timing constants (in milliseconds)
 */
export const TIMING = {
  DEBOUNCE: 300,
  THROTTLE: 500,
  REDIRECT_DELAY: 2000,
  TOAST_DURATION: 3000,
  API_TIMEOUT: 30000,
} as const;
