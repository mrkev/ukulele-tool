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

/** Other ways people write a chord quality, mapped to the chart's symbols. */
function normalizeQuality(quality: string) {
  return quality
    .replace(/^(minor|min|-)/, "m")
    .replace(/^\+/, "aug")
    .replace(/^°/, "dim");
}

/**
 * Filters the chart to the chords matching a typed query.
 *
 * A query starting with a note ("F#m", "bb7", "c minor") matches that root's
 * chords whose quality starts with the rest. Sharps find their flat spelling.
 * Anything else ("m7", "dim", "9") matches that quality across every root.
 * An empty query returns the groups unchanged.
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
        keep(root, name.slice(root.length).toLowerCase())
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
    const quality = normalizeQuality(rest);
    const byRoot = filter((r, chordQuality) => r === root && chordQuality.startsWith(quality));
    // "dim" and "aug" also start with a note letter; fall through to them.
    if (Object.keys(byRoot).length > 0) return byRoot;
  }

  const quality = normalizeQuality(q);
  return filter((_, chordQuality) => chordQuality !== "" && chordQuality.startsWith(quality));
}
