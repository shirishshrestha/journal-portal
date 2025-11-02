import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("auth-token")?.value;
  const url = request.nextUrl.clone();
  const publicPaths = ["/login", "/register", "/unauthorized", "/choose-role"];

  // No token: redirect to login
  if (!token && !publicPaths.includes(url.pathname)) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from /login or /register
  if (token && ["/login", "/register"].includes(url.pathname)) {
    try {
      // Decode JWT (without verification)
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const payload = parts[1];
      const decodedPayload = Buffer.from(payload, "base64url").toString(
        "utf-8"
      );
      const decoded = JSON.parse(decodedPayload);

      const roles = decoded?.roles || [];

      // ✅ If user has multiple roles → go to /choose-role
      if (roles.length > 1) {
        url.pathname = "/choose-role";
        return NextResponse.redirect(url);
      }

      // 🧭 Role-based redirect map
      const rolePathMap = {
        READER: "/reader/dashboard",
        AUTHOR: "/author/dashboard",
        REVIEWER: "/reviewer/dashboard",
        EDITOR: "/editor/dashboard",
        ADMIN: "/admin/dashboard",
      };

      const userRole = roles.find((role) => rolePathMap[role]);
      url.pathname = userRole ? rolePathMap[userRole] : "/unauthorized";

      return NextResponse.redirect(url);
    } catch (err) {
      console.error("Error decoding token:", err);
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // Unauthenticated user tries to access /unauthorized
  if (!token && url.pathname === "/unauthorized") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/reader/:path*",
    "/author/:path*",
    "/reviewer/:path*",
    "/editor/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/unauthorized",
    "/choose-role",
  ],
};
