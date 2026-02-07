import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PatternsLab \u2014 Institutional Pattern Analysis",
  description:
    "B2B institutional behavioral pattern analysis platform. Multi-tenant architecture with audit trails, compliance frameworks, and modular pattern recognition.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
