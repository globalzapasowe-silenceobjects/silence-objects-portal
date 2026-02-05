import * as React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, subtitle, icon }: MetricCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}
