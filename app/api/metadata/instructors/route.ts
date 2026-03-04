import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const instructors = await prisma.instructor.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(instructors);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newInstructor = await prisma.instructor.create({ data });
  return NextResponse.json(newInstructor);
}