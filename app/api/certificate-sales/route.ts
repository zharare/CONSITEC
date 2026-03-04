import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CertificateSalePayload } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const sales = await prisma.certificateSale.findMany({
    where: { saleDate: { gte: start, lt: end } },
    include: { course: true, salesperson: true },
    orderBy: { saleDate: "desc" }
  });

  return NextResponse.json(sales);
}

export async function POST(req: Request) {
  const body = (await req.json()) as CertificateSalePayload;

  // Crear la venta de certificado
  const createdSale = await prisma.certificateSale.create({
    data: { ...body, saleDate: new Date(body.saleDate) }
  });

  // Si el monto es >= 900, crear también en services
  if (Number(body.amount) >= 900) {
    try {
      await prisma.service.create({
        data: {
          company: body.customerName,
          amount: Number(body.amount),
          serviceDate: new Date(body.saleDate),
          certificatesOnly: true,
          status: "SCHEDULED",
          courseId: body.courseId ?? "",
          salespersonId: body.salespersonId ?? "",
          locationId: "",
          instructorId: ""
        }
      });
    } catch (err) {
      console.error("Error creando service desde certificate sale:", err);
    }
  }

  return NextResponse.json(createdSale, { status: 201 });
}