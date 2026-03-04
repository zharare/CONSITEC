import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.certificateSale.delete({ where: { id } });
    return NextResponse.json({ message: "Venta eliminada" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error eliminando la venta", error }, { status: 500 });
  }
}