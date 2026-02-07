/**
 * SILENCE SENTINEL — Architecture Policy
 *
 * Defines module boundaries, CLOSED modules, and structural rules.
 */

/**
 * CLOSED modules — these packages are frozen. Any modification requires
 * explicit OWNER approval. Sentinel will flag all changes in these paths.
 */
export const CLOSED_MODULES: string[] = [
  "packages/events",
  "packages/contracts",
];

/**
 * Protected modules — changes are allowed but require review.
 * Less strict than CLOSED, but still flagged in reports.
 */
export const PROTECTED_MODULES: string[] = [
  "packages/safety",
  "packages/voice",
];

/**
 * Core module dependency rules.
 * Maps each module to its allowed dependencies (other @silence/* packages).
 * Any dependency not listed here is a violation.
 */
export const MODULE_DEPENDENCY_RULES: Record<string, string[]> = {
  "packages/contracts": [],
  "packages/events": ["@silence/contracts"],
  "packages/core": ["@silence/contracts", "@silence/events"],
  "packages/archetypes": ["@silence/contracts", "@silence/events", "@silence/core"],
  "packages/safety": ["@silence/contracts", "@silence/events"],
  "packages/language": ["@silence/contracts", "@silence/events", "@silence/core"],
  "packages/validator": ["@silence/contracts", "@silence/events", "@silence/core"],
  "packages/ui": ["@silence/contracts", "@silence/events", "@silence/core", "@silence/archetypes"],
  "packages/voice": ["@silence/contracts", "@silence/events", "@silence/core"],
};

/**
 * Required exports — every module must export from its src/index.ts.
 */
export const REQUIRED_MODULES: string[] = [
  "packages/contracts",
  "packages/events",
  "packages/core",
  "packages/archetypes",
  "packages/safety",
  "packages/language",
  "packages/validator",
  "packages/ui",
  "packages/voice",
];

/**
 * Check if a file path belongs to a CLOSED module.
 */
export function isClosedModule(filePath: string): boolean {
  return CLOSED_MODULES.some((mod) => filePath.startsWith(mod));
}

/**
 * Check if a file path belongs to a PROTECTED module.
 */
export function isProtectedModule(filePath: string): boolean {
  return PROTECTED_MODULES.some((mod) => filePath.startsWith(mod));
}

/**
 * Get the module name from a file path, or null if not in a known module.
 */
export function getModuleName(filePath: string): string | null {
  const match = filePath.match(/^(packages\/[^/]+)/);
  return match ? match[1] : null;
}
