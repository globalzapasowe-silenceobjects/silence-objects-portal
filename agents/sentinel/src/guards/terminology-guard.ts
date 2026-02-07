/**
 * SILENCE SENTINEL — Terminology Guard
 *
 * Scans added lines from git diff against the forbidden vocabulary list.
 * Case-insensitive matching. Returns violations with file, line, word, and suggestion.
 */

import { getAddedLines } from "../analyzers/diff-analyzer.js";
import {
  FORBIDDEN_TERMS,
  TERMINOLOGY_EXCLUSIONS,
  getSuggestion,
} from "../policies/terminology.policy.js";
import type { GuardResult } from "../analyzers/compliance-scorer.js";

export interface TerminologyViolation {
  file: string;
  lineNumber: number;
  line: string;
  word: string;
  suggestion: string;
  language: string;
  category: string;
}

/**
 * Run the terminology guard.
 * Scans only ADDED lines from the diff to avoid false positives on existing code.
 */
export function runTerminologyGuard(): {
  result: GuardResult;
  violations: TerminologyViolation[];
} {
  const addedLines = getAddedLines();
  const violations: TerminologyViolation[] = [];

  // Sort terms by length descending so multi-word phrases match before single words
  const sortedTerms = [...FORBIDDEN_TERMS].sort(
    (a, b) => b.term.length - a.term.length
  );

  for (const diffLine of addedLines) {
    // Skip excluded files
    if (TERMINOLOGY_EXCLUSIONS.some((pattern) => pattern.test(diffLine.file))) {
      continue;
    }

    // Skip binary files
    if (/\.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i.test(diffLine.file)) {
      continue;
    }

    const contentLower = diffLine.content.toLowerCase();

    for (const term of sortedTerms) {
      const termLower = term.term.toLowerCase();

      // Use word boundary matching to avoid partial matches inside other words
      // For multi-word terms, match the exact phrase
      const escapedTerm = termLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escapedTerm}\\b`, "i");

      if (regex.test(contentLower)) {
        // Skip if the line is a comment defining/referencing the forbidden term in sentinel context
        if (isExcludedContext(diffLine.content, termLower)) {
          continue;
        }

        violations.push({
          file: diffLine.file,
          lineNumber: diffLine.lineNumber,
          line: diffLine.content.trim(),
          word: term.term,
          suggestion: term.suggestion,
          language: term.language,
          category: term.category,
        });
      }
    }
  }

  // Deduplicate — same file+line+word should appear only once
  const seen = new Set<string>();
  const uniqueViolations = violations.filter((v) => {
    const key = `${v.file}:${v.lineNumber}:${v.word}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const result: GuardResult = {
    guard: "terminology",
    passed: uniqueViolations.length === 0,
    violations: uniqueViolations.length,
    details: uniqueViolations.map(
      (v) =>
        `${v.file}:${v.lineNumber} — forbidden "${v.word}" (${v.language}) -> use "${v.suggestion}"`
    ),
  };

  return { result, violations: uniqueViolations };
}

/**
 * Check if the line context excludes it from being a violation.
 * E.g., lines that are defining forbidden terms, or sentinel exclusion patterns.
 */
function isExcludedContext(content: string, _term: string): boolean {
  const line = content.trim();

  // Skip lines that are defining the forbidden terms list itself
  if (line.includes("FORBIDDEN_TERMS") || line.includes("getForbiddenTerm")) {
    return true;
  }

  // Skip lines that are sentinel configuration / policy references
  if (line.includes("@silence/sentinel") || line.includes("// sentinel-ignore")) {
    return true;
  }

  // Skip import statements
  if (line.startsWith("import ") || line.startsWith("from ")) {
    return true;
  }

  return false;
}
