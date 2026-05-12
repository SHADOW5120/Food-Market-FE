import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const requiredRoles = Object.keys(protectedRoutes).find(route =>
    pathname.startsWith(route)
  );

  if (requiredRoles && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
