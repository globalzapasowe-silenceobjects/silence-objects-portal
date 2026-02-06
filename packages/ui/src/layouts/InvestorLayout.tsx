import type { ReactNode } from "react";

interface InvestorLayoutProps {
  children: ReactNode;
}

export function InvestorLayout({ children }: InvestorLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-4 py-4 md:px-8">
        <h1 className="text-lg font-bold">PatternLabs — Investor Portal</h1>
      </header>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
