/**
 * SILENCE SENTINEL — Dependency Guard
 *
 * Checks for unauthorized new dependencies.
 * - Detects changes to pnpm-lock.yaml
 * - Scans for new packages added to any package.json
 * - Zero new deps without explicit approval
 */

import { getChangedFiles, getDiffForPath } from "../analyzers/diff-analyzer.js";
import type { GuardResult } from "../analyzers/compliance-scorer.js";

export interface DependencyViolation {
  file: string;
  type: "new-dependency" | "lockfile-changed" | "removed-dependency";
  packageName: string;
  description: string;
}

/**
 * Run the dependency guard.
 */
export function runDependencyGuard(): {
  result: GuardResult;
  violations: DependencyViolation[];
} {
  const changedFiles = getChangedFiles();
  const violations: DependencyViolation[] = [];

  // Check if pnpm-lock.yaml changed
  const lockfileChanged = changedFiles.some(
    (f) => f.path === "pnpm-lock.yaml"
  );

  // Find all changed package.json files
  const changedPackageJsons = changedFiles.filter(
    (f) => f.path.endsWith("package.json")
  );

  if (!lockfileChanged && changedPackageJsons.length === 0) {
    return {
      result: {
        guard: "dependency",
        passed: true,
        violations: 0,
        details: ["No dependency changes detected"],
      },
      violations: [],
    };
  }

  // If lockfile changed, flag it as informational
  if (lockfileChanged) {
    violations.push({
      file: "pnpm-lock.yaml",
      type: "lockfile-changed",
      packageName: "pnpm-lock.yaml",
      description: "Lockfile was modified — verify dependency changes are intentional",
    });
  }

  // Scan each changed package.json for new dependencies
  for (const pkgFile of changedPackageJsons) {
    const diff = getDiffForPath(pkgFile.path);
    if (!diff) continue;

    const newDeps = extractNewDependencies(diff, pkgFile.path);
    violations.push(...newDeps);
  }

  const result: GuardResult = {
    guard: "dependency",
    passed: violations.length === 0,
    violations: violations.length,
    details:
      violations.length === 0
        ? ["No unauthorized dependency changes"]
        : violations.map(
            (v) => `${v.file} — ${v.type}: ${v.packageName} — ${v.description}`
          ),
  };

  return { result, violations };
}

/**
 * Extract newly added dependencies from a package.json diff.
 */
function extractNewDependencies(
  diff: string,
  filePath: string
): DependencyViolation[] {
  const violations: DependencyViolation[] = [];
  const lines = diff.split("\n");

  let inDependencyBlock = false;

  for (const line of lines) {
    // Detect if we're in a dependencies section (added lines)
    if (
      line.includes('"dependencies"') ||
      line.includes('"devDependencies"') ||
      line.includes('"peerDependencies"') ||
      line.includes('"optionalDependencies"')
    ) {
      inDependencyBlock = true;
      continue;
    }

    // End of block detection (closing brace)
    if (inDependencyBlock && line.match(/^[+-]\s*\}/)) {
      inDependencyBlock = false;
      continue;
    }

    // New dependency line: starts with + and contains "package": "version"
    if (inDependencyBlock && line.startsWith("+") && !line.startsWith("+++")) {
      const depMatch = line.match(/"([^"]+)"\s*:\s*"([^"]+)"/);
      if (depMatch) {
        const pkgName = depMatch[1];
        const pkgVersion = depMatch[2];

        // Skip workspace protocol deps (internal monorepo deps)
        if (pkgVersion.startsWith("workspace:")) {
          continue;
        }

        violations.push({
          file: filePath,
          type: "new-dependency",
          packageName: pkgName,
          description: `New dependency added: ${pkgName}@${pkgVersion} — requires approval`,
        });
      }
    }
  }

  return violations;
}
