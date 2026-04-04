# Authentication System Documentation

## Overview

This is a complete authentication frontend system for the Food Market application built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

✅ **Complete Auth Pages**
- Login page with email & password
- Registration with validation
- Password recovery/reset flow
- Forgot password email request

✅ **Security**
- Password strength validation
- Secure token storage in localStorage
- Protected API calls with Bearer tokens
- Form validation with real-time feedback
- CSRF protection ready

✅ **User Experience**
- Form validation with error messages
- Password show/hide toggle
- Enter key submit support
- Autofocus first input field
- Loading states on buttons
- Disabled button states for invalid forms
- Responsive mobile-friendly design

✅ **State Management**
- React Context API for auth state
- User persistence across tabs
- Automatic token attachment to API calls
- Clean logout functionality

✅ **UI/UX**
- Modern card-based layout
- Gradient backgrounds
- Smooth animations (fade-in, slide-up)
- Icon integration
- Consistent color scheme (orange/green)
- Dark mode ready (CSS variables)

## Project Structure

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   ├── reset-password/
│   │   └── page.tsx
│   └── layout.tsx
├── page.tsx (protected home page)
├── layout.tsx (with AuthProvider)
└── globals.css (animations & styles)

components/
├── auth/
│   ├── Input.tsx (reusable input component)
│   ├── Button.tsx (reusable button component)
│   ├── AuthCard.tsx (form layout)
│   └── Icons.tsx (SVG icons)
└── ProtectedRoute.tsx (route guard)

lib/
├── api.ts (API calls & token management)
├── auth-context.tsx (React Context)
├── validators.ts (form validation)
├── hooks.ts (custom React hooks)
└── COOKIE_UTILS.md (cookie documentation)
```

## Getting Started

### Installation

```bash
npm install
# or
yarn install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

The system expects these endpoints on your backend:

### POST `/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "username": "username",
      "email": "user@example.com"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### POST `/auth/register`
```json
{
  "username": "foodlover",
  "email": "user@example.com",
  "password": "password123"
}
```

### POST `/auth/forgot-password`
```json
{
  "email": "user@example.com"
}
```

### POST `/auth/reset-password`
```json
{
  "token": "reset-token-from-email",
  "password": "newpassword123"
}
```

## Usage Examples

### Using Auth in Components

```tsx
'use client';

import { useAuth } from '@/lib/auth-context';

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.username}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Using Hooks

```tsx
import { useUser, useRequireAuth, useAuthNavigation } from '@/lib/hooks';

export function ProtectedPage() {
  const user = useUser();
  const { isAuthenticated, isLoading } = useRequireAuth('/login');
  const { logoutAndNavigate } = useAuthNavigation();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div>
      <h1>Hello, {user?.username}</h1>
      <button onClick={() => logoutAndNavigate()}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```tsx
import { authenticatedFetch } from '@/lib/api';

async function getOrders() {
  const response = await authenticatedFetch(
    'http://localhost:3001/api/orders',
    { method: 'GET' }
  );
  return response.json();
}
```

## Form Validation

### Validation Functions

```tsx
import { 
  validateEmail, 
  validatePassword, 
  validateUsername,
  validateConfirmPassword,
  validateLoginForm,
  validateRegisterForm
} from '@/lib/validators';

// Validate individual fields
const emailError = validateEmail('invalid-email');
const passwordError = validatePassword('short');
const usernameError = validateUsername('ab'); // min 3 chars

// Validate entire forms
const loginErrors = validateLoginForm({
  email: 'test@example.com',
  password: 'password123'
});
```

### Validation Rules

**Email**: Must be valid email format
**Password**: Min 8 characters
**Username**: 3-20 characters, alphanumeric + underscore/hyphen
**Confirm Password**: Must match password field

## Customization

### Change Primary Color

Edit the color in tailwind config or components. Search for `orange-500` and replace with your color:

```tsx
// In components/auth/Button.tsx
primary: 'bg-orange-500 hover:bg-orange-600 ...'
```

### Change Logo/Branding

Edit [AuthCard.tsx](components/auth/AuthCard.tsx):

```tsx
<div className="text-6xl font-bold">🍽️</div> {/* Change emoji */}
<h2 className="text-3xl font-bold">Food Market</h2> {/* Change text */}
```

### Add Social Login

In login page, add before the form:

```tsx
<div className="space-y-3 mb-6">
  <button className="w-full border py-2 rounded flex items-center justify-center gap-2">
    Google Sign In
  </button>
</div>
<div className="relative mb-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-200"></div>
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
  </div>
</div>
```

## Testing

### Test Accounts

You can use any email/password for the demo:
- Email: `test@example.com`
- Password: `password123`

The API endpoints will need to be configured to handle authentication.

### Local Testing Without Backend

For frontend-only testing, you can mock the API responses in `lib/api.ts`:

```tsx
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  // Mock response for testing
  return {
    success: true,
    data: {
      user: {
        id: '123',
        username: 'testuser',
        email: payload.email,
      },
      accessToken: 'mock-token',
    },
  };
}
```

## Security Considerations

1. **Always use HTTPS in production**
2. **Never store sensitive data in localStorage** - Consider using httpOnly cookies for tokens
3. **Validate all user inputs on the backend**
4. **Use CSRF tokens for form submissions**
5. **Implement rate limiting on auth endpoints**
6. **Use strong password requirements**
7. **Implement account lockout after failed attempts**
8. **Log authentication attempts**

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized with Next.js 16
- Code splitting for auth pages
- Lazy loading of components
- CSS animations use GPU (transform)
- No unnecessary re-renders with React Context

## Accessibility

- Semantic HTML
- ARIA labels on inputs
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast meets WCAG standards
- Error messages associated with inputs

## Contributing

To extend the system:

1. Add new auth pages in `app/(auth)/new-page/`
2. Create reusable components in `components/auth/`
3. Add validation logic to `lib/validators.ts`
4. Add API functions to `lib/api.ts`
5. Create custom hooks in `lib/hooks.ts`

## License

This project is part of the Food Market application.

## Support

For issues or questions, contact the development team or check the documentation in individual files.
