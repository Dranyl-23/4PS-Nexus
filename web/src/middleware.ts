import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add all the admin routes that need protection
const adminRoutes = [
  '/admin',
  '/beneficiaries',
  '/claims',
  '/disbursements',
  '/merchants',
  '/audit',
  '/reports',
  '/analytics',
  '/settings'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path matches any of the admin routes
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAdminRoute) {
    // Check for the admin auth cookie
    const hasAdminAuth = request.cookies.get('4ps_admin_auth')?.value === 'true';

    if (!hasAdminAuth) {
      // Redirect to admin login if not authenticated
      const loginUrl = new URL('/admin-login', request.url);
      return NextResponse.redirect(loginUrl);
    }
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
