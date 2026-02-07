/**
 * SILENCE SENTINEL — Closed Module Guard
 *
 * Protects CLOSED modules from unauthorized modification.
 * Any file change inside a CLOSED module is flagged as a violation.
 */

import { getChangedFiles } from "../analyzers/diff-analyzer.js";
import {
  CLOSED_MODULES,
  PROTECTED_MODULES,
  isClosedModule,
  isProtectedModule,
} from "../policies/architecture.policy.js";
import type { GuardResult } from "../analyzers/compliance-scorer.js";

export interface ClosedModuleViolation {
  file: string;
  module: string;
  level: "closed" | "protected";
  description: string;
}

/**
 * Run the closed module guard.
 * Checks if any CLOSED or PROTECTED modules were modified.
 */
export function runClosedModuleGuard(): {
  result: GuardResult;
  violations: ClosedModuleViolation[];
} {
  const changedFiles = getChangedFiles();
  const violations: ClosedModuleViolation[] = [];

  for (const file of changedFiles) {
    // Check CLOSED modules
    if (isClosedModule(file.path)) {
      const module = CLOSED_MODULES.find((mod) =>
        file.path.startsWith(mod)
      );
      violations.push({
        file: file.path,
        module: module ?? "unknown",
        level: "closed",
        description: `CLOSED module "${module}" was modified — requires OWNER approval`,
      });
    }

    // Check PROTECTED modules (warning-level, not blocking)
    if (isProtectedModule(file.path)) {
      const module = PROTECTED_MODULES.find((mod) =>
        file.path.startsWith(mod)
      );
      violations.push({
        file: file.path,
        module: module ?? "unknown",
        level: "protected",
        description: `PROTECTED module "${module}" was modified — requires review`,
      });
    }
  }

  // Only CLOSED violations are blocking; PROTECTED are warnings
  const closedViolations = violations.filter((v) => v.level === "closed");
  const protectedWarnings = violations.filter((v) => v.level === "protected");

  const details: string[] = [];
  if (closedViolations.length > 0) {
    details.push(
      `BLOCKED: ${closedViolations.length} file(s) in CLOSED modules were modified`
    );
    for (const v of closedViolations) {
      details.push(`  ${v.file} — ${v.description}`);
    }
  }
  if (protectedWarnings.length > 0) {
    details.push(
      `WARNING: ${protectedWarnings.length} file(s) in PROTECTED modules were modified`
    );
    for (const v of protectedWarnings) {
      details.push(`  ${v.file} — ${v.description}`);
    }
  }
  if (violations.length === 0) {
    details.push("No CLOSED or PROTECTED module changes detected");
  }

  const result: GuardResult = {
    guard: "closed-module",
    passed: closedViolations.length === 0,
    violations: closedViolations.length,
    details,
  };

  return { result, violations };
}
