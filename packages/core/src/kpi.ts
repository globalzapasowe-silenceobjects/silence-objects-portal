import type { KpiMetrics } from "@silence/contracts";

export function calculateARR(mrr: number): number {
  return mrr * 12;
}

export function calculateRunwayMonths(cashBalance: number, monthlyBurn: number): number {
  if (monthlyBurn <= 0) return Infinity;
  return Math.round(cashBalance / monthlyBurn);
}

export function calculateLtvCac(ltv: number, cac: number): number {
  if (cac <= 0) return Infinity;
  return Math.round((ltv / cac) * 10) / 10;
}

export function calculateNRR(startMRR: number, expansion: number, contraction: number, churn: number): number {
  if (startMRR <= 0) return 0;
  return Math.round(((startMRR + expansion - contraction - churn) / startMRR) * 100);
}

export function formatCurrency(value: number, currency: string): string {
  return `${value.toLocaleString("pl-PL")} ${currency}`;
}

export function formatPercent(value: number): string {
  return `${value}%`;
}
