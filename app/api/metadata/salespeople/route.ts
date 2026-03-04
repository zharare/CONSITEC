import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const salespeople = await prisma.salesperson.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(salespeople);
  } catch (error) {
    console.error("Error obteniendo vendedores:", error);
    return NextResponse.json(
      { error: "Error obteniendo vendedores" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const newSalesperson = await prisma.salesperson.create({
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(newSalesperson, { status: 201 });
  } catch (error) {
    console.error("Error creando vendedor:", error);
    return NextResponse.json(
      { error: "Error creando vendedor" },
      { status: 500 }
    );
  }
}