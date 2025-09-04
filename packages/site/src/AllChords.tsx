import { Play, Plus, Star } from "lucide-react";
import React, { useMemo } from "react";
import useLocalStorageState from "use-local-storage-state";
import {
  A,
  A6,
  A7,
  A9,
  Aaug,
  Ab,
  Ab6,
  Ab7,
  Ab9,
  Abaug,
  Abdim,
  Abm,
  Abm7,
  Abmaj7,
  Adim,
  Am,
  Am7,
  Amaj7,
  B,
  B6,
  B7,
  B9,
  Baug,
  Bb,
  Bb6,
  Bb7,
  Bb9,
  Bbaug,
  Bbdim,
  Bbm,
  Bbm7,
  Bbmaj7,
  Bdim,
  Bm,
  Bm7,
  Bmaj7,
  C,
  C6,
  C7,
  C9,
  Caug,
  Cdim,
  ChordDiagram,
  Cm,
  Cm7,
  Cmaj7,
  D,
  D6,
  D7,
  D9,
  Daug,
  Db,
  Db6,
  Db7,
  Db9,
  Dbaug,
  Dbdim,
  Dbm,
  Dbm7,
  Dbmaj7,
  Ddim,
  Dm,
  Dm7,
  Dmaj7,
  E,
  E6,
  E7,
  E9,
  Eaug,
  Eb,
  Eb6,
  Eb7,
  Eb9,
  Ebaug,
  Ebdim,
  Ebm,
  Ebm7,
  Ebmaj7,
  Edim,
  Em,
  Em7,
  Emaj7,
  F,
  F6,
  F7,
  F9,
  Faug,
  Fdim,
  Fm,
  Fm7,
  Fmaj7,
  G,
  G6,
  G7,
  G9,
  Gaug,
  Gb,
  Gb6,
  Gb7,
  Gb9,
  Gbaug,
  Gbdim,
  Gbm,
  Gbm7,
  Gbmaj7,
  Gdim,
  Gm,
  Gm7,
  Gmaj7,
} from "./ChordDiagram";
import UkuleleChord from "./SVGChordDiagram";
import { ButtonGroup, ButtonGroupItem } from "./components/ButtonGroup";

const chordGroups: Record<string, [string, ChordDiagram][]> = {
  C: [
    ["C", C],
    ["C7", C7],
    ["Cm", Cm],
    ["Cm7", Cm7],
    ["Cdim", Cdim],
    ["Caug", Caug],
    ["C6", C6],
    ["Cmaj7", Cmaj7],
    ["C9", C9],
  ],
  Db: [
    ["Db", Db],
    ["Db7", Db7],
    ["Dbm", Dbm],
    ["Dbm7", Dbm7],
    ["Dbdim", Dbdim],
    ["Dbaug", Dbaug],
    ["Db6", Db6],
    ["Dbmaj7", Dbmaj7],
    ["Db9", Db9],
  ],
  D: [
    ["D", D],
    ["D7", D7],
    ["Dm", Dm],
    ["Dm7", Dm7],
    ["Ddim", Ddim],
    ["Daug", Daug],
    ["D6", D6],
    ["Dmaj7", Dmaj7],
    ["D9", D9],
  ],
  Eb: [
    ["Eb", Eb],
    ["Eb7", Eb7],
    ["Ebm", Ebm],
    ["Ebm7", Ebm7],
    ["Ebdim", Ebdim],
    ["Ebaug", Ebaug],
    ["Eb6", Eb6],
    ["Ebmaj7", Ebmaj7],
    ["Eb9", Eb9],
  ],
  E: [
    ["E", E],
    ["E7", E7],
    ["Em", Em],
    ["Em7", Em7],
    ["Edim", Edim],
    ["Eaug", Eaug],
    ["E6", E6],
    ["Emaj7", Emaj7],
    ["E9", E9],
  ],
  F: [
    ["F", F],
    ["F7", F7],
    ["Fm", Fm],
    ["Fm7", Fm7],
    ["Fdim", Fdim],
    ["Faug", Faug],
    ["F6", F6],
    ["Fmaj7", Fmaj7],
    ["F9", F9],
  ],
  Gb: [
    ["Gb", Gb],
    ["Gb7", Gb7],
    ["Gbm", Gbm],
    ["Gbm7", Gbm7],
    ["Gbdim", Gbdim],
    ["Gbaug", Gbaug],
    ["Gb6", Gb6],
    ["Gbmaj7", Gbmaj7],
    ["Gb9", Gb9],
  ],
  G: [
    ["G", G],
    ["G7", G7],
    ["Gm", Gm],
    ["Gm7", Gm7],
    ["Gdim", Gdim],
    ["Gaug", Gaug],
    ["G6", G6],
    ["Gmaj7", Gmaj7],
    ["G9", G9],
  ],
  Ab: [
    ["Ab", Ab],
    ["Ab7", Ab7],
    ["Abm", Abm],
    ["Abm7", Abm7],
    ["Abdim", Abdim],
    ["Abaug", Abaug],
    ["Ab6", Ab6],
    ["Abmaj7", Abmaj7],
    ["Ab9", Ab9],
  ],
  A: [
    ["A", A],
    ["A7", A7],
    ["Am", Am],
    ["Am7", Am7],
    ["Adim", Adim],
    ["Aaug", Aaug],
    ["A6", A6],
    ["Amaj7", Amaj7],
    ["A9", A9],
  ],
  Bb: [
    ["Bb", Bb],
    ["Bb7", Bb7],
    ["Bbm", Bbm],
    ["Bbm7", Bbm7],
    ["Bbdim", Bbdim],
    ["Bbaug", Bbaug],
    ["Bb6", Bb6],
    ["Bbmaj7", Bbmaj7],
    ["Bb9", Bb9],
  ],
  B: [
    ["B", B],
    ["B7", B7],
    ["Bm", Bm],
    ["Bm7", Bm7],
    ["Bdim", Bdim],
    ["Baug", Baug],
    ["B6", B6],
    ["Bmaj7", Bmaj7],
    ["B9", B9],
  ],
};

export const AllChords: React.FC = () => {
  const [favsState, setFavsState] = useLocalStorageState<string[]>(
    "ukulele-tool.favourite-chords",
    { defaultValue: [] }
  );

  const favSet = useMemo(() => new Set(favsState), [favsState]);

  const toggleFav = (value: string) => {
    if (favSet.has(value)) {
      setFavsState((prev) => prev.filter((x) => x !== value));
    } else {
      setFavsState((prev) => prev.concat(value));
    }
  };

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
                    <ButtonGroupItem className="cursor-pointer" disabled>
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
};

export default AllChords;
