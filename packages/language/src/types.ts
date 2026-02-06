export interface TextAnalysis {
  text: string;
  language: string;
  sentiment: number;
  topics: string[];
  flags: ContentFlag[];
}

export interface ContentFlag {
  type: "profanity" | "pii" | "spam" | "sensitive" | "compliant";
  severity: "low" | "medium" | "high" | "critical";
  detail: string;
  position?: { start: number; end: number };
}

export interface ScanResult {
  clean: boolean;
  flags: ContentFlag[];
  processedAt: number;
}
