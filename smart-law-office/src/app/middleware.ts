import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ROLE_GATEWAYS: Record<string, string> = {
  "/admin": "ADMIN",
  "/staff": "STAFF",
  "/client": "CLIENT"
};

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const backupRole = request.cookies.get("user-role")?.value;

  // 1. If no token, bounce to /role (public access)
  if (!token) return NextResponse.next();

  try {
    // 2. Verify JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = (payload.role as string) || backupRole || "";
    const userId = payload.sub as string;

    // 3. Prevent loop: If already at their correct home, just proceed
    const correctHome =
      userRole === "ADMIN"
        ? "/admin/dashboard"
        : userRole === "STAFF"
          ? "/staff/dashboard"
          : "/client/manage-case";

    // If they are on a generic path like "/" or "/login", send to their home
    if (pathname === "/" || pathname === "/role") {
      return NextResponse.redirect(new URL(correctHome, request.url));
    }

    // 4. ROLE GUARDING
    const matchingGateway = Object.entries(ROLE_GATEWAYS).find(([path]) =>
      pathname.startsWith(path)
    );

    if (matchingGateway) {
      const [pathPrefix, requiredRole] = matchingGateway;

      if (userRole !== requiredRole) {
        console.warn(`🚫 ${userRole} tried to access ${pathPrefix}`);
        return NextResponse.redirect(new URL(correctHome, request.url));
      }
    }

    // 5. SUCCESS: Inject headers for Server Components
    const response = NextResponse.next();
    response.headers.set("x-user-id", userId);
    response.headers.set("x-user-role", userRole);
    return response;
  } catch (error) {
    console.error("JWT Verification failed:", error);
    const response = NextResponse.redirect(new URL("/role", request.url));
    response.cookies.delete("auth-token");
    return response;
  }
}

export const config = {
  matcher: [
    // Protect all admin, staff, and client routes
    "/admin/:path*",
    "/staff/:path*",
    "/client/:path*"
    // Add other specific routes that need protection
  ]
};
