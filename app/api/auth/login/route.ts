// /app/api/login/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db"; // tu función para hacer consultas SQL
import { serialize } from "cookie";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const result = await query(
    'SELECT * FROM "User" WHERE username=$1 AND password=$2',
    [username, password]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Usuario o contraseña incorrecta" }, { status: 401 });
  }

  // Crear cookie en base64 con datos de sesión
  const session = Buffer.from(JSON.stringify({
    username: result.rows[0].username,
    role: result.rows[0].role
  })).toString("base64");

  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", serialize("consitec_session", session, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 día
  }));

  return res;
}