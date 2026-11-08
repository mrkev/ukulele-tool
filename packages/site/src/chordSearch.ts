import type { ChordDiagram } from "./ChordDiagram";

export type ChordGroups = Record<string, [string, ChordDiagram][]>;

/** The chart spells every root with flats; map the other spellings onto them. */
const ENHARMONIC: Record<string, string> = {
  "C#": "Db",
  "D#": "Eb",
  "E#": "F",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb",
  "B#": "C",
  Cb: "B",
  Fb: "E",
};

/**
 * Every way someone might type each quality in the chart, lowercased with no
 * spaces. A query matches a quality when it's the start of any of these, so a
 * half-typed word ("mi", "dimin", "aug") finds it.
 */
const QUALITY_NAMES: Record<string, string[]> = {
  "": ["maj", "major"],
  "7": ["7", "dom7", "dominant7"],
  m: ["m", "min", "minor", "-"],
  m7: ["m7", "min7", "minor7", "-7"],
  dim: ["dim", "diminished", "°", "o"],
  aug: ["aug", "augmented", "+"],
  "6": ["6", "maj6", "major6"],
  maj7: ["maj7", "major7", "Δ", "Δ7"],
  "9": ["9", "dom9", "dominant9"],
};

function qualityMatches(chordQuality: string, typed: string) {
  if (typed === "") return true;
  if (chordQuality.toLowerCase().startsWith(typed)) return true;
  // One character is too little to guess a word from: "m" alone means minor in
  // chord symbols, not the start of "major". Only exact aliases like "+" count.
  return (QUALITY_NAMES[chordQuality] ?? []).some((n) => {
    const name = n.toLowerCase();
    return typed.length >= 2 ? name.startsWith(typed) : name === typed;
  });
}

/**
 * Filters the chart to the chords matching a typed query.
 *
 * A query starting with a note ("F#m", "bb7", "d mi", "c minor 7") matches
 * that root's chords whose quality starts with the rest, in any common
 * spelling. Sharps find their flat spelling. Anything else ("m7", "dim",
 * "minor") matches that quality across every root. Spaces are ignored. An
 * empty query returns the groups unchanged.
 */
export function searchChords(groups: ChordGroups, query: string): ChordGroups {
  const q = query
    .replace(/\s+/g, "")
    .replace(/♯/g, "#")
    .replace(/♭/g, "b")
    .toLowerCase();
  if (q === "") return groups;

  const filter = (keep: (root: string, quality: string) => boolean) => {
    const result: ChordGroups = {};
    for (const [root, chords] of Object.entries(groups)) {
      const matches = chords.filter(([name]) =>
        keep(root, name.slice(root.length))
      );
      if (matches.length > 0) result[root] = matches;
    }
    return result;
  };

  const note = /^([a-g])([#b]?)(.*)$/.exec(q);
  if (note) {
    const [, letter, accidental, rest] = note;
    const spelled = letter.toUpperCase() + accidental;
    const root = ENHARMONIC[spelled] ?? spelled;
    const byRoot = filter((r, quality) => r === root && qualityMatches(quality, rest));
    // "dim" and "aug" also start with a note letter; fall through to them.
    if (Object.keys(byRoot).length > 0) return byRoot;
  }

  return filter((_, quality) => qualityMatches(quality, q));
}
