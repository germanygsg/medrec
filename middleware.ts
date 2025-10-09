import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/api/auth", "/api/health"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Get client IP from headers
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ??
             request.headers.get('x-real-ip') ??
             'unknown';

  // Apply rate limiting
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // Check authentication for protected routes
  if (!isPublicRoute && pathname !== "/") {
    // Check for any better-auth session token (try multiple possible cookie names)
    const sessionToken = request.cookies.get("better-auth.session_token") ||
                        request.cookies.get("better-auth.session") ||
                        request.cookies.get("session_token");

    console.log(`Middleware: Checking auth for ${pathname}, session token: ${!!sessionToken}`);

    if (!sessionToken) {
      console.log(`Middleware: No session token found, redirecting to login`);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add security headers (additional layer beyond next.config.ts)
  const response = NextResponse.next();

  // Get the current host for CSP
  const host = request.headers.get('host') || '';
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const origin = `${protocol}://${host}`;

  // CSP header for additional security
  // Note: connect-src includes the current origin for API calls and Vercel Live
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; frame-src https://vercel.live; connect-src 'self' ${origin} https://vercel.live wss://*.pusher.com;`
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
