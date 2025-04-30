// middleware.ts

import { NextResponse } from 'next/server';
import { verifyJwtToken } from './lib/jwt';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // Allow access to login and register pages without a token
  if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register') {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const verified = verifyJwtToken(token);

  if (!verified) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/transfer/:path*', '/admin/:path*'], // Protected routes
};
