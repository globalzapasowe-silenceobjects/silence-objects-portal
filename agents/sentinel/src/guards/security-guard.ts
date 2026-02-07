/**
 * SILENCE SENTINEL — Security Guard
 *
 * Scans added lines for leaked secrets, API keys, passwords, tokens,
 * and other sensitive data that should never appear in source code.
 */

import { getAddedLines } from "../analyzers/diff-analyzer.js";
import type { GuardResult } from "../analyzers/compliance-scorer.js";

export interface SecurityViolation {
  file: string;
  lineNumber: number;
  line: string;
  type: string;
  description: string;
}

/**
 * Patterns to detect various types of secrets and sensitive data.
 * Each pattern has a name and a regex.
 */
const SECRET_PATTERNS: { name: string; pattern: RegExp; description: string }[] = [
  {
    name: "Anthropic API Key",
    pattern: /sk-ant-[a-zA-Z0-9_-]{20,}/,
    description: "Anthropic API key detected",
  },
  {
    name: "Stripe Secret Key",
    pattern: /sk_live_[a-zA-Z0-9]{20,}/,
    description: "Stripe live secret key detected",
  },
  {
    name: "Stripe Test Key",
    pattern: /sk_test_[a-zA-Z0-9]{20,}/,
    description: "Stripe test secret key detected",
  },
  {
    name: "AWS Access Key",
    pattern: /AKIA[0-9A-Z]{16}/,
    description: "AWS Access Key ID detected",
  },
  {
    name: "AWS Secret Key",
    pattern: /(?:aws_secret_access_key|AWS_SECRET_ACCESS_KEY)\s*[=:]\s*["']?[A-Za-z0-9/+=]{40}/,
    description: "AWS Secret Access Key detected",
  },
  {
    name: "Generic API Key",
    pattern: /(?:api[_-]?key|apikey)\s*[=:]\s*["'][a-zA-Z0-9_\-]{20,}["']/i,
    description: "Generic API key assignment detected",
  },
  {
    name: "Generic Secret",
    pattern: /(?:secret|SECRET)\s*[=:]\s*["'][a-zA-Z0-9_\-]{20,}["']/,
    description: "Generic secret assignment detected",
  },
  {
    name: "Password in Code",
    pattern: /(?:password|passwd|pwd)\s*[=:]\s*["'][^"']{4,}["']/i,
    description: "Password hardcoded in source code",
  },
  {
    name: "Private Key",
    pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/,
    description: "Private key detected in source code",
  },
  {
    name: "GitHub Token",
    pattern: /gh[ps]_[A-Za-z0-9_]{36,}/,
    description: "GitHub personal access token detected",
  },
  {
    name: "Supabase Service Key",
    pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/,
    description: "JWT token (possibly Supabase service key) detected",
  },
  {
    name: "OpenAI API Key",
    pattern: /sk-[a-zA-Z0-9]{48,}/,
    description: "OpenAI API key detected",
  },
  {
    name: "Database URL with Credentials",
    pattern: /(?:postgres|mysql|mongodb):\/\/[^:]+:[^@]+@/,
    description: "Database connection string with credentials detected",
  },
  {
    name: "Bearer Token",
    pattern: /(?:bearer|Bearer)\s+[a-zA-Z0-9_\-.]{20,}/,
    description: "Bearer token detected",
  },
  {
    name: "Env File Reference",
    pattern: /\.env(?:\.local|\.production|\.staging)?\b/,
    description: "Reference to .env file — ensure it is in .gitignore",
  },
];

/**
 * Files to skip during security scanning.
 */
const SECURITY_EXCLUSIONS: RegExp[] = [
  /node_modules/,
  /\.next/,
  /dist\//,
  /pnpm-lock\.yaml$/,
  /\.test\.(ts|tsx|js|jsx)$/,
  /\.spec\.(ts|tsx|js|jsx)$/,
  /\.md$/,
  /security-guard\.(ts|js)$/, // Don't scan ourselves
  /sentinel.*guard/i,
];

/**
 * Run the security guard.
 */
export function runSecurityGuard(): {
  result: GuardResult;
  violations: SecurityViolation[];
} {
  const addedLines = getAddedLines();
  const violations: SecurityViolation[] = [];

  for (const diffLine of addedLines) {
    // Skip excluded files
    if (SECURITY_EXCLUSIONS.some((pattern) => pattern.test(diffLine.file))) {
      continue;
    }

    // Skip binary files
    if (/\.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i.test(diffLine.file)) {
      continue;
    }

    for (const secretPattern of SECRET_PATTERNS) {
      if (secretPattern.pattern.test(diffLine.content)) {
        // Skip .env reference pattern if it's in a .gitignore or config file
        if (
          secretPattern.name === "Env File Reference" &&
          /\.(gitignore|dockerignore|eslintignore)$/.test(diffLine.file)
        ) {
          continue;
        }

        // Skip if line is a comment explaining what not to do
        const trimmed = diffLine.content.trim();
        if (
          trimmed.startsWith("//") ||
          trimmed.startsWith("/*") ||
          trimmed.startsWith("*") ||
          trimmed.startsWith("#")
        ) {
          continue;
        }

        violations.push({
          file: diffLine.file,
          lineNumber: diffLine.lineNumber,
          line: maskSensitive(diffLine.content.trim()),
          type: secretPattern.name,
          description: secretPattern.description,
        });
      }
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
    guard: "security",
    passed: uniqueViolations.length === 0,
    violations: uniqueViolations.length,
    details:
      uniqueViolations.length === 0
        ? ["No secrets or sensitive data detected"]
        : uniqueViolations.map(
            (v) =>
              `${v.file}:${v.lineNumber} — ${v.type}: ${v.description}`
          ),
  };

  return { result, violations: uniqueViolations };
}

/**
 * Mask sensitive data in output to avoid leaking it in reports.
 */
function maskSensitive(line: string): string {
  // Replace long alphanumeric strings (likely keys/tokens) with masked version
  return line.replace(
    /([a-zA-Z0-9_\-]{4})[a-zA-Z0-9_\-]{16,}/g,
    "$1****"
  );
}
