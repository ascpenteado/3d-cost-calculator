import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Print Cost Calculator",
  description:
    "Estimate true 3D printing costs with material, power, machine wear, risk, and markup factors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
