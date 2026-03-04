import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await prisma.instructor.delete({ where: { id } });
    return NextResponse.json({ message: "Instructor eliminado" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error eliminando instructor", error }, { status: 500 });
  }
}