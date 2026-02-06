import type { ReactNode } from "react";

interface ConsumerLayoutProps {
  children: ReactNode;
}

export function ConsumerLayout({ children }: ConsumerLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="p-4 md:p-8 max-w-2xl mx-auto">{children}</main>
    </div>
  );
}
