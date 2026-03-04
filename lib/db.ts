// lib/db.ts
import { PrismaClient } from "@prisma/client";

// Esto evita crear múltiples instancias de Prisma al hacer hot reload en desarrollo
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // opcional: para ver queries en consola
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Función auxiliar si quieres mantener la misma sintaxis que puse en el ejemplo
export const query = async (query: string, params?: any[]) => {
  return prisma.$queryRaw(query, ...(params || []));
};