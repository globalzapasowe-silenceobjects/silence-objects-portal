import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PatternLabs Investor Portal",
  description: "Real-time metrics and KPIs for PatternLabs investors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
