import type { ReactNode } from "react";
import { DashboardLayout } from "./DashboardLayout";

const nav = [
  { label: "Dashboard", href: "/dashboard", active: true },
  { label: "Workspaces", href: "/dashboard/workspace" },
  { label: "Experiments", href: "/dashboard/experiments" },
  { label: "Compliance", href: "/dashboard/compliance" },
  { label: "Team", href: "/dashboard/team" },
];

interface B2BLayoutProps {
  children: ReactNode;
  workspaceName?: string;
  user?: {
    name: string;
    email: string;
  };
}

export function B2BLayout({ children, workspaceName, user }: B2BLayoutProps) {
  const header = workspaceName ? (
    <div className="text-sm text-slate-500 dark:text-slate-400">
      Workspace:{" "}
      <span className="font-semibold text-slate-900 dark:text-slate-50">
        {workspaceName}
      </span>
    </div>
  ) : undefined;

  return (
    <DashboardLayout navigation={nav} user={user} header={header}>
      {children}
    </DashboardLayout>
  );
}
