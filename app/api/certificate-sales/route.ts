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
  const created = await prisma.certificateSale.create({
    data: { ...body, saleDate: new Date(body.saleDate) }
  });
  return NextResponse.json(created, { status: 201 });
}
