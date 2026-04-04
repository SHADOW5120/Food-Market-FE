# Auth Service - Session/Cookie Management Utilities

This module provides utilities for managing authentication session and cookies in both browser and server environments.

## Usage

### Basic Cookie Operations

```typescript
import { setAuthCookie, getAuthCookie, clearAuthCookie } from '@/lib/cookie-utils';

// Set authentication cookie
setAuthCookie('my-token-value', 7 * 24 * 60 * 60); // 7 days in seconds

// Get authentication cookie
const token = getAuthCookie();

// Clear authentication cookie
clearAuthCookie();
```

### Server-Side Usage

For Next.js server components and API routes, use the server versions:

```typescript
import { setAuthCookieServer, clearAuthCookieServer } from '@/lib/cookie-utils';
import { cookies } from 'next/headers';

export async function loginAction(email: string, password: string) {
  // ... authentication logic
  
  const cookieStore = await cookies();
  setAuthCookieServer(cookieStore, token, 7 * 24 * 60 * 60);
}
```

## Configuration

Default cookie settings:
- **Name**: `authToken`
- **Path**: `/`
- **SameSite**: `Strict` (CSRF protection)
- **Secure**: `true` (HTTPS only in production)
- **HttpOnly**: `true` (JavaScript cannot access)

Override defaults:

```typescript
const options = {
  name: 'custom-token',
  path: '/',
  sameSite: 'Lax',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
};

setAuthCookie(token, expiresIn, options);
```

## Security Features

- **HTTPOnly**: Prevents XSS attacks by blocking JavaScript access
- **Secure Flag**: Only sent over HTTPS
- **SameSite**: Prevents CSRF attacks
- **Expiration**: Automatic token expiration management
