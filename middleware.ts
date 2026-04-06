import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7225/api';

// Define protected routes and their required roles
const protectedRoutes: Record<string, string[]> = {
  '/cart': ['user', 'seller', 'admin'],
  '/profile': ['user', 'seller', 'admin'],
  '/orders': ['user', 'seller', 'admin'],
  '/favorites': ['user', 'seller', 'admin'],
  '/seller': ['seller', 'admin'],
  '/checkout': ['user', 'seller', 'admin'],
};

const publicRoutes = ['/', '/products', '/login', '/register', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if route is protected
  const requiredRoles = Object.keys(protectedRoutes).find(route =>
    pathname.startsWith(route)
  );

  if (requiredRoles) {
    if (!token) {
      // Redirect to login with intended route
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // For client-side role checking, we can't verify roles server-side
    // without making an API call, which would slow down requests.
    // Role checking is handled client-side in ProtectedRoute component.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};