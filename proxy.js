import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("auth-token");
  const url = request.nextUrl.clone();

  if (!token && url.pathname !== "/login") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (token && url.pathname === "/login") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/products/:path*", "/login"],
};
