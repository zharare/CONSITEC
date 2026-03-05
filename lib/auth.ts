export function getSession() {
  return { username: "admin", role: "ADMIN" }; // sesión siempre “activa”
}

export function encodeSession(session: any) {
  return "🤷‍♂️"; // 😂
}