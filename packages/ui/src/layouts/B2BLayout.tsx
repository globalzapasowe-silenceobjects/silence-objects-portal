import type { ReactNode } from "react";

interface B2BLayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

export function B2BLayout({ children, header }: B2BLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {header && <header className="border-b border-zinc-800 px-4 py-4 md:px-8">{header}</header>}
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
