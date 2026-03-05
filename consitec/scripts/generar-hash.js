import bcrypt from "bcrypt";

async function main() {
  const password = "TuContraseña123"; // 🔑 Cambia esto por la contraseña que quieras
  const hash = await bcrypt.hash(password, 10);
  console.log("HASH GENERADO:", hash);
}

main();