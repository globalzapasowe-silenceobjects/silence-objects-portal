import type { ReactNode } from "react";

interface ConsumerLayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

export function ConsumerLayout({ children, header }: ConsumerLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {header && (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="mx-auto max-w-xl">{header}</div>
        </header>
      )}
      <main className="mx-auto max-w-xl px-4 py-6">{children}</main>
    </div>
  );
}
