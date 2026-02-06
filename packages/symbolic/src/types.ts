export interface Symbol {
  id: string;
  glyph: string;
  meaning: string;
  domain: string;
  weight: number;
}

export interface SymbolSequence {
  symbols: Symbol[];
  context: string;
  interpretation?: string;
}

export interface SymbolMapping {
  from: Symbol;
  to: Symbol;
  relationship: "synonym" | "antonym" | "complement" | "transform";
}
