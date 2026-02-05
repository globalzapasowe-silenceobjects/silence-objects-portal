import * as React from 'react';

interface Kpi {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface KpiGridProps {
  kpis: Kpi[];
}

export function KpiGrid({ kpis }: KpiGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.label}</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{kpi.value}</div>
          {kpi.change && (
            <div className={`mt-2 flex items-center text-sm ${
              kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {kpi.trend === 'up' && '↑'}
              {kpi.trend === 'down' && '↓'}
              {kpi.change}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
