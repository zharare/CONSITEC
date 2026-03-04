import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await prisma.service.deleteMany({
      where: { courseId: id }
    });

    await prisma.certificateSale.deleteMany({
      where: { courseId: id }
    });

    await prisma.course.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Course eliminado" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error eliminando" }, { status: 500 });
  }
}