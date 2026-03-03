import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encodeSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("consitec_session", encodeSession({ username: user.username, role: user.role }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
  return res;
}
