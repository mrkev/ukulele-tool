import { Dispatch, SetStateAction, useMemo } from "react";
import { ChordDiagram, chordGroups } from "./ChordDiagram";
import { searchChords } from "./chordSearch";
import { CHORD_GRID, ChordCard, PlayStarButtons } from "./ChordCard";
import { midiOfChordDiagram } from "./midiOfChordDiagram";
import { ChordPlayer } from "./audio/useChordPlayer";
import { RootIndex } from "./RootIndex";
import { sectionId } from "./sections";

export function AllChords({
  chordPlayer,
  favourites,
  setFavouries,
  query,
}: {
  chordPlayer: ChordPlayer;
  /** Search text; the chart shows only matching chords. */
  query: string;
  favourites: string[];
  setFavouries: Dispatch<SetStateAction<string[]>>;
}) {
  const favSet = useMemo(() => new Set(favourites), [favourites]);

  const toggleFav = (value: string) => {
    if (favSet.has(value)) {
      setFavouries((prev) => prev.filter((x) => x !== value));
    } else {
      setFavouries((prev) => prev.concat(value));
    }
  };

  const playChord = (chord: ChordDiagram) => {
    console.log("play", chord, midiOfChordDiagram(chord));
    const [g, c, e, a] = midiOfChordDiagram(chord);

    chordPlayer.play([
      [g, 100],
      [c, 100],
      [e, 100],
      [a, 100],
    ]);

    // if (favSet.has(value)) {
    //   setFavouries((prev) => prev.filter((x) => x !== value));
    // } else {
    //   setFavouries((prev) => prev.concat(value));
    // }
  };

  console.log(chordPlayer.status);

  const groups = useMemo(() => searchChords(chordGroups, query), [query]);
  const roots = useMemo(() => Object.keys(groups), [groups]);

  return (
    // Right padding keeps the last column clear of the fixed root index.
    <div className="py-4 pr-3 sm:px-4 lg:pr-8">
      <RootIndex roots={roots} />
      {roots.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No chords match “{query.trim()}”. Try a root like F#, or a type like
          m7 or dim.
        </p>
      )}
      <div className="space-y-8">
        {Object.entries(groups).map(([root, chords]) => (
          <section key={root} id={sectionId(root)} className="scroll-mt-4">
            <h2 className="text-lg font-bold mb-4">{root} chords</h2>
            <div className={CHORD_GRID}>
              {chords.map(([name, diagram]) => (
                <ChordCard key={name} name={name} diagram={diagram} draggable>
                  <PlayStarButtons
                    name={name}
                    starred={favSet.has(name)}
                    onPlay={() => playChord(diagram)}
                    onToggleStar={() => toggleFav(name)}
                  />
                </ChordCard>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default AllChords;
