/**
 * SILENCE SENTINEL — Type Safety Guard
 *
 * Scans added lines for type-safety violations:
 * - `any` type usage
 * - `unknown` type usage (flagged as warning)
 * - @ts-ignore / @ts-nocheck / @ts-expect-error directives
 * - Type assertions with `as any`
 */

import { getAddedLines } from "../analyzers/diff-analyzer.js";
import type { GuardResult } from "../analyzers/compliance-scorer.js";

export interface TypeSafetyViolation {
  file: string;
  lineNumber: number;
  line: string;
  type: "any" | "unknown" | "ts-ignore" | "ts-nocheck" | "ts-expect-error" | "as-any";
  description: string;
}

/**
 * Run the type safety guard.
 */
export function runTypeSafetyGuard(): {
  result: GuardResult;
  violations: TypeSafetyViolation[];
} {
  const addedLines = getAddedLines();
  const violations: TypeSafetyViolation[] = [];

  for (const diffLine of addedLines) {
    // Only check TypeScript files
    if (!/\.(ts|tsx)$/.test(diffLine.file)) continue;

    // Skip sentinel's own policy files and test files
    if (/sentinel.*policy/i.test(diffLine.file)) continue;
    if (/\.test\.(ts|tsx)$/.test(diffLine.file)) continue;
    if (/\.spec\.(ts|tsx)$/.test(diffLine.file)) continue;

    const content = diffLine.content;

    // Check for @ts-ignore
    if (/@ts-ignore/.test(content)) {
      violations.push({
        file: diffLine.file,
        lineNumber: diffLine.lineNumber,
        line: content.trim(),
        type: "ts-ignore",
        description: "@ts-ignore suppresses type checking — fix the type error instead",
      });
    }

    // Check for @ts-nocheck
    if (/@ts-nocheck/.test(content)) {
      violations.push({
        file: diffLine.file,
        lineNumber: diffLine.lineNumber,
        line: content.trim(),
        type: "ts-nocheck",
        description: "@ts-nocheck disables type checking for the entire file",
      });
    }

    // Check for @ts-expect-error
    if (/@ts-expect-error/.test(content)) {
      violations.push({
        file: diffLine.file,
        lineNumber: diffLine.lineNumber,
        line: content.trim(),
        type: "ts-expect-error",
        description: "@ts-expect-error suppresses type errors — fix the underlying issue",
      });
    }

    // Check for `as any` type assertions
    if (/\bas\s+any\b/.test(content)) {
      violations.push({
        file: diffLine.file,
        lineNumber: diffLine.lineNumber,
        line: content.trim(),
        type: "as-any",
        description: "`as any` bypasses type safety — use proper typing",
      });
    }

    // Check for `: any` type annotations (but not in comments)
    if (!isComment(content) && /:\s*any\b/.test(content)) {
      // Avoid duplicate with `as any`
      if (!/\bas\s+any\b/.test(content)) {
        violations.push({
          file: diffLine.file,
          lineNumber: diffLine.lineNumber,
          line: content.trim(),
          type: "any",
          description: "Explicit `any` type — use a specific type instead",
        });
      }
    }

    // Check for `<any>` type assertions (legacy style)
    if (/<any>/.test(content) && !isComment(content)) {
      violations.push({
        file: diffLine.file,
        lineNumber: diffLine.lineNumber,
        line: content.trim(),
        type: "any",
        description: "Legacy `<any>` type assertion — use proper typing",
      });
    }

    // Check for `: unknown` (warning-level, not blocking)
    if (!isComment(content) && /:\s*unknown\b/.test(content)) {
      violations.push({
        file: diffLine.file,
        lineNumber: diffLine.lineNumber,
        line: content.trim(),
        type: "unknown",
        description: "`unknown` type — consider using a more specific type",
      });
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  const uniqueViolations = violations.filter((v) => {
    const key = `${v.file}:${v.lineNumber}:${v.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const result: GuardResult = {
    guard: "type-safety",
    passed: uniqueViolations.length === 0,
    violations: uniqueViolations.length,
    details:
      uniqueViolations.length === 0
        ? ["No type-safety violations detected"]
        : uniqueViolations.map(
            (v) => `${v.file}:${v.lineNumber} — ${v.type}: ${v.description}`
          ),
  };

  return { result, violations: uniqueViolations };
}

/**
 * Basic check if a line is a comment.
 */
function isComment(line: string): boolean {
  const trimmed = line.trim();
  return (
    trimmed.startsWith("//") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("*/")
  );
}
