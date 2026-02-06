import type { ReactNode } from "react";

interface KpiGridProps {
  children: ReactNode;
  columns?: number;
}

export function KpiGrid({ children, columns = 4 }: KpiGridProps) {
  const gridClass = columns === 4
    ? "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
    : columns === 3
    ? "grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
    : "grid grid-cols-2 gap-3 md:gap-4";

  return <div className={gridClass}>{children}</div>;
}
