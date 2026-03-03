"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="card" style={{ maxWidth: 420, width: "100%" }}>
        <h1>CONSITEC Login</h1>
        <p>Internal commercial and operations panel.</p>
        <form onSubmit={onSubmit} className="grid">
          <input className="input" name="username" placeholder="Username" required />
          <input className="input" name="password" type="password" placeholder="Password" required />
          <button className="btn" disabled={loading}>{loading ? "Accessing..." : "Login"}</button>
          {error && <small style={{ color: "#b91c1c" }}>{error}</small>}
        </form>
      </div>
    </div>
  );
}
