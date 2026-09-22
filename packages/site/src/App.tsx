import { Drawer } from "vaul";

import { ChevronDown, ChevronUp, Play, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import AllChords from "./AllChords";
import { ChordDiagram, chords } from "./ChordDiagram";
import UkuleleChord from "./SVGChordDiagram";
import { ButtonGroup, ButtonGroupItem } from "./components/ButtonGroup";
import { midiOfChordDiagram } from "./midiOfChordDiagram";
import { ChordPlayer, useChordPlayer } from "./audio/useChordPlayer";
import { ChordDragProvider, useChordDropZone } from "./dnd/ChordDrag";
import { cn } from "@/lib/utils";

/** Resting heights of the starred drawer. The first is the peek shown during a drag. */
const snapPoints = ["212px", "440px", 1];
/** How long a drag-opened drawer lingers after a drop, so the chord is seen landing. */
const DROP_LINGER_MS = 900;

export function App() {
  const chordPlayer = useChordPlayer();
  const [favsState, setFavsState] = useLocalStorageState<string[]>(
    "ukulele-tool.favourite-chords",
    { defaultValue: [] }
  );
  const [open, setOpen] = useState(false);
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  // Whether the drawer is on screen only because a drag is in progress. If the user
  // opened it themselves, a drag must not take it away again afterwards.
  const openedByDrag = useRef(false);
  const openRef = useRef(open);
  const closeTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const starChord = useCallback(
    (name: string) => {
      setFavsState((prev) => (prev.includes(name) ? prev : prev.concat(name)));
    },
    [setFavsState]
  );

  const handleDragStart = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    if (openRef.current) return;
    openedByDrag.current = true;
    setSnap(snapPoints[0]);
    setOpen(true);
  }, []);

  const handleDragEnd = useCallback((dropped: boolean) => {
    if (!openedByDrag.current) return;
    const close = () => {
      openedByDrag.current = false;
      setOpen(false);
    };
    if (dropped) {
      closeTimer.current = window.setTimeout(close, DROP_LINGER_MS);
    } else {
      close();
    }
  }, []);

  const toggleOpen = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    openedByDrag.current = false;
    if (openRef.current) {
      setOpen(false);
      return;
    }
    setSnap(snapPoints[1]);
    setOpen(true);
  }, []);

  const handleOpenChange = useCallback((next: boolean) => {
    window.clearTimeout(closeTimer.current);
    openedByDrag.current = false;
    setOpen(next);
  }, []);

  return (
    <ChordDragProvider
      onDrop={starChord}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4">
        <header className="flex flex-row items-center">
          <h1 className="text-xl mb-2">Ukulele Chords</h1>
          <div className="grow"></div>
          <button
            onClick={toggleOpen}
            className="flex relative h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] dark:text-white"
          >
            <Star className="h-4 w-4" /> Starred ({favsState.length})
            {open ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </header>
        <p className="text-sm text-gray-500 max-w-2xl">
          Diagrams for 108 ukulele chords in standard GCEA tuning. Press{" "}
          <Play className="inline h-3 w-3 align-baseline" aria-label="play" />{" "}
          to hear a chord, or{" "}
          <Star className="inline h-3 w-3 align-baseline" aria-label="star" />{" "}
          to keep it in your starred list.
        </p>
        <AllChords
          chordPlayer={chordPlayer}
          favourites={favsState}
          setFavouries={setFavsState}
        />
        <About />
      </div>
      <FavouritesDrawer
        chordPlayer={chordPlayer}
        favourites={favsState}
        setFavsState={setFavsState}
        open={open}
        onOpenChange={handleOpenChange}
        snap={snap}
        setSnap={setSnap}
      />
    </ChordDragProvider>
  );
}

/** Prose for people and crawlers who want to know what this is. */
function About() {
  return (
    <footer className="p-4 pb-24 text-sm text-gray-500 max-w-2xl space-y-2">
      <h2 className="font-bold text-gray-700">About this chord chart</h2>
      <p>
        Every chord is drawn for a ukulele in standard GCEA (C6) tuning, with
        the strings left to right: G, C, E, A. A dot marks where to press, and
        an O above a string means it is played open. Chords are grouped by root
        note — C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb and B — and each root has
        major, minor, dominant 7th, minor 7th, diminished, augmented, 6th, major
        7th and 9th voicings.
      </p>
      <p>
        Playback uses a sampled ukulele soundfont, so what you hear is a real
        strum. Starred chords are saved in your browser and will be here the
        next time you visit. The chart is free and open source on{" "}
        <a
          className="underline hover:text-gray-700"
          href="https://github.com/mrkev/ukulele-tool"
        >
          GitHub
        </a>
        .
      </p>
    </footer>
  );
}

function FavouritesDrawer({
  chordPlayer,
  favourites,
  setFavsState,
  open,
  onOpenChange,
  snap,
  setSnap,
}: {
  chordPlayer: ChordPlayer;
  favourites: string[];
  setFavsState: (favs: string[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snap: number | string | null;
  setSnap: (snap: number | string | null) => void;
}) {
  const { dropZoneRef, isDragging, isOver, draggingName } = useChordDropZone();
  const expanded = snap !== snapPoints[0];

  // vaul never forwards `modal` to Radix's Dialog.Root, so Radix always mounts a
  // *modal* dialog: it kills pointer events on <body> and marks the rest of the page
  // aria-hidden. vaul only patches that up from inside its own open handler, which a
  // controlled `open` prop never reaches — leaving the page dead and screen-reader
  // invisible behind a drawer that is meant to be non-modal. Undo both.
  useEffect(() => {
    if (!open) return;
    const reviveBackground = () => {
      document.body.style.pointerEvents = "auto";
      document
        .querySelectorAll("[data-aria-hidden='true']")
        .forEach((el) => el.removeAttribute("aria-hidden"));
    };
    reviveBackground();
    const frame = window.requestAnimationFrame(reviveBackground);
    return () => window.cancelAnimationFrame(frame);
  }, [open]);
  const alreadyStarred = draggingName != null && favourites.includes(draggingName);

  const playChord = (chord: ChordDiagram) => {
    const [g, c, e, a] = midiOfChordDiagram(chord);

    chordPlayer.play([
      [g, 100],
      [c, 100],
      [e, 100],
      [a, 100],
    ]);
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      modal={false}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <Drawer.Portal>
        <Drawer.Content
          ref={dropZoneRef}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "bg-white flex flex-col fixed bottom-0 left-0 right-0 h-full max-h-[97%] rounded-t-[10px] border-t-2 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-colors",
            isOver
              ? "border-orange-400 bg-orange-50"
              : isDragging
                ? "border-orange-300 border-dashed"
                : "border-neutral-200"
          )}
        >
          <div
            className={cn(
              "max-w-3xl w-full mx-auto p-4",
              expanded ? "overflow-y-auto" : "overflow-hidden"
            )}
          >
            <Drawer.Handle />
            <div className="flex flex-row items-baseline gap-2 mt-4 mb-2">
              <Drawer.Title className="font-medium text-gray-900">
                Starred Chords
              </Drawer.Title>
              <span className="text-sm text-gray-500">
                {isDragging
                  ? isOver
                    ? alreadyStarred
                      ? `${draggingName} is already starred`
                      : `Release to star ${draggingName}`
                    : "Drop a chord here to star it"
                  : favourites.length > 0
                    ? `${favourites.length} saved`
                    : null}
              </span>
            </div>

            {favourites.length === 0 && !isDragging ? (
              <p className="text-sm text-gray-500 py-6">
                Drag a chord down here — or tap its star — to save it.
              </p>
            ) : (
              <div
                className={cn(
                  "gap-2",
                  expanded
                    ? "grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7"
                    : "flex flex-row overflow-x-auto"
                )}
              >
                {favourites.map((name) => (
                  <div
                    className="h-36 w-24 flex-shrink-0 flex flex-col items-center"
                    key={name}
                  >
                    <UkuleleChord
                      chord={chords[name]}
                      name={name}
                      size={88}
                      className="w-full h-full size-full"
                    />
                    <ButtonGroup variant={"outline"} size={"sm"}>
                      <ButtonGroupItem
                        className="cursor-pointer"
                        onClick={() => playChord(chords[name])}
                        aria-label={`Play ${name}`}
                      >
                        <Play />
                      </ButtonGroupItem>
                      <ButtonGroupItem
                        className="cursor-pointer"
                        onClick={() =>
                          setFavsState(favourites.filter((x) => x !== name))
                        }
                        aria-label={`Unstar ${name}`}
                      >
                        <Star fill="orange" stroke="orange" />
                      </ButtonGroupItem>
                    </ButtonGroup>
                  </div>
                ))}

                {/* Landing slot, so there is somewhere obvious to aim. */}
                {isDragging && !alreadyStarred && (
                  <div
                    className={cn(
                      "h-36 w-24 flex-shrink-0 flex items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                      isOver
                        ? "border-orange-400 bg-orange-100"
                        : "border-gray-300"
                    )}
                  >
                    <Star
                      className="h-6 w-6"
                      fill={isOver ? "orange" : "none"}
                      stroke={isOver ? "orange" : "#9ca3af"}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
