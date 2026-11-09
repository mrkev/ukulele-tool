import { ChevronDown, ChevronUp, Play, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import AllChords from "./AllChords";
import { ChordDiagram, chords } from "./ChordDiagram";
import UkuleleChord from "./SVGChordDiagram";
import { ButtonGroup, ButtonGroupItem } from "./components/ButtonGroup";
import { midiOfChordDiagram } from "./midiOfChordDiagram";
import { ChordPlayer, useChordPlayer } from "./audio/useChordPlayer";
import { ChordDragProvider } from "./dnd/ChordDrag";
import { SearchBar } from "./SearchBar";
import { About } from "./About";
import { SettingsDrawer } from "./SettingsDrawer";
import { useChordDropZone } from "./dnd/chordDragContext";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useWakeLock } from "@/lib/useWakeLock";
import { useThemeSetting } from "@/lib/theme";
import { useSilentModePlayback } from "@/lib/silentModePlayback";

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
  const [query, setQuery] = useState("");
  const chartRef = useRef<HTMLDivElement>(null);
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  // The starred drawer is where you read chords while playing, so keep the
  // screen on while it's open.
  useWakeLock(open);
  const [theme, setTheme] = useThemeSetting();
  const [silentModePlayback, setSilentModePlayback] = useSilentModePlayback();

  // Whether the drawer is on screen only because a drag is in progress. If the user
  // opened it themselves, a drag must not take it away again afterwards.
  const openedByDragRef = useRef(false);
  const openRef = useRef(open);
  const closeTimerRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  useEffect(() => () => window.clearTimeout(closeTimerRef.current), []);

  const starChord = useCallback(
    (name: string) => {
      setFavsState((prev) => (prev.includes(name) ? prev : prev.concat(name)));
    },
    [setFavsState]
  );

  const handleDragStart = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    if (openRef.current) return;
    openedByDragRef.current = true;
    setSnap(snapPoints[0]);
    setOpen(true);
  }, []);

  const handleDragEnd = useCallback((dropped: boolean) => {
    if (!openedByDragRef.current) return;
    const close = () => {
      openedByDragRef.current = false;
      setOpen(false);
    };
    if (dropped) {
      closeTimerRef.current = window.setTimeout(close, DROP_LINGER_MS);
    } else {
      close();
    }
  }, []);

  const toggleOpen = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    openedByDragRef.current = false;
    if (openRef.current) {
      setOpen(false);
      return;
    }
    setSnap(snapPoints[1]);
    setOpen(true);
  }, []);

  const handleQueryChange = useCallback((next: string) => {
    setQuery(next);
    // Results start at the top of the chart; bring it back if scrolled past.
    const chart = chartRef.current;
    if (chart && chart.getBoundingClientRect().top < 0) {
      chart.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, []);

  const handleOpenChange = useCallback((next: boolean) => {
    window.clearTimeout(closeTimerRef.current);
    openedByDragRef.current = false;
    setOpen(next);
  }, []);

  return (
    <ChordDragProvider
      onDrop={starChord}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Bottom padding keeps the last row clear of the floating search bar. */}
      <div className="p-4 pb-[calc(env(safe-area-inset-bottom)+6rem)]">
        <header className="flex flex-row items-center gap-2">
          <h1 className="text-xl">Ukulele Chords</h1>
          <div className="grow"></div>
          <SettingsDrawer
            theme={theme}
            setTheme={setTheme}
            silentModePlayback={silentModePlayback}
            setSilentModePlayback={setSilentModePlayback}
          />
          <button
            onClick={toggleOpen}
            className="flex relative h-10 pointer-coarse:h-11 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-card px-4 text-sm font-medium text-card-foreground shadow-sm transition-all hover:bg-accent dark:ring-1 dark:ring-border"
          >
            <Star className="h-4 w-4" />
            {/* Just the count on phones, so the header fits on one line. */}
            <span>
              <span className="max-sm:sr-only">Starred (</span>
              {favsState.length}
              <span className="max-sm:sr-only">)</span>
            </span>
            {open ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </header>
        <div ref={chartRef} className="scroll-mt-2">
          <AllChords
            chordPlayer={chordPlayer}
            favourites={favsState}
            setFavouries={setFavsState}
            query={query}
          />
        </div>
        <About />
      </div>
      <SearchBar value={query} onChange={handleQueryChange} />
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

  const alreadyStarred =
    draggingName != null && favourites.includes(draggingName);

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
    <Drawer
      open={open}
      onOpenChange={(next) => onOpenChange(next)}
      // The chart stays usable behind it: play, star and drag chords in.
      modal={false}
      disablePointerDismissal
      snapPoints={snapPoints}
      snapPoint={snap}
      onSnapPointChange={setSnap}
      showSwipeHandle
    >
      <DrawerContent
        ref={dropZoneRef}
        swipeFromContent
        // Opening it must not pull focus (and the keyboard) away from the page.
        initialFocus={false}
        finalFocus={false}
        className={cn(
          "bg-card text-card-foreground [--drawer-bleed-background:var(--card)] border-t-2 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]",
          isOver
            ? // Tint mixed into the card colour: the drawer must stay opaque.
              "border-star bg-[color-mix(in_oklab,var(--star)_12%,var(--card))]"
            : isDragging
              ? "border-star/60 border-dashed"
              : "border-border"
        )}
      >
        <div
          className={cn(
            "max-w-3xl w-full mx-auto p-4 pt-2",
            expanded ? "overflow-y-auto" : "overflow-hidden"
          )}
        >
          <div className="flex flex-row items-baseline gap-2 mb-2">
            <DrawerTitle>Starred Chords</DrawerTitle>
            <span className="text-sm text-muted-foreground">
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
            <p className="text-sm text-muted-foreground py-6">
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
                  className={cn(
                    "flex flex-col items-center",
                    expanded ? "w-full max-w-24 mx-auto" : "w-24 shrink-0"
                  )}
                  key={name}
                >
                  <UkuleleChord
                    chord={chords[name]}
                    name={name}
                    size={88}
                    className="w-full h-auto"
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
                      <Star className="fill-star stroke-star" />
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
                      ? "border-star bg-star/15"
                      : "border-muted-foreground/40"
                  )}
                >
                  <Star
                    className={cn(
                      "h-6 w-6",
                      isOver
                        ? "fill-star stroke-star"
                        : "stroke-muted-foreground"
                    )}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
