import { NextResponse } from 'next/server';

export function middleware(request) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  // If trying to visit admin pages without a session → go to login
  if (pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to visit login page and a valid session exists → go to admin
  // (for now, we just check existence, but you can verify it)
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
// This middleware checks if the user is authenticated before allowing access to admin routes.