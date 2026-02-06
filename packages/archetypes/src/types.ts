export interface Archetype {
  id: string;
  name: string;
  description: string;
  traits: string[];
  weight: number;
}

export interface ArchetypeMatch {
  archetype: Archetype;
  score: number;
  confidence: number;
}

export interface ArchetypeProfile {
  primary: ArchetypeMatch;
  secondary: ArchetypeMatch[];
  timestamp: number;
}
