import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { id: "admin001", username: "admin", password: "admin123", role: "ADMIN" }
  });

  const names = ["FIORELLA", "INGRIT", "VALERIA", "CRISTHIAN", "ABIGAIL", "NEW ADVISOR"];
  for (const name of names) {
    await prisma.salesperson.upsert({ where: { name }, update: {}, create: { name } });
  }

  for (const name of ["Ing. Salazar", "Ing. Rojas", "Dra. Torres"]) {
    await prisma.instructor.upsert({ where: { name }, update: {}, create: { name } });
  }

  for (const name of ["ISO 9001", "ISO 45001", "SST Induction", "First Aid"]) {
    await prisma.course.upsert({ where: { name }, update: {}, create: { name } });
  }

  const locations = [
    { department: "Lima", district: "San Isidro" },
    { department: "Lima", district: "Miraflores" },
    { department: "Arequipa", district: "Cayma" }
  ];

  for (const location of locations) {
    await prisma.location.upsert({
      where: { department_district: location },
      update: {},
      create: location
    });
  }
}

main().finally(() => prisma.$disconnect());