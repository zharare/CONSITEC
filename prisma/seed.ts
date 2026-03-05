import { PrismaClient } from "@prisma/client"; // ✅ solo PrismaClient

const prisma = new PrismaClient();

async function main() {
  // Usuario admin
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", password: "admin123", role: "ADMIN" } // ✅ role como string
  });

  // Salespersons
  const names = ["FIORELLA", "INGRIT", "VALERIA", "CRISTHIAN", "ABIGAIL", "NEW ADVISOR"];
  for (const name of names) {
    await prisma.salesperson.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Instructors
  for (const name of ["Ing. Salazar", "Ing. Rojas", "Dra. Torres"]) {
    await prisma.instructor.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Courses
  for (const name of ["ISO 9001", "ISO 45001", "SST Induction", "First Aid"]) {
    await prisma.course.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Locations
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