import type { Archetype, ArchetypeMatch, ArchetypeProfile } from "./types";

const ARCHETYPES: Archetype[] = [
  { id: "analyst", name: "Analyst", description: "Data-driven decision maker", traits: ["analytical", "methodical", "detail-oriented"], weight: 1.0 },
  { id: "visionary", name: "Visionary", description: "Big-picture strategic thinker", traits: ["creative", "forward-thinking", "risk-tolerant"], weight: 1.0 },
  { id: "operator", name: "Operator", description: "Execution-focused builder", traits: ["pragmatic", "efficient", "results-driven"], weight: 1.0 },
  { id: "connector", name: "Connector", description: "Relationship-driven leader", traits: ["empathetic", "communicative", "collaborative"], weight: 1.0 },
];

export function getArchetypes(): Archetype[] {
  return [...ARCHETYPES];
}

export function getArchetypeById(id: string): Archetype | undefined {
  return ARCHETYPES.find((a) => a.id === id);
}

export function matchTraits(traits: string[]): ArchetypeMatch[] {
  return ARCHETYPES.map((archetype) => {
    const matched = archetype.traits.filter((t) => traits.includes(t));
    const score = matched.length / archetype.traits.length;
    return { archetype, score, confidence: score * archetype.weight };
  })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function buildProfile(traits: string[]): ArchetypeProfile | null {
  const matches = matchTraits(traits);
  if (matches.length === 0) return null;
  return {
    primary: matches[0],
    secondary: matches.slice(1),
    timestamp: Date.now(),
  };
}
