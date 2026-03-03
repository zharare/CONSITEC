import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isProtected = req.nextUrl.pathname.startsWith("/dashboard");
  if (!isProtected) return NextResponse.next();

  const cookie = req.cookies.get("consitec_session")?.value;
  if (!cookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
