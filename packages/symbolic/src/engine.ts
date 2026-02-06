import type { Symbol, SymbolSequence, SymbolMapping } from "./types";

const SYMBOLS = new Map<string, Symbol>();

export function registerSymbol(symbol: Symbol): void {
  SYMBOLS.set(symbol.id, symbol);
}

export function getSymbol(id: string): Symbol | undefined {
  return SYMBOLS.get(id);
}

export function findByDomain(domain: string): Symbol[] {
  return Array.from(SYMBOLS.values()).filter((s) => s.domain === domain);
}

export function createSequence(symbolIds: string[], context: string): SymbolSequence | null {
  const symbols = symbolIds.map((id) => SYMBOLS.get(id)).filter((s): s is Symbol => s !== undefined);
  if (symbols.length === 0) return null;
  return { symbols, context };
}

export function interpretSequence(sequence: SymbolSequence): string {
  return sequence.symbols.map((s) => s.meaning).join(" → ");
}
