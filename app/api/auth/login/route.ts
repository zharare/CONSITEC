// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // ahora sí existe
import { serialize } from "cookie";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Usuario o contraseña incorrecta" }, { status: 401 });
  }

  const session = Buffer.from(JSON.stringify({
    username: user.username,
    role: user.role
  })).toString("base64");

  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", serialize("consitec_session", session, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 día
  }));

  return res;
}