import { ChevronDown, ChevronUp, Play, Star } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Tabs } from "@base-ui/react/tabs";
import useLocalStorageState from "use-local-storage-state";
import AllChords from "./AllChords";
import { ChordDiagram, chords } from "./ChordDiagram";
import UkuleleChord from "./SVGChordDiagram";
import { ButtonGroup, ButtonGroupItem } from "./components/ButtonGroup";
import { midiOfChordDiagram } from "./midiOfChordDiagram";
import { ChordPlayer, useChordPlayer } from "./audio/useChordPlayer";
import { ChordDragProvider } from "./dnd/ChordDrag";
import { HeaderSearch } from "./SearchBar";
import { TabBar } from "./TabBar";
import { TABS, type Tab } from "./tabs";
import { About } from "./About";
import { Sets } from "./Sets";
import { SettingsDrawer } from "./SettingsDrawer";
import { DropTray, NEW_SET_ZONE, STARRED_ZONE } from "./DropTray";
import { useChordSets } from "@/lib/chordSets";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useWakeLock } from "@/lib/useWakeLock";
import { useThemeSetting } from "@/lib/theme";
import { useSilentModePlayback } from "@/lib/silentModePlayback";

/** Resting heights of the starred drawer: a row of chords, a few rows, all. */
const snapPoints = ["212px", "440px", 1];

export function App() {
  const chordPlayer = useChordPlayer();
  const [favsState, setFavsState] = useLocalStorageState<string[]>(
    "ukulele-tool.favourite-chords",
    { defaultValue: [] }
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  /** The set open in the Sets tab; null shows the list of sets. */
  const [openSetId, setOpenSetId] = useState<string | null>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrolled = useScrolled();
  useStickyTop(stickyRef);
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  // The starred drawer is where you read chords while playing, so keep the
  // screen on while it's open.
  useWakeLock(open);
  const [theme, setTheme] = useThemeSetting();
  const [silentModePlayback, setSilentModePlayback] = useSilentModePlayback();

  const [sets, setActions] = useChordSets();

  const handleDrop = useCallback(
    (name: string, zoneId: string) => {
      if (zoneId === STARRED_ZONE) {
        setFavsState((prev) =>
          prev.includes(name) ? prev : prev.concat(name)
        );
      } else if (zoneId === NEW_SET_ZONE) {
        setActions.create("New set", [name]);
      } else {
        setActions.addChord(zoneId, name);
      }
    },
    [setFavsState, setActions]
  );

  const toggleOpen = useCallback(() => {
    if (open) {
      setOpen(false);
      return;
    }
    setSnap(snapPoints[1]);
    setOpen(true);
  }, [open]);

  /**
   * Brings the top of the current view back into sight. It starts just below
   * the sticky header, so that's the top of the page.
   */
  const scrollToTop = useCallback(() => {
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleQueryChange = useCallback(
    (next: string) => {
      setQuery(next);
      // Search finds chords in the chart, so typing goes back to it.
      if (next.trim() !== "") setTab("all");
      // Results start at the top of the chart.
      scrollToTop();
    },
    [scrollToTop]
  );

  const handleTabChange = useCallback(
    (next: Tab) => {
      // Like iOS: picking the tab you're on goes back to its top level.
      if (next === tab && next === "sets") setOpenSetId(null);
      setTab(next);
      // Each view starts at its top.
      scrollToTop();
    },
    [tab, scrollToTop]
  );

  const handleOpenSet = useCallback(
    (id: string | null) => {
      setOpenSetId(id);
      scrollToTop();
    },
    [scrollToTop]
  );

  return (
    <ChordDragProvider onDrop={handleDrop}>
      {/* Bottom padding keeps the last row clear of the phone's floating tab
          bar. Wider screens have tabs and search at the top instead. */}
      <div className="p-4 pb-[calc(env(safe-area-inset-bottom)+6rem)] md:pb-4">
        <Tabs.Root
          value={tab}
          onValueChange={(value) => handleTabChange(value as Tab)}
        >
          {/* Stays at the top while the page scrolls. Its height is kept in
              --sticky-top, for what sticks or scrolls to just below it. */}
          <div
            ref={stickyRef}
            className={cn(
              "sticky top-0 z-30 -mx-4 -mt-4 border-b border-transparent bg-background/80 px-4 pt-3 pb-3 backdrop-blur-md transition-colors md:pb-0",
              // A hairline once content scrolls under it; on wider screens the
              // tabs' own underline does this.
              scrolled && "max-md:border-border"
            )}
          >
            <header className="flex flex-row items-center gap-2">
              <h1 className="text-xl">Ukulele Chords</h1>
              <div className="grow"></div>
              <HeaderSearch value={query} onChange={handleQueryChange} />
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
            {/* Wider screens' tabs. Phones use the tab bar at the bottom. */}
            <Tabs.List className="mt-3 hidden gap-6 border-b border-border px-4 md:flex">
              {TABS.map(({ value, label }) => (
                <Tabs.Tab
                  key={value}
                  value={value}
                  // Picking the current tab doesn't change the value; still
                  // let it go back to the tab's top level.
                  onClick={() => {
                    if (value === tab) handleTabChange(value);
                  }}
                  className="-mb-px cursor-pointer border-b-2 border-transparent py-2.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground focus-visible:underline data-active:border-foreground data-active:text-foreground"
                >
                  {label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </div>
          <div>
            <Tabs.Panel value="all" className="outline-none">
              <AllChords
                chordPlayer={chordPlayer}
                favourites={favsState}
                setFavouries={setFavsState}
                query={query}
              />
            </Tabs.Panel>
            <Tabs.Panel value="sets" className="outline-none">
              <Sets
                chordPlayer={chordPlayer}
                favourites={favsState}
                setFavourites={setFavsState}
                openSetId={openSetId}
                onOpenSet={handleOpenSet}
              />
            </Tabs.Panel>
          </div>
        </Tabs.Root>
        <About />
      </div>
      <TabBar
        tab={tab}
        onTabChange={handleTabChange}
        query={query}
        onQueryChange={handleQueryChange}
      />
      <FavouritesDrawer
        chordPlayer={chordPlayer}
        favourites={favsState}
        setFavsState={setFavsState}
        open={open}
        onOpenChange={setOpen}
        snap={snap}
        setSnap={setSnap}
      />
      <DropTray starred={favsState} sets={sets} />
    </ChordDragProvider>
  );
}

/** Whether the page is scrolled down at all. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return scrolled;
}

/**
 * Keeps --sticky-top on <html> at the sticky header's height, for the chart's
 * root headings to stick below it and for jumps to sections to land below it.
 */
function useStickyTop(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        "--sticky-top",
        `${el.offsetHeight}px`
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
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
  const expanded = snap !== snapPoints[0];

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
      // The chart stays usable behind it: play and star chords.
      modal={false}
      disablePointerDismissal
      snapPoints={snapPoints}
      snapPoint={snap}
      onSnapPointChange={setSnap}
      showSwipeHandle
    >
      <DrawerContent
        swipeFromContent
        // Opening it must not pull focus (and the keyboard) away from the page.
        initialFocus={false}
        finalFocus={false}
        className="border-t-2 border-border bg-card text-card-foreground shadow-[0_-8px_30px_rgba(0,0,0,0.12)] [--drawer-bleed-background:var(--card)]"
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
              {favourites.length > 0 ? `${favourites.length} saved` : null}
            </span>
          </div>

          {favourites.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6">
              Tap a chord's star to save it here, or drag the chord onto
              Starred.
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
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
