// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
import { Drawer } from "vaul";

import { Play, Star } from "lucide-react";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import AllChords from "./AllChords";
import { ChordDiagram, chords } from "./ChordDiagram";
import UkuleleChord from "./SVGChordDiagram";
import { ButtonGroup, ButtonGroupItem } from "./components/ButtonGroup";
import { midiOfChordDiagram } from "./midiOfChordDiagram";
import { ChordPlayer, useChordPlayer } from "./wam/useChordPlayer";

export function App() {
  const chordPlayer = useChordPlayer();
  const [favsState, setFavsState] = useLocalStorageState<string[]>(
    "ukulele-tool.favourite-chords",
    { defaultValue: [] }
  );

  return (
    <div className="p-4">
      <div className="flex flex-row items-center">
        <h1 className="text-xl mb-2">Ukulele Chords</h1>
        <div className="grow"></div>
        <FavouritesDrawer
          chordPlayer={chordPlayer}
          favourites={favsState}
          setFavsState={setFavsState}
        />
      </div>
      <AllChords
        chordPlayer={chordPlayer}
        favourites={favsState}
        setFavouries={setFavsState}
      />
    </div>
  );
}

const snapPoints = ["148px", "355px", 1];

function FavouritesDrawer({
  chordPlayer,
  favourites,
  setFavsState,
}: {
  chordPlayer: ChordPlayer;
  favourites: string[];
  setFavsState: (favs: string[]) => void;
}) {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
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

  return (
    <Drawer.Root>
      <Drawer.Trigger className="flex relative h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] dark:text-white">
        <Star className="h-4 w-4" /> Starred
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[82vh] rounded-t-[10px]">
          <div className="max-w-3xl w-full mx-auto overflow-auto p-4 rounded-t-[10px]">
            <Drawer.Handle />
            <Drawer.Title className="font-medium text-gray-900 mt-8">
              Starred Chords
            </Drawer.Title>
            <div className="grid grid-cols-4  lg:grid-cols-6">
              {favourites.map((name) => {
                const chord = chords[name];

                return (
                  <div
                    className="h-48 w-32 flex flex-col items-center"
                    key={name}
                  >
                    <UkuleleChord
                      chord={chord}
                      name={name}
                      size={100}
                      className="w-full h-full size-full"
                    />
                    <ButtonGroup variant={"outline"} size={"sm"}>
                      <ButtonGroupItem
                        className="cursor-pointer"
                        onClick={() => playChord(chords[name])}
                      >
                        <Play />
                      </ButtonGroupItem>
                      <ButtonGroupItem
                        className="cursor-pointer"
                        onClick={() =>
                          setFavsState(favourites.filter((x) => x !== name))
                        }
                      >
                        <Star
                          fill={true ? "orange" : "none"}
                          stroke={true ? "orange" : "black"}
                        />
                      </ButtonGroupItem>
                    </ButtonGroup>
                  </div>
                );
              })}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
