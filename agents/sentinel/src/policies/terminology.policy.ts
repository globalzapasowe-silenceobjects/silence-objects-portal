/**
 * SILENCE SENTINEL — Terminology Policy
 *
 * Full forbidden vocabulary list with suggested replacements.
 * SILENCE.OBJECTS does NOT do therapy, diagnosis, coaching, divination,
 * personality profiling, or emotional analysis. The vocabulary must reflect
 * structural / architectural framing at all times.
 */

export interface ForbiddenTerm {
  term: string;
  language: "en" | "pl";
  suggestion: string;
  category: "clinical" | "spiritual" | "journaling" | "personality" | "interpretive" | "coaching" | "detection";
}

export const FORBIDDEN_TERMS: ForbiddenTerm[] = [
  // === ENGLISH — Clinical ===
  { term: "therapy", language: "en", suggestion: "structural analysis", category: "clinical" },
  { term: "diagnosis", language: "en", suggestion: "pattern recognition", category: "clinical" },
  { term: "advice", language: "en", suggestion: "framework output", category: "clinical" },
  { term: "treatment", language: "en", suggestion: "structural process", category: "clinical" },
  { term: "healing", language: "en", suggestion: "structural integration", category: "clinical" },
  { term: "wellness", language: "en", suggestion: "structural coherence", category: "clinical" },

  // === ENGLISH — Spiritual ===
  { term: "spiritual", language: "en", suggestion: "structural", category: "spiritual" },
  { term: "mystical", language: "en", suggestion: "abstract", category: "spiritual" },
  { term: "divine", language: "en", suggestion: "foundational", category: "spiritual" },
  { term: "cosmic", language: "en", suggestion: "systemic", category: "spiritual" },
  { term: "horoscope", language: "en", suggestion: "structural pattern", category: "spiritual" },
  { term: "fortune", language: "en", suggestion: "projection", category: "spiritual" },

  // === ENGLISH — Journaling ===
  { term: "entry", language: "en", suggestion: "record", category: "journaling" },
  { term: "journal", language: "en", suggestion: "log", category: "journaling" },
  { term: "reflection", language: "en", suggestion: "review", category: "journaling" },
  { term: "note", language: "en", suggestion: "annotation", category: "journaling" },

  // === ENGLISH — Personality ===
  { term: "trait", language: "en", suggestion: "structural attribute", category: "personality" },
  { term: "personality", language: "en", suggestion: "structural pattern", category: "personality" },
  { term: "characteristic", language: "en", suggestion: "structural property", category: "personality" },

  // === ENGLISH — Interpretive ===
  { term: "problem", language: "en", suggestion: "tension", category: "interpretive" },
  { term: "issue", language: "en", suggestion: "structural tension", category: "interpretive" },
  { term: "conflict", language: "en", suggestion: "polarity", category: "interpretive" },
  { term: "purpose", language: "en", suggestion: "orientation", category: "interpretive" },
  { term: "meaning", language: "en", suggestion: "structural significance", category: "interpretive" },
  { term: "reason", language: "en", suggestion: "structural basis", category: "interpretive" },
  { term: "interpretation", language: "en", suggestion: "structural reading", category: "interpretive" },
  { term: "reading", language: "en", suggestion: "structural analysis", category: "interpretive" },
  { term: "truth", language: "en", suggestion: "structural fact", category: "interpretive" },
  { term: "answer", language: "en", suggestion: "output", category: "interpretive" },
  { term: "verdict", language: "en", suggestion: "structural conclusion", category: "interpretive" },

  // === ENGLISH — Coaching / Profiling / Detection (multi-word) ===
  { term: "coaching", language: "en", suggestion: "structural guidance", category: "coaching" },
  { term: "personality type", language: "en", suggestion: "structural pattern", category: "personality" },
  { term: "personality test", language: "en", suggestion: "structural assessment", category: "personality" },
  { term: "emotional analysis", language: "en", suggestion: "structural signal analysis", category: "detection" },
  { term: "mood tracking", language: "en", suggestion: "signal monitoring", category: "detection" },
  { term: "tarot card", language: "en", suggestion: "archetype card", category: "spiritual" },
  { term: "oracle", language: "en", suggestion: "pattern engine", category: "spiritual" },
  { term: "divination", language: "en", suggestion: "pattern projection", category: "spiritual" },
  { term: "personality profiling", language: "en", suggestion: "structural mapping", category: "personality" },
  { term: "typing", language: "en", suggestion: "structural classification", category: "personality" },
  { term: "spiritual guidance", language: "en", suggestion: "structural orientation", category: "spiritual" },
  { term: "mystical reading", language: "en", suggestion: "structural analysis", category: "spiritual" },
  { term: "emotion detection", language: "en", suggestion: "signal detection", category: "detection" },
  { term: "mood from voice", language: "en", suggestion: "vocal signal analysis", category: "detection" },

  // === POLISH — Clinical ===
  { term: "terapia", language: "pl", suggestion: "analiza strukturalna", category: "clinical" },
  { term: "diagnoza", language: "pl", suggestion: "rozpoznanie wzorca", category: "clinical" },
  { term: "porada", language: "pl", suggestion: "wynik frameworku", category: "clinical" },
  { term: "leczenie", language: "pl", suggestion: "proces strukturalny", category: "clinical" },
  { term: "uzdrawianie", language: "pl", suggestion: "integracja strukturalna", category: "clinical" },
  { term: "wellness", language: "pl", suggestion: "koherencja strukturalna", category: "clinical" },

  // === POLISH — Spiritual ===
  { term: "duchowy", language: "pl", suggestion: "strukturalny", category: "spiritual" },
  { term: "mistyczny", language: "pl", suggestion: "abstrakcyjny", category: "spiritual" },
  { term: "boski", language: "pl", suggestion: "fundamentalny", category: "spiritual" },
  { term: "kosmiczny", language: "pl", suggestion: "systemowy", category: "spiritual" },
  { term: "horoskop", language: "pl", suggestion: "wzorzec strukturalny", category: "spiritual" },
  { term: "przepowiednia", language: "pl", suggestion: "projekcja", category: "spiritual" },

  // === POLISH — Journaling ===
  { term: "wpis", language: "pl", suggestion: "rekord", category: "journaling" },
  { term: "dziennik", language: "pl", suggestion: "log", category: "journaling" },
  { term: "refleksja", language: "pl", suggestion: "przeglad", category: "journaling" },
  { term: "notatka", language: "pl", suggestion: "adnotacja", category: "journaling" },

  // === POLISH — Personality ===
  { term: "cecha", language: "pl", suggestion: "atrybut strukturalny", category: "personality" },
  { term: "osobowość", language: "pl", suggestion: "wzorzec strukturalny", category: "personality" },

  // === POLISH — Interpretive ===
  { term: "problem", language: "pl", suggestion: "napiecie", category: "interpretive" },
  { term: "kwestia", language: "pl", suggestion: "napiecie strukturalne", category: "interpretive" },
  { term: "konflikt", language: "pl", suggestion: "polaryzacja", category: "interpretive" },
  { term: "cel", language: "pl", suggestion: "orientacja", category: "interpretive" },
  { term: "znaczenie", language: "pl", suggestion: "znaczenie strukturalne", category: "interpretive" },
  { term: "powód", language: "pl", suggestion: "podstawa strukturalna", category: "interpretive" },
  { term: "interpretacja", language: "pl", suggestion: "odczyt strukturalny", category: "interpretive" },
  { term: "prawda", language: "pl", suggestion: "fakt strukturalny", category: "interpretive" },
  { term: "odpowiedź", language: "pl", suggestion: "wynik", category: "interpretive" },
  { term: "werdykt", language: "pl", suggestion: "konkluzja strukturalna", category: "interpretive" },

  // === POLISH — Coaching / Profiling / Detection (multi-word) ===
  { term: "coaching", language: "pl", suggestion: "orientacja strukturalna", category: "coaching" },
  { term: "test osobowości", language: "pl", suggestion: "ocena strukturalna", category: "personality" },
  { term: "analiza emocjonalna", language: "pl", suggestion: "analiza sygnalu strukturalnego", category: "detection" },
  { term: "śledzenie nastroju", language: "pl", suggestion: "monitorowanie sygnalu", category: "detection" },
  { term: "karta tarota", language: "pl", suggestion: "karta archetypu", category: "spiritual" },
  { term: "wyrocznia", language: "pl", suggestion: "silnik wzorcow", category: "spiritual" },
  { term: "wróżba", language: "pl", suggestion: "projekcja wzorca", category: "spiritual" },
  { term: "profilowanie osobowości", language: "pl", suggestion: "mapowanie strukturalne", category: "personality" },
  { term: "duchowe przewodnictwo", language: "pl", suggestion: "orientacja strukturalna", category: "spiritual" },
  { term: "mistyczne czytanie", language: "pl", suggestion: "analiza strukturalna", category: "spiritual" },
  { term: "wykrywanie emocji", language: "pl", suggestion: "detekcja sygnalu", category: "detection" },
];

/**
 * Paths/patterns to exclude from terminology scanning.
 * These files legitimately reference forbidden terms (e.g., policy definitions,
 * sentinel source code, documentation about what NOT to say).
 */
export const TERMINOLOGY_EXCLUSIONS: RegExp[] = [
  /sentinel/i,
  /\.policy\.(ts|js)$/i,
  /COMPLIANCE\.md$/i,
  /SAFETY\.md$/i,
  /SENTINEL.*\.md$/i,
  /MEGA_BUILD/i,
  /node_modules/,
  /\.next/,
  /dist\//,
  /pnpm-lock\.yaml$/,
];

/**
 * Returns the full list of forbidden term strings (lowercased) for quick matching.
 */
export function getForbiddenTermStrings(): string[] {
  return FORBIDDEN_TERMS.map((t) => t.term.toLowerCase());
}

/**
 * Find suggestion for a matched forbidden term.
 */
export function getSuggestion(term: string): string {
  const match = FORBIDDEN_TERMS.find(
    (t) => t.term.toLowerCase() === term.toLowerCase()
  );
  return match?.suggestion ?? "use structural framing";
}
