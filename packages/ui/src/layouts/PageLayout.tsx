import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export function PageLayout({ children, title, description, actions }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {(title || actions) && (
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              {title && (
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </header>
        )}
        <main>{children}</main>
      </div>
    </div>
  );
}
