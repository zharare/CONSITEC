import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const salespeople = await prisma.salesperson.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(salespeople);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newSalesperson = await prisma.salesperson.create({ data });
  return NextResponse.json(newSalesperson);
}