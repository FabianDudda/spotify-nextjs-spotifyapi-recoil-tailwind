import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  // Return if static files
  if (pathname.startsWith("/_next/") || pathname.includes(".")) {
    return;
  }

  // Redirect them to index if they have a token AND want to go to /login
  if (token && pathname == "/login") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Allow the requests if at least one the following is true
  // 1) Its a request for next-auth session & provider fetching
  // 2) The token exists
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Redirect them to login if they dont have token AND are requesting a protected route
  if (!token && pathname !== "/login") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
