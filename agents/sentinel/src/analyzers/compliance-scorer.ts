/**
 * SILENCE SENTINEL — Compliance Scorer
 *
 * Calculates an overall compliance score from 0-100 based on guard results.
 * 100 = perfect compliance, 0 = maximum violations.
 */

export interface GuardResult {
  guard: string;
  passed: boolean;
  violations: number;
  details: string[];
}

export interface ComplianceReport {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  passed: boolean;
  results: GuardResult[];
  summary: string;
}

/**
 * Point deductions per guard type.
 */
const DEDUCTIONS: Record<string, number> = {
  terminology: 20,
  contracts: 15,
  dependency: 10,
  "closed-module": 15,
  "type-safety": 5,
  security: 25,
  build: 30,
};

/**
 * Calculate the compliance score from a set of guard results.
 */
export function calculateScore(results: GuardResult[]): ComplianceReport {
  let score = 100;

  for (const result of results) {
    const deductionPerViolation = DEDUCTIONS[result.guard] ?? 10;
    score -= result.violations * deductionPerViolation;
  }

  // Floor at 0
  score = Math.max(0, score);

  const grade = getGrade(score);
  const passed = score >= 70;

  const summary = buildSummary(score, grade, results);

  return { score, grade, passed, results, summary };
}

/**
 * Get a letter grade from the numeric score.
 */
function getGrade(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 95) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 50) return "D";
  return "F";
}

/**
 * Build a human-readable summary.
 */
function buildSummary(
  score: number,
  grade: string,
  results: GuardResult[]
): string {
  const totalViolations = results.reduce((sum, r) => sum + r.violations, 0);
  const passedGuards = results.filter((r) => r.passed).length;
  const totalGuards = results.length;

  const lines: string[] = [
    `SILENCE SENTINEL Compliance Score: ${score}/100 (Grade: ${grade})`,
    `Guards: ${passedGuards}/${totalGuards} passed`,
    `Total violations: ${totalViolations}`,
  ];

  if (score >= 95) {
    lines.push("Status: EXCELLENT — all clear");
  } else if (score >= 80) {
    lines.push("Status: GOOD — minor issues detected");
  } else if (score >= 70) {
    lines.push("Status: ACCEPTABLE — issues should be addressed");
  } else if (score >= 50) {
    lines.push("Status: WARNING — significant issues found");
  } else {
    lines.push("Status: BLOCKED — critical violations must be fixed");
  }

  return lines.join("\n");
}
