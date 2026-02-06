import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  toolbar?: ReactNode;
}

export function DashboardLayout({ children, sidebar, toolbar }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {sidebar && <aside className="hidden md:block w-64 border-r border-zinc-800 p-4">{sidebar}</aside>}
      <div className="flex-1 flex flex-col">
        {toolbar && <div className="border-b border-zinc-800 px-4 py-2">{toolbar}</div>}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
      {sidebar && <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-2">{sidebar}</nav>}
    </div>
  );
}
