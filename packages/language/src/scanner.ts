import type { ContentFlag, ScanResult } from "./types";

const PII_PATTERNS = [
  { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, type: "pii" as const, detail: "Phone number detected" },
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, type: "pii" as const, detail: "Email address detected" },
  { pattern: /\b\d{2}[-]?\d{4}[-]?\d{4}[-]?\d{4}[-]?\d{4}[-]?\d{4}[-]?\d{2}\b/g, type: "pii" as const, detail: "IBAN detected" },
];

export function scanText(text: string): ScanResult {
  const flags: ContentFlag[] = [];

  for (const { pattern, type, detail } of PII_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      flags.push({ type, severity: "high", detail, position: { start: match.index, end: match.index + match[0].length } });
    }
  }

  return { clean: flags.length === 0, flags, processedAt: Date.now() };
}

export function redactPII(text: string): string {
  let result = text;
  for (const { pattern } of PII_PATTERNS) {
    result = result.replace(new RegExp(pattern.source, pattern.flags), "[REDACTED]");
  }
  return result;
}
