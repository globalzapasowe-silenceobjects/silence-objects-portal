/**
 * SILENCE SENTINEL — Build Guard
 *
 * Verifies that the project builds successfully.
 * Runs `pnpm -r build` and reports pass/fail.
 */

import { execSync } from "node:child_process";
import type { GuardResult } from "../analyzers/compliance-scorer.js";

export interface BuildViolation {
  package: string;
  error: string;
}

/**
 * Run the build guard.
 * Executes `pnpm -r build` and captures output.
 */
export function runBuildGuard(): {
  result: GuardResult;
  violations: BuildViolation[];
} {
  const violations: BuildViolation[] = [];

  try {
    execSync("pnpm -r build", {
      encoding: "utf-8",
      maxBuffer: 50 * 1024 * 1024,
      stdio: "pipe",
      timeout: 300000, // 5 minute timeout
    });

    return {
      result: {
        guard: "build",
        passed: true,
        violations: 0,
        details: ["All packages built successfully"],
      },
      violations: [],
    };
  } catch (error: unknown) {
    const execError = error as { stderr?: string; stdout?: string; message?: string };
    const stderr = execError.stderr ?? "";
    const stdout = execError.stdout ?? "";
    const output = stderr || stdout || execError.message || "Unknown build error";

    // Try to extract which packages failed
    const failedPackages = extractFailedPackages(output);

    if (failedPackages.length > 0) {
      for (const pkg of failedPackages) {
        violations.push({
          package: pkg.name,
          error: pkg.error,
        });
      }
    } else {
      violations.push({
        package: "unknown",
        error: output.slice(0, 500),
      });
    }

    return {
      result: {
        guard: "build",
        passed: false,
        violations: violations.length,
        details: violations.map(
          (v) => `Build failed in ${v.package}: ${v.error.slice(0, 200)}`
        ),
      },
      violations,
    };
  }
}

/**
 * Extract failed package names from build output.
 */
function extractFailedPackages(
  output: string
): { name: string; error: string }[] {
  const results: { name: string; error: string }[] = [];
  const lines = output.split("\n");

  // Look for pnpm error patterns like "ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL"
  // or "@silence/package-name" build failures
  let currentPackage = "";
  const errorLines: string[] = [];

  for (const line of lines) {
    // Match pnpm package scope: e.g., "@silence/portal: ..."
    const pkgMatch = line.match(/@silence\/([^:\s]+)/);
    if (pkgMatch) {
      if (currentPackage && errorLines.length > 0) {
        results.push({
          name: currentPackage,
          error: errorLines.join("\n"),
        });
        errorLines.length = 0;
      }
      currentPackage = `@silence/${pkgMatch[1]}`;
    }

    // Collect error lines
    if (
      line.includes("error") ||
      line.includes("Error") ||
      line.includes("ERR") ||
      line.includes("FAIL") ||
      line.includes("TS")
    ) {
      errorLines.push(line.trim());
    }
  }

  // Flush last package
  if (currentPackage && errorLines.length > 0) {
    results.push({
      name: currentPackage,
      error: errorLines.join("\n"),
    });
  }

  return results;
}
