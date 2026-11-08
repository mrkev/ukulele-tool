import { Play, Star } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ChordDiagram, chordGroups } from "./ChordDiagram";
import UkuleleChord from "./SVGChordDiagram";
import { ButtonGroup, ButtonGroupItem } from "./components/ButtonGroup";
import { midiOfChordDiagram } from "./midiOfChordDiagram";
import { ChordPlayer } from "./audio/useChordPlayer";
import { ChordDragHandle } from "./dnd/ChordDrag";

export function AllChords({
  chordPlayer,
  favourites,
  setFavouries,
}: {
  chordPlayer: ChordPlayer;
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

  const roots = Object.keys(chordGroups);

  return (
    <div className="py-4 sm:px-4">
      <RootNav roots={roots} />
      <div className="space-y-8">
        {Object.entries(chordGroups).map(([root, chords]) => (
          <section
            key={root}
            id={sectionId(root)}
            // Land the heading below the sticky root bar, not under it.
            className="scroll-mt-16"
          >
            <h2 className="text-lg font-bold mb-4">{root} chords</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-x-3 gap-y-6 sm:gap-6">
              {chords.map(([name, diagram]) => {
                const isFav = favSet.has(name);
                return (
                  // Shrinks with its column on narrow phones; 128px at most.
                  <div
                    className="w-full max-w-32 mx-auto flex flex-col items-center"
                    key={name}
                  >
                    <ChordDragHandle name={name} diagram={diagram} className="w-full">
                      <UkuleleChord
                        chord={diagram}
                        name={name}
                        size={100}
                        className="w-full h-auto"
                      />
                    </ChordDragHandle>
                    <ButtonGroup variant={"outline"} size={"sm"}>
                      {/* <ButtonGroupItem className="cursor-pointer" disabled>
                        <Plus />
                      </ButtonGroupItem> */}
                      <ButtonGroupItem
                        className="cursor-pointer"
                        onClick={() => playChord(diagram)}
                        aria-label={`Play ${name}`}
                      >
                        <Play />
                      </ButtonGroupItem>
                      <ButtonGroupItem
                        className="cursor-pointer"
                        onClick={() => toggleFav(name)}
                        aria-label={isFav ? `Unstar ${name}` : `Star ${name}`}
                        aria-pressed={isFav}
                      >
                        <Star
                          fill={isFav ? "orange" : "none"}
                          stroke={isFav ? "orange" : "black"}
                        />
                      </ButtonGroupItem>
                    </ButtonGroup>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function sectionId(root: string) {
  return `${root.toLowerCase()}-chords`;
}

/**
 * Jump links to each root's section. Sticks to the top so any chord is a tap
 * and a short scroll away instead of a dozen screens of scrolling.
 */
function RootNav({ roots }: { roots: string[] }) {
  return (
    <nav
      aria-label="Chord roots"
      className="sticky top-0 z-10 -mx-4 mb-4 bg-white/95 px-4 py-2 backdrop-blur-sm sm:-mx-8 sm:px-8"
    >
      <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
        {roots.map((root) => (
          <li key={root} className="shrink-0">
            <a
              href={`#${sectionId(root)}`}
              className="flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 pointer-coarse:h-11 pointer-coarse:min-w-11"
            >
              {root}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default AllChords;
