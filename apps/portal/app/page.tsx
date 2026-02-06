import Link from "next/link";

const TABS = [
  { id: "investor", label: "Investor", href: "/investor/dashboard", active: true },
  { id: "patternlens", label: "PatternLens", href: "#" },
  { id: "patternslab", label: "PatternsLab", href: "#" },
  { id: "opensource", label: "Open Source", href: "#" },
  { id: "admin", label: "Admin", href: "#" },
] as const;

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">PatternLabs Portal</h1>
        <p className="text-zinc-400 mt-1">SILENCE.OBJECTS — Management Dashboard</p>
      </header>
      <nav className="flex flex-wrap gap-2 mb-8">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={tab.active
              ? "px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 font-medium text-sm"
              : "px-4 py-2 rounded-lg bg-zinc-800 text-zinc-400 text-sm hover:bg-zinc-700"
            }
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">ARR</p>
          <p className="text-2xl font-bold text-zinc-100 mt-1">104,000 PLN</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">MRR</p>
          <p className="text-2xl font-bold text-zinc-100 mt-1">8,667 PLN</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Churn</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">2.1%</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Runway</p>
          <p className="text-2xl font-bold text-zinc-100 mt-1">18 months</p>
        </div>
      </div>
    </main>
  );
}
