/**
 * SILENCE SENTINEL — Entry Point / CLI
 *
 * Usage:
 *   tsx src/index.ts <command>
 *
 * Commands:
 *   terminology    Run terminology guard
 *   contracts      Run contracts guard
 *   dependency     Run dependency guard
 *   closed-module  Run closed module guard
 *   type-safety    Run type safety guard
 *   security       Run security guard
 *   build          Run build guard
 *   report         Run all guards and generate full report
 *   all            Run all guards (same as report)
 */

import { getConfig } from "./config.js";
import { runTerminologyGuard } from "./guards/terminology-guard.js";
import { runContractsGuard } from "./guards/contracts-guard.js";
import { runDependencyGuard } from "./guards/dependency-guard.js";
import { runClosedModuleGuard } from "./guards/closed-module-guard.js";
import { runTypeSafetyGuard } from "./guards/type-safety-guard.js";
import { runSecurityGuard } from "./guards/security-guard.js";
import { runBuildGuard } from "./guards/build-guard.js";
import { calculateScore } from "./analyzers/compliance-scorer.js";
import type { GuardResult } from "./analyzers/compliance-scorer.js";
import {
  formatGuardResult,
  generateConsoleReport,
  generateMarkdownReport,
} from "./reporters/github-reporter.js";

const COMMANDS = [
  "terminology",
  "contracts",
  "dependency",
  "closed-module",
  "type-safety",
  "security",
  "build",
  "report",
  "all",
] as const;

type Command = (typeof COMMANDS)[number];

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0] as Command | undefined;

  if (!command || !COMMANDS.includes(command)) {
    printUsage();
    process.exit(1);
  }

  const config = getConfig();

  if (command === "report" || command === "all") {
    runAll(config);
  } else {
    runSingleGuard(command);
  }
}

/**
 * Run a single guard and print results.
 */
function runSingleGuard(command: Command): void {
  console.log(`\nSILENCE SENTINEL — Running ${command} guard...\n`);

  let result: GuardResult;

  switch (command) {
    case "terminology": {
      const { result: r } = runTerminologyGuard();
      result = r;
      break;
    }
    case "contracts": {
      const { result: r } = runContractsGuard();
      result = r;
      break;
    }
    case "dependency": {
      const { result: r } = runDependencyGuard();
      result = r;
      break;
    }
    case "closed-module": {
      const { result: r } = runClosedModuleGuard();
      result = r;
      break;
    }
    case "type-safety": {
      const { result: r } = runTypeSafetyGuard();
      result = r;
      break;
    }
    case "security": {
      const { result: r } = runSecurityGuard();
      result = r;
      break;
    }
    case "build": {
      const { result: r } = runBuildGuard();
      result = r;
      break;
    }
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }

  console.log(formatGuardResult(result));

  if (!result.passed) {
    process.exit(1);
  }
}

/**
 * Run all guards and generate a full compliance report.
 */
function runAll(config: ReturnType<typeof getConfig>): void {
  console.log("\nSILENCE SENTINEL — Running all guards...\n");

  const results: GuardResult[] = [];

  // Terminology Guard
  if (config.guards.terminology) {
    console.log("  Running terminology guard...");
    const { result } = runTerminologyGuard();
    results.push(result);
  }

  // Contracts Guard
  if (config.guards.contracts) {
    console.log("  Running contracts guard...");
    const { result } = runContractsGuard();
    results.push(result);
  }

  // Dependency Guard
  if (config.guards.dependency) {
    console.log("  Running dependency guard...");
    const { result } = runDependencyGuard();
    results.push(result);
  }

  // Closed Module Guard
  if (config.guards.closedModule) {
    console.log("  Running closed-module guard...");
    const { result } = runClosedModuleGuard();
    results.push(result);
  }

  // Type Safety Guard
  if (config.guards.typeSafety) {
    console.log("  Running type-safety guard...");
    const { result } = runTypeSafetyGuard();
    results.push(result);
  }

  // Security Guard
  if (config.guards.security) {
    console.log("  Running security guard...");
    const { result } = runSecurityGuard();
    results.push(result);
  }

  // Build Guard (disabled by default)
  if (config.guards.build) {
    console.log("  Running build guard...");
    const { result } = runBuildGuard();
    results.push(result);
  }

  // Calculate compliance score
  const report = calculateScore(results);

  // Console output
  if (config.output.console) {
    console.log(generateConsoleReport(report));
  }

  // Markdown output (for CI / PR comments)
  if (config.output.markdown) {
    const markdown = generateMarkdownReport(report);
    // Write to stdout with a delimiter so CI can capture it
    console.log("\n--- SENTINEL MARKDOWN REPORT ---\n");
    console.log(markdown);
    console.log("\n--- END SENTINEL MARKDOWN REPORT ---\n");
  }

  // Exit with appropriate code
  if (!report.passed && config.ci.failOnViolations) {
    process.exit(1);
  }
}

/**
 * Print usage information.
 */
function printUsage(): void {
  console.log(`
SILENCE SENTINEL — Automated Compliance Agent
==============================================

Usage: tsx src/index.ts <command>

Commands:
  terminology    Scan for forbidden vocabulary in added code
  contracts      Detect breaking changes in packages/contracts
  dependency     Check for unauthorized new dependencies
  closed-module  Verify no CLOSED modules were modified
  type-safety    Scan for any/unknown/@ts-ignore usage
  security       Detect leaked secrets and API keys
  build          Verify all packages build successfully
  report         Run all guards and generate full report
  all            Same as report

Examples:
  pnpm terminology-check
  pnpm security-check
  pnpm check-all
`);
}

// Run
main();
