/**
 * SILENCE SENTINEL — Configuration
 *
 * Central configuration for all guards and sentinel behavior.
 */

export interface SentinelConfig {
  /** Enable/disable individual guards */
  guards: {
    terminology: boolean;
    contracts: boolean;
    dependency: boolean;
    closedModule: boolean;
    typeSafety: boolean;
    security: boolean;
    build: boolean;
  };

  /** Score thresholds */
  scoring: {
    /** Minimum score to pass (0-100) */
    minimumScore: number;
    /** Deduction points per guard type */
    deductions: Record<string, number>;
  };

  /** Output configuration */
  output: {
    /** Generate markdown report */
    markdown: boolean;
    /** Print console report */
    console: boolean;
    /** Maximum violations to show per guard */
    maxViolationsPerGuard: number;
  };

  /** CI configuration */
  ci: {
    /** Fail the CI pipeline on violations */
    failOnViolations: boolean;
    /** Post PR comment with results */
    postPrComment: boolean;
  };
}

/**
 * Default sentinel configuration.
 */
export const DEFAULT_CONFIG: SentinelConfig = {
  guards: {
    terminology: true,
    contracts: true,
    dependency: true,
    closedModule: true,
    typeSafety: true,
    security: true,
    build: false, // Disabled by default — run explicitly
  },

  scoring: {
    minimumScore: 70,
    deductions: {
      terminology: 20,
      contracts: 15,
      dependency: 10,
      "closed-module": 15,
      "type-safety": 5,
      security: 25,
      build: 30,
    },
  },

  output: {
    markdown: true,
    console: true,
    maxViolationsPerGuard: 20,
  },

  ci: {
    failOnViolations: true,
    postPrComment: true,
  },
};

/**
 * Get the active configuration.
 * In future this could read from a sentinel.config.json file.
 */
export function getConfig(): SentinelConfig {
  return { ...DEFAULT_CONFIG };
}
