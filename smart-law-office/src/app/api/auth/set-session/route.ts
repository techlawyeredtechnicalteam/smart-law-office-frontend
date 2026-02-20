import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { token, role } = await request.json();

  if (!token || !role) {
    return NextResponse.json(
      { error: "Missing token or role" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ success: true });
  const maxAge = 30 * 24 * 60 * 60;

  response.cookies.set("auth-token", token, {
    httpOnly: false, // false so axios interceptor can still read it
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/"
  });

  response.cookies.set("user-role", role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/"
  });

  return response;
}
