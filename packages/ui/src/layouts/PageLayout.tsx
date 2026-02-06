import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

export function PageLayout({ children, header }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {header && <header className="border-b border-zinc-800 px-4 py-3 md:px-8">{header}</header>}
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
