import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
}

export function Card({ children, title }: CardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
      {title && <h3 className="text-lg font-semibold text-zinc-100 mb-4">{title}</h3>}
      {children}
    </div>
  );
}
