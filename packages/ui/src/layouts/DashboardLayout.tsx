import type { ReactNode } from "react";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navigation: NavItem[];
  header?: ReactNode;
  user?: {
    name: string;
    email: string;
  };
}

export function DashboardLayout({ children, navigation, header, user }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-50 dark:border-slate-800 md:flex">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-lg font-semibold tracking-tight">PatternLens</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-2">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                item.active
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-50",
              ].join(" ")}
            >
              {item.label}
            </a>
          ))}
        </nav>
        {user && (
          <div className="border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
            <div className="font-medium text-slate-100">{user.name}</div>
            <div>{user.email}</div>
          </div>
        )}
      </aside>

      {/* Mobile top bar */}
      <header className="flex w-full items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:hidden">
        <span className="text-base font-semibold">PatternLens</span>
        {/* Tu możesz kiedyś dodać mobile menu button */}
      </header>

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col">
        {header && (
          <div className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {header}
          </div>
        )}
        <main className="flex-1 bg-slate-50 px-4 py-6 dark:bg-slate-950">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
