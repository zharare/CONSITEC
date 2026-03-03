import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CONSITEC Commercial & Operational Panel",
  description: "Internal management dashboard for training and certification services"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
