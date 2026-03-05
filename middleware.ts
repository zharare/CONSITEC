import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // 🟢 Eliminamos la verificación de sesión
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"] // sigue aplicando para rutas, pero sin bloquear
};