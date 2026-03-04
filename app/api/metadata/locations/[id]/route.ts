import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await prisma.location.delete({ where: { id } });
    return NextResponse.json({ message: "Location eliminada" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error eliminando location", error }, { status: 500 });
  }
}