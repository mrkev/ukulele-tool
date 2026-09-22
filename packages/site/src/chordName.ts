// Long-form names for the chord symbols in ChordDiagram.ts, e.g. "Cm7" ->
// "C minor 7th". Used wherever a chord needs a name that reads as words
// rather than as a symbol: screen readers, page text, search engines.

const QUALITIES: Record<string, string> = {
  "": "major",
  "7": "dominant 7th",
  m: "minor",
  m7: "minor 7th",
  dim: "diminished",
  aug: "augmented",
  "6": "6th",
  maj7: "major 7th",
  "9": "9th",
};

const FLATS: Record<string, string> = {
  Db: "D flat",
  Eb: "E flat",
  Gb: "G flat",
  Ab: "A flat",
  Bb: "B flat",
};

export function describeChord(symbol: string): string {
  const match = /^([A-G]b?)(.*)$/.exec(symbol);
  if (match == null) {
    return symbol;
  }
  const [, root, quality] = match;
  return `${FLATS[root] ?? root} ${QUALITIES[quality] ?? quality}`;
}
