import { Play, Star } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ChordDiagram, chordGroups } from "./ChordDiagram";
import UkuleleChord from "./SVGChordDiagram";
import { ButtonGroup, ButtonGroupItem } from "./components/ButtonGroup";
import { midiOfChordDiagram } from "./midiOfChordDiagram";
import { ChordPlayer } from "./audio/useChordPlayer";

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

  return (
    <div className="p-4 space-y-8">
      {Object.entries(chordGroups).map(([root, chords]) => (
        <div key={root}>
          <h2 className="text-lg font-bold mb-4">{root} family</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-6">
            {chords.map(([name, diagram]) => {
              const isFav = favSet.has(name);
              return (
                <div
                  className="h-48 w-32 flex flex-col items-center"
                  key={name}
                >
                  <UkuleleChord
                    chord={diagram}
                    name={name}
                    size={100}
                    className="w-full h-full size-full"
                  />
                  <ButtonGroup variant={"outline"} size={"sm"}>
                    {/* <ButtonGroupItem className="cursor-pointer" disabled>
                      <Plus />
                    </ButtonGroupItem> */}
                    <ButtonGroupItem
                      className="cursor-pointer"
                      onClick={() => playChord(diagram)}
                    >
                      <Play />
                    </ButtonGroupItem>
                    <ButtonGroupItem
                      className="cursor-pointer"
                      onClick={() => toggleFav(name)}
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
        </div>
      ))}
    </div>
  );
}

export default AllChords;
