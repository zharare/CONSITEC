import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json(await prisma.salesperson.findMany({ orderBy: { name: "asc" } }));
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json(await prisma.salesperson.create({ data }));
}
