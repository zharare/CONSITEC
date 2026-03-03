import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json(await prisma.location.findMany({ orderBy: { department: "asc" } }));
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json(await prisma.location.create({ data }));
}
