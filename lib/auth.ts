import { cookies } from "next/headers";

export type Session = { username: string; role: "ADMIN" | "SALES" };

export function getSession(): Session | null {
  const raw = cookies().get("consitec_session")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

export function encodeSession(session: Session) {
  return Buffer.from(JSON.stringify(session)).toString("base64");
}
