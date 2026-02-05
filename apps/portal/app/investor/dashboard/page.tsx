const KPI_DATA = [
  { label: "ARR", value: "104,000 PLN" },
  { label: "MRR", value: "8,667 PLN" },
  { label: "DAU", value: "342" },
  { label: "Churn Rate", value: "2.1%" },
  { label: "LTV/CAC", value: "4.2x" },
  { label: "Conversion", value: "12.8%" },
  { label: "Runway", value: "18 months" },
  { label: "Net Revenue Retention", value: "108%" },
] as const;

const MRR_TREND = [
  { month: "Sep", value: 4200 },
  { month: "Oct", value: 5100 },
  { month: "Nov", value: 6300 },
  { month: "Dec", value: 7100 },
  { month: "Jan", value: 8200 },
  { month: "Feb", value: 8667 },
] as const;

export default function InvestorDashboard() {
  const maxMRR = Math.max(...MRR_TREND.map((m) => m.value));

  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Investor Dashboard</h1>
        <p className="text-zinc-400 mt-1">PatternLabs — SILENCE.OBJECTS</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        {KPI_DATA.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:p-6"
          >
            <p className="text-xs text-zinc-500 uppercase tracking-wide">{kpi.label}</p>
            <p className="text-lg md:text-2xl font-bold text-zinc-100 mt-1">{kpi.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">MRR Trend</h2>
        <div className="flex items-end gap-2 md:gap-4 h-48">
          {MRR_TREND.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-zinc-400">{m.value.toLocaleString()}</span>
              <div
                className="w-full bg-emerald-500 rounded-t-md"
                style={{ height: `${(m.value / maxMRR) * 100}%` }}
              />
              <span className="text-xs text-zinc-500">{m.month}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
