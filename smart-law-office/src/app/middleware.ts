import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key'
);

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/forgot-password/reset',
  '/forgot-password/success',
  '/forgot-password/verify',
  '/role',
  '/success',
  '/verify'
];

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/admin',
  '/dashboard/admin/overview',
  '/dashboard/admin/cases',
  '/dashboard/admin/case-mgmt',
  '/dashboard/admin/assign-case',
  '/dashboard/admin/counsel',
  '/dashboard/admin/comms',
  '/dashboard/admin/billings',
  '/firm-profile'
];

// Role-based protected routes
const adminRoutes = [
  '/dashboard/admin',
  '/dashboard/admin/overview',
  '/dashboard/admin/cases',
  '/dashboard/admin/case-mgmt',
  '/dashboard/admin/assign-case',
  '/dashboard/admin/counsel',
  '/dashboard/admin/comms',
  '/dashboard/admin/billings'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Get token from cookies or Authorization header
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // If no token and trying to access protected route, redirect to login
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If token exists, verify it
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role;
      
      // Check admin-only routes
      if (adminRoutes.some(route => pathname.startsWith(route))) {
        if (userRole !== 'ADMIN') {
          // Redirect non-admin users to appropriate dashboard or home
          const redirectUrl = userRole === 'COUNSEL' ? '/dashboard/counsel' : 
                            userRole === 'CLIENT' ? '/dashboard/client' : '/';
          return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
      }
      
      // Add user info to headers for downstream use
      const response = NextResponse.next();
      response.headers.set('x-user-id', payload.id as string);
      response.headers.set('x-user-role', userRole as string);
      response.headers.set('x-user-email', payload.email as string);
      
      return response;
      
    } catch (error) {
      console.error('JWT verification failed:', error);
      
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }
  
  // Allow access to non-protected routes
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
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};