import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  title?: string;
}

export function Section({ children, title }: SectionProps) {
  return (
    <section className="mb-8">
      {title && <h2 className="text-xl font-bold text-zinc-100 mb-4">{title}</h2>}
      {children}
    </section>
  );
}
