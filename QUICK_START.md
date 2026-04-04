# Quick Start Guide

## Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure Overview

```
📁 food-market-fe/
├── 📁 app/
│   ├── 📁 (auth)/                    # Auth route group
│   │   ├── 📁 login/
│   │   ├── 📁 register/
│   │   ├── 📁 forgot-password/
│   │   ├── 📁 reset-password/
│   │   └── layout.tsx
│   ├── page.tsx                     # Protected home page
│   ├── layout.tsx                   # Root layout with AuthProvider
│   └── globals.css                  # Global styles & animations
│
├── 📁 components/
│   ├── 📁 auth/
│   │   ├── Input.tsx               # Reusable form input
│   │   ├── Button.tsx              # Reusable button
│   │   ├── AuthCard.tsx            # Form layout wrapper
│   │   ├── Form.tsx                # Form utilities
│   │   └── Icons.tsx               # SVG icons
│   ├── ProtectedRoute.tsx           # Route guard component
│   └── ErrorBoundary.tsx            # Error handling
│
└── 📁 lib/
    ├── api.ts                       # API calls & token management
    ├── auth-context.tsx             # React Context setup
    ├── validators.ts                # Form validation logic
    ├── hooks.ts                     # Custom React hooks
    ├── types.ts                     # TypeScript definitions
    ├── constants.ts                 # App constants
    ├── COOKIE_UTILS.md              # Cookie documentation
    └── AUTH_SYSTEM.md               # Full documentation

├── AUTH_SYSTEM.md                   # Complete auth documentation
├── QUICK_START.md                   # This file
├── .env.example                     # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── postcss.config.mjs
```

## Available Routes

| Route | Purpose | Protected |
|-------|---------|-----------|
| `/login` | User login | ❌ No |
| `/register` | New user registration | ❌ No |
| `/forgot-password` | Password recovery request | ❌ No |
| `/reset-password?token=...` | Reset password with token | ❌ No |
| `/` | Home (dashboard) | ✅ Yes |

## Key Features

### ✅ Complete Authentication
- Login, Register, Forgot Password, Reset Password
- Real-time form validation
- Password show/hide toggle
- Auto-focus on first input
- Enter key support

### ✅ Security
- Bearer token in API requests
- Secure token storage
- Protected routes with redirects
- Form validation (client & server ready)

### ✅ User Experience
- Smooth animations
- Loading states
- Error messages
- Success confirmations
- Responsive design

### ✅ Developer Experience
- TypeScript throughout
- Reusable components
- Custom hooks
- Validation utilities
- API helpers

## Common Tasks

### Add New Protected Route
```tsx
// app/protected-route/page.tsx
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';

function PageContent() {
  const { user } = useAuth();
  
  return <h1>Welcome, {user?.username}</h1>;
}

export default function Page() {
  return (
    <ProtectedRoute>
      <PageContent />
    </ProtectedRoute>
  );
}
```

### Make API Call with Auth Token
```tsx
import { authenticatedFetch } from '@/lib/api';

const data = await authenticatedFetch('/api/orders')
  .then(r => r.json());
```

### Use Auth in Component
```tsx
import { useAuth } from '@/lib/auth-context';

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return isAuthenticated ? (
    <button onClick={logout}>Logout {user?.email}</button>
  ) : (
    <a href="/login">Login</a>
  );
}
```

### Validate Form Input
```tsx
import { validateEmail, validatePassword } from '@/lib/validators';

const emailError = validateEmail(email);
const passwordError = validatePassword(password);
```

## Testing

### Test Login Flow
1. Click "Sign Up" on home page redirect
2. Fill form with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Sign Up"
4. You'll be redirected to home page

### Test Protected Route
1. Try accessing `/` without logging in
2. You'll be redirected to `/login`
3. Log in to access the page

### Test Validation
1. Try submitting login without email
2. Error message appears below input
3. Submit button stays disabled

### Test Session Persistence
1. Log in
2. Refresh the page
3. Auth state persists (localStorage)

## Customization

### Change Primary Color
Replace `orange` with your color in:
- `components/auth/Button.tsx`
- `components/auth/AuthCard.tsx`
- `app/globals.css`

### Change Logo/Text
Edit `components/auth/AuthCard.tsx`:
```tsx
<div className="text-6xl font-bold">🍽️</div>
<h2 className="text-3xl font-bold">Food Market</h2>
```

### Add Dark Mode
Edit `app/globals.css` and add dark mode styles:
```css
@media (prefers-color-scheme: dark) {
  .bg-white { @apply dark:bg-gray-900; }
}
```

## Troubleshooting

### CORS Error on API Calls
Make sure your backend allows CORS requests from `http://localhost:3000`

### Token Not Persisting
Check browser DevTools > Application > LocalStorage for `accessToken` key

### Pages Not Loading
Check:
1. Is dev server running? (`npm run dev`)
2. Is port 3000 available?
3. Check browser console for errors

### Validation Not Working
Check that validators are imported from `@/lib/validators`

## Performance Tips

- Use `ProtectedRoute` wrapper for protected pages
- Lazy load pages with `dynamic()` in Next.js
- Use `useCallback` for auth navigation hooks
- Debounce form validation with `setTimeout`

## Security Checklist

- [ ] Set `NEXT_PUBLIC_API_URL` to production API
- [ ] Ensure API uses HTTPS
- [ ] Implement rate limiting on backend
- [ ] Use CSRF tokens for forms
- [ ] Validate inputs on backend
- [ ] Implement account lockout
- [ ] Log auth attempts
- [ ] Use secure password requirements

## Next Steps

1. **Connect Backend**: Update `lib/api.ts` endpoints
2. **Add Features**: Social login, 2FA, email verification
3. **Style**: Customize colors and branding
4. **Deploy**: Build and deploy to production
5. **Monitor**: Set up auth error logging

## Support

- Check `AUTH_SYSTEM.md` for detailed documentation
- Review individual file comments for API details
- Check `lib/types.ts` for TypeScript definitions

## Built With

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **React Context** - State management

---

**Ready to build?** Start by updating `.env.local` and running `npm run dev`! 🚀
