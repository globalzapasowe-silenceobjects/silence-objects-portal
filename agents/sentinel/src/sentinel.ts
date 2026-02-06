import { EventBus } from "@silence/events";

interface CheckResult {
  pass: boolean;
  errors: string[];
  duration: number;
}

interface GateResult {
  pass: boolean;
  results: Record<string, CheckResult>;
  totalDuration: number;
}

/**
 * Sentinel — CI/CD guard agent.
 * Runs quality gates: build, types, lint.
 * Emits events on pass/fail for orchestrator consumption.
 */
export class Sentinel {
  private bus: EventBus;
  private agentId = "sentinel";

  constructor(bus?: EventBus) {
    this.bus = bus ?? new EventBus();
  }

  private async exec(cmd: string): Promise<{ code: number; stdout: string; stderr: string }> {
    try {
      const { execSync } = await import("child_process");
      const stdout = execSync(cmd, {
        encoding: "utf-8",
        timeout: 120_000,
        stdio: ["pipe", "pipe", "pipe"],
      });
      return { code: 0, stdout, stderr: "" };
    } catch (err: unknown) {
      const e = err as { status?: number; stdout?: string; stderr?: string };
      return {
        code: e.status ?? 1,
        stdout: e.stdout ?? "",
        stderr: e.stderr ?? "",
      };
    }
  }

  async checkBuild(): Promise<CheckResult> {
    const start = Date.now();
    const { code, stderr } = await this.exec("pnpm build");
    const errors = code !== 0 ? [stderr || "Build failed"] : [];
    return { pass: code === 0, errors, duration: Date.now() - start };
  }

  async checkTypes(): Promise<CheckResult> {
    const start = Date.now();
    const { code, stderr } = await this.exec("pnpm --filter=portal exec tsc --noEmit");
    const errors = code !== 0 ? stderr.split("\n").filter(Boolean) : [];
    return { pass: code === 0, errors, duration: Date.now() - start };
  }

  async checkLint(): Promise<CheckResult> {
    const start = Date.now();
    const { code, stderr } = await this.exec("pnpm lint");
    const errors = code !== 0 ? [stderr || "Lint failed"] : [];
    return { pass: code === 0, errors, duration: Date.now() - start };
  }

  async runAllChecks(): Promise<GateResult> {
    const totalStart = Date.now();

    await this.bus.emit("agent.started", { agentId: this.agentId, name: "Sentinel" }, this.agentId);

    const [build, types, lint] = await Promise.all([
      this.checkBuild(),
      this.checkTypes(),
      this.checkLint(),
    ]);

    const results = { build, types, lint };
    const pass = Object.values(results).every((r) => r.pass);

    if (!pass) {
      const allErrors = Object.entries(results)
        .filter(([, r]) => !r.pass)
        .map(([name, r]) => `${name}: ${r.errors.join("; ")}`)
        .join(" | ");
      await this.bus.emit("agent.error", { agentId: this.agentId, error: allErrors }, this.agentId);
    }

    await this.bus.emit(
      "agent.stopped",
      { agentId: this.agentId, reason: pass ? "all checks passed" : "checks failed" },
      this.agentId,
    );

    return { pass, results, totalDuration: Date.now() - totalStart };
  }
}
