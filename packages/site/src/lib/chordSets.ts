import { useCallback, useMemo } from "react";
import useLocalStorageState from "use-local-storage-state";

/** A named group of chords, in the order the user put them. */
export type ChordSet = {
  id: string;
  name: string;
  /** Chord names, each at most once. */
  chords: string[];
};

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** The user's own sets, saved in the browser. Starred chords are kept apart. */
export function useChordSets() {
  const [sets, setSets] = useLocalStorageState<ChordSet[]>(
    "ukulele-tool.chord-sets",
    { defaultValue: [] }
  );

  const update = useCallback(
    (id: string, change: (set: ChordSet) => ChordSet) =>
      setSets((prev) => prev.map((s) => (s.id === id ? change(s) : s))),
    [setSets]
  );

  const actions = useMemo(
    () => ({
      /** Adds a set at the end, empty unless given chords, and returns its id. */
      create(name: string, chords: string[] = []) {
        const id = newId();
        setSets((prev) => prev.concat({ id, name, chords }));
        return id;
      },
      rename(id: string, name: string) {
        update(id, (s) => ({ ...s, name }));
      },
      remove(id: string) {
        setSets((prev) => prev.filter((s) => s.id !== id));
      },
      /** Adds the chord at the end, unless it's already there. */
      addChord(id: string, chord: string) {
        update(id, (s) =>
          s.chords.includes(chord)
            ? s
            : { ...s, chords: s.chords.concat(chord) }
        );
      },
      /** Adds the chord at the end, or takes it out if it's already there. */
      toggleChord(id: string, chord: string) {
        update(id, (s) => ({
          ...s,
          chords: s.chords.includes(chord)
            ? s.chords.filter((c) => c !== chord)
            : s.chords.concat(chord),
        }));
      },
      /** Moves the chord at `index` by `by` places (-1: earlier, 1: later). */
      moveChord(id: string, index: number, by: number) {
        update(id, (s) => {
          const to = index + by;
          if (to < 0 || to >= s.chords.length) return s;
          const chords = s.chords.slice();
          const [chord] = chords.splice(index, 1);
          chords.splice(to, 0, chord);
          return { ...s, chords };
        });
      },
    }),
    [setSets, update]
  );

  return [sets, actions] as const;
}

export type ChordSetActions = ReturnType<typeof useChordSets>[1];
