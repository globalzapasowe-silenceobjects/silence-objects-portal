const KPI = [
  { label: "ARR", value: "104,000 PLN", trend: "+23% QoQ" },
  { label: "MRR", value: "8,667 PLN", trend: "+18% MoM" },
  { label: "DAU", value: "342", trend: "+12% WoW" },
  { label: "Churn Rate", value: "2.1%", trend: "-0.3pp" },
  { label: "LTV/CAC", value: "4.2x" },
  { label: "Conversion", value: "12.8%" },
  { label: "Runway", value: "18 months" },
  { label: "NRR", value: "108%" },
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
  const max = Math.max(...MRR_TREND.map((m) => m.value));

  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <header className="mb-8">
        <a href="/" className="text-zinc-500 text-sm hover:text-zinc-300 mb-2 inline-block">&larr; Back to Portal</a>
        <h1 className="text-2xl font-bold text-zinc-100">Investor Dashboard</h1>
        <p className="text-zinc-400 mt-1">PatternLabs — SILENCE.OBJECTS B2B SaaS</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        {KPI.map((k) => (
          <div key={k.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">{k.label}</p>
            <p className="text-lg md:text-2xl font-bold text-zinc-100 mt-1">{k.value}</p>
            {"trend" in k && k.trend && <p className="text-xs text-emerald-400 mt-1">{k.trend}</p>}
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:p-6 mb-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">MRR Trend (6M)</h2>
        <div className="flex items-end gap-2 md:gap-4 h-48">
          {MRR_TREND.map((m) => {
            const pct = (m.value / max) * 100;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-zinc-400">{(m.value / 1000).toFixed(1)}k</span>
                <div className="w-full bg-emerald-500 rounded-t-md transition-all" style={{ height: pct + "%" }} />
                <span className="text-xs text-zinc-500">{m.month}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Key Metrics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">Metric</th>
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">Current</th>
                <th className="text-left text-xs text-zinc-500 uppercase py-3 px-4">Target Q2</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800/50"><td className="py-3 px-4 text-zinc-300">ARR</td><td className="py-3 px-4 text-zinc-100">104k PLN</td><td className="py-3 px-4 text-zinc-500">150k PLN</td></tr>
              <tr className="border-b border-zinc-800/50"><td className="py-3 px-4 text-zinc-300">Paying Users</td><td className="py-3 px-4 text-zinc-100">89</td><td className="py-3 px-4 text-zinc-500">150</td></tr>
              <tr className="border-b border-zinc-800/50"><td className="py-3 px-4 text-zinc-300">Free Users</td><td className="py-3 px-4 text-zinc-100">608</td><td className="py-3 px-4 text-zinc-500">1,000</td></tr>
              <tr className="border-b border-zinc-800/50"><td className="py-3 px-4 text-zinc-300">Churn</td><td className="py-3 px-4 text-emerald-400">2.1%</td><td className="py-3 px-4 text-zinc-500">&lt;3%</td></tr>
              <tr><td className="py-3 px-4 text-zinc-300">LTV/CAC</td><td className="py-3 px-4 text-zinc-100">4.2x</td><td className="py-3 px-4 text-zinc-500">&gt;3x</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
