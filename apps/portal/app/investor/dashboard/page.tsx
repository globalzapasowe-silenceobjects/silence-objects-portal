import { InvestorLayout } from '@repo/ui';
import { KpiGrid, Section, DataTable, Badge } from '@repo/ui';
import { Suspense } from 'react';

async function getKpiData() {
  // Mock data - replace with real API call
  return {
    mrr: 12500,
    arr: 104000,
    dau: 1250,
    churn: 2.1,
    pipeline: [
      { company: 'TechCorp', stage: 'Due Diligence', amount: '$2.5M', probability: 75 },
      { company: 'InnovateLabs', stage: 'Term Sheet', amount: '$1.8M', probability: 60 }
    ]
  };
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

async function DashboardContent() {
  const data = await getKpiData();

  const kpis = [
    { label: 'MRR', value: `$${(data.mrr / 1000).toFixed(1)}k`, change: '+18%', trend: 'up' as const },
    { label: 'ARR', value: `$${(data.arr / 1000).toFixed(0)}k`, change: '+24%', trend: 'up' as const },
    { label: 'DAU', value: data.dau.toLocaleString(), change: '+12%', trend: 'up' as const },
    { label: 'Churn', value: `${data.churn}%`, change: '-0.3%', trend: 'down' as const },
  ];

  const columns = [
    { key: 'company', label: 'Company' },
    { 
      key: 'stage', 
      label: 'Stage',
      render: (value: string) => (
        <Badge variant={value === 'Due Diligence' ? 'success' : 'warning'}>
          {value}
        </Badge>
      )
    },
    { key: 'amount', label: 'Amount' },
    { 
      key: 'probability', 
      label: 'Probability',
      render: (value: number) => `${value}%`
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investor Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Q1 2025 Performance Metrics</p>
      </div>

      <KpiGrid kpis={kpis} />

      <Section title="Active Pipeline">
        <DataTable columns={columns} data={data.pipeline} />
      </Section>

      <Section title="Growth Metrics">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Growth Rate</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">18.2%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer LTV</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">$4,850</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CAC Payback</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">4.2 months</p>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default function InvestorDashboard() {
  return (
    <InvestorLayout>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </InvestorLayout>
  );
}
