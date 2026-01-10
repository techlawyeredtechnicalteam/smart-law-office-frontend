import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key"
);

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/forgot-password/reset",
  "/forgot-password/success",
  "/forgot-password/verify",
  "/role",
  "/success",
  "/verify"
];

// ✅ Role-specific route definitions
const roleBasedRoutes = {
  ADMIN: [
    "/dashboard/admin",
    "/dashboard/admin/overview",
    "/dashboard/admin/cases",
    "/dashboard/admin/case-mgmt",
    "/dashboard/admin/assign-case",
    "/dashboard/admin/counsel",
    "/dashboard/admin/comms",
    "/dashboard/admin/billings",
    "/firm-profile"
  ],
  STAFF: [
    "/dashboard/staff",
    "/dashboard/staff/cases",
    "/dashboard/staff/my-cases",
    "/dashboard/staff/profile"
  ],
  CLIENT: [
    "/client",
    "/client/my-case",
    "/client/documents",
    "/client/messages",
    "/client/billing"
  ]
};

// ✅ Function to check if user has access to route
function hasAccessToRoute(pathname: string, userRole: string): boolean {
  // Allow access to general dashboard route
  if (pathname === "/dashboard") return true;

  // Check role-specific routes
  const allowedRoutes =
    roleBasedRoutes[userRole as keyof typeof roleBasedRoutes] || [];
  return allowedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

// ✅ Get default route for role
function getDefaultRouteForRole(role: string): string {
  const defaultRoutes = {
    ADMIN: "/dashboard/admin/overview",
    STAFF: "/dashboard/staff/cases",
    CLIENT: "/client/my-case"
  };
  return defaultRoutes[role as keyof typeof defaultRoutes] || "/login";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value;

  // No token = redirect to login
  if (!token) {
    console.log("❌ No token found, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify JWT token
    const { payload } = await jwtVerify(token, secret);

    const userId = payload.sub as string;
    const userRole = (payload.role as string) || "";

    console.log("✅ Middleware Verified:", { userId, userRole, pathname });

    // ✅ Check if user has access to this route
    if (!hasAccessToRoute(pathname, userRole)) {
      console.log(`🚫 Access denied: ${userRole} cannot access ${pathname}`);

      // Redirect to their default dashboard
      const defaultRoute = getDefaultRouteForRole(userRole);
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }

    // ✅ User has access - proceed
    const response = NextResponse.next();
    response.headers.set("x-user-id", userId);
    response.headers.set("x-user-role", userRole);
    return response;
  } catch (error) {
    console.error("❌ JWT verification failed:", error);
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth-token");
    return response;
  }
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
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)"
  ]
};
