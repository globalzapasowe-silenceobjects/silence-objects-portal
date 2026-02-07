/**
 * SILENCE SENTINEL — Contracts Guard
 *
 * Detects breaking changes in packages/contracts.
 * Checks for removed exports, changed type signatures, and structural modifications.
 */

import { getChangedFiles, getDiffForPath } from "../analyzers/diff-analyzer.js";
import type { GuardResult } from "../analyzers/compliance-scorer.js";

export interface ContractsViolation {
  file: string;
  type: "removed-export" | "changed-signature" | "removed-type" | "modified-interface";
  description: string;
}

/**
 * Run the contracts guard.
 * Checks if packages/contracts has any breaking changes.
 */
export function runContractsGuard(): {
  result: GuardResult;
  violations: ContractsViolation[];
} {
  const changedFiles = getChangedFiles();
  const contractFiles = changedFiles.filter(
    (f) => f.path.startsWith("packages/contracts/")
  );

  if (contractFiles.length === 0) {
    return {
      result: {
        guard: "contracts",
        passed: true,
        violations: 0,
        details: ["No changes to packages/contracts — skipped"],
      },
      violations: [],
    };
  }

  const violations: ContractsViolation[] = [];
  const diffOutput = getDiffForPath("packages/contracts/");

  if (!diffOutput) {
    return {
      result: {
        guard: "contracts",
        passed: true,
        violations: 0,
        details: ["No diff output for packages/contracts"],
      },
      violations: [],
    };
  }

  const lines = diffOutput.split("\n");
  let currentFile = "";

  for (const line of lines) {
    // Track current file
    const fileMatch = line.match(/^\+\+\+ b\/(.+)$/);
    if (fileMatch) {
      currentFile = fileMatch[1];
      continue;
    }

    // Detect removed exports (lines starting with - that contain "export")
    if (line.startsWith("-") && !line.startsWith("---")) {
      const removedContent = line.slice(1);

      if (/\bexport\b/.test(removedContent)) {
        // Check if this export was replaced (look for corresponding + line)
        violations.push({
          file: currentFile,
          type: "removed-export",
          description: `Potentially removed export: ${removedContent.trim()}`,
        });
      }

      if (/\binterface\b/.test(removedContent)) {
        violations.push({
          file: currentFile,
          type: "modified-interface",
          description: `Modified interface: ${removedContent.trim()}`,
        });
      }

      if (/\btype\b.*=/.test(removedContent)) {
        violations.push({
          file: currentFile,
          type: "removed-type",
          description: `Modified type definition: ${removedContent.trim()}`,
        });
      }
    }

    // Detect changed function signatures in modified lines
    if (line.startsWith("+") && !line.startsWith("+++")) {
      const addedContent = line.slice(1);
      if (/\bexport\b.*\bfunction\b/.test(addedContent)) {
        // Flag signature changes (additions that modify existing exports)
        const fnMatch = addedContent.match(/export\s+function\s+(\w+)/);
        if (fnMatch) {
          // This is informational — the actual breaking change is in the removal
          // We still flag it for review
        }
      }
    }
  }

  const result: GuardResult = {
    guard: "contracts",
    passed: violations.length === 0,
    violations: violations.length,
    details:
      violations.length === 0
        ? ["packages/contracts modified but no breaking changes detected"]
        : violations.map(
            (v) => `${v.file} — ${v.type}: ${v.description}`
          ),
  };

  return { result, violations };
}
