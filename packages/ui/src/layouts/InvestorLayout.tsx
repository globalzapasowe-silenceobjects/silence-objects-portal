import type { ReactNode } from "react";
import { DashboardLayout } from "./DashboardLayout";

const nav = [
  { label: "Overview", href: "/investor/dashboard", active: true },
  { label: "Metrics", href: "/investor/metrics" },
  { label: "Pipeline", href: "/investor/pipeline" },
  { label: "Documents", href: "/investor/documents" },
];

interface InvestorLayoutProps {
  children: ReactNode;
  user?: {
    name: string;
    email: string;
  };
}

export function InvestorLayout({ children, user }: InvestorLayoutProps) {
  return <DashboardLayout navigation={nav} user={user}>{children}</DashboardLayout>;
}
