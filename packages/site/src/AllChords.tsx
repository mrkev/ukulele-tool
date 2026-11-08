import { Play, Star } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ChordDiagram, chordGroups } from "./ChordDiagram";
import UkuleleChord from "./SVGChordDiagram";
import { ButtonGroup, ButtonGroupItem } from "./components/ButtonGroup";
import { midiOfChordDiagram } from "./midiOfChordDiagram";
import { ChordPlayer } from "./audio/useChordPlayer";
import { ChordDragHandle } from "./dnd/ChordDrag";
import { RootIndex } from "./RootIndex";
import { sectionId } from "./sections";

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
    // Right padding keeps the last column clear of the fixed root index.
    <div className="py-4 pr-3 sm:px-4">
      <RootIndex roots={roots} />
      <div className="space-y-8">
        {Object.entries(chordGroups).map(([root, chords]) => (
          <section
            key={root}
            id={sectionId(root)}
            className="scroll-mt-4"
          >
            <h2 className="text-lg font-bold mb-4">{root} chords</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-x-2 gap-y-6 sm:gap-6">
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

export default AllChords;
