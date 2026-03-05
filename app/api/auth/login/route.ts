// route.ts simplificado, login siempre exitoso
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json({ success: true });
}