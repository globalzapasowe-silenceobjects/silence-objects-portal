interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  target?: string;
}

export function MetricCard({ label, value, trend, target }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
      <p className="text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
      <p className="text-lg md:text-2xl font-bold text-zinc-100 mt-1">{value}</p>
      {trend && <p className="text-xs text-emerald-400 mt-1">{trend}</p>}
      {target && <p className="text-xs text-zinc-500 mt-1">Target: {target}</p>}
    </div>
  );
}
