import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const ROLE_GATEWAYS: Record<string, string> = {
//   "/admin": "ADMIN",
//   "/staff": "STAFF",
//   "/client": "CLIENT"
// };

// const JWT_SECRET = new TextEncoder().encode(
//   process.env.JWT_SECRET || "your-secret-key"
// );

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const userRole = request.cookies.get("user-role")?.value;

  // 1. If no token, bounce to /role
  // if (!token) return NextResponse.next();

  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/client");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/role", request.url));
  }

  // Redirect logic for logged-in users hitting "/" or "/role"
  if (token && (pathname === "/" || pathname === "/role")) {
    const home =
      userRole === "ADMIN" ? "/admin/dashboard" : "/client/manage-case";
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*", "/client/:path*", "/", "/role"]
};
