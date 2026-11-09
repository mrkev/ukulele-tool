import {
  ChevronLeft,
  ChevronRight,
  ListMusic,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  useChordSets,
  type ChordSet,
  type ChordSetActions,
} from "@/lib/chordSets";
import { chords } from "./ChordDiagram";
import { CHORD_GRID, ChordCard, PlayStarButtons } from "./ChordCard";
import { ChordPicker } from "./ChordPicker";
import { ButtonGroup, ButtonGroupItem } from "./components/ButtonGroup";
import { ChordPlayer } from "./audio/useChordPlayer";
import { midiOfChordDiagram } from "./midiOfChordDiagram";
import UkuleleChord from "./SVGChordDiagram";

const UNTITLED = "Untitled set";

const countLabel = (n: number) => (n === 1 ? "1 chord" : `${n} chords`);

/** The starred chords' place among the sets' ids. */
const STARRED_ID = "starred";

/**
 * Chords gathered into sets: the starred chords, then the user's own, which
 * they can make, name, fill and put in order. The tab lists them (a grid of
 * cards on wider screens); opening one shows its chords.
 */
export function Sets({
  chordPlayer,
  favourites,
  setFavourites,
  openSetId,
  onOpenSet,
}: {
  chordPlayer: ChordPlayer;
  favourites: string[];
  setFavourites: Dispatch<SetStateAction<string[]>>;
  /** The open set's id, or null for the list. */
  openSetId: string | null;
  onOpenSet: (id: string | null) => void;
}) {
  const [sets, actions] = useChordSets();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pickerId, setPickerId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const starred = useMemo(() => new Set(favourites), [favourites]);

  // Leaving a set, however it happens, finishes editing it.
  const [prevOpenId, setPrevOpenId] = useState(openSetId);
  if (openSetId !== prevOpenId) {
    setPrevOpenId(openSetId);
    if (editingId !== openSetId) setEditingId(null);
  }

  // What the drawer shows: kept while it slides away, even once the set has
  // gone (just deleted) or the drawer has closed.
  const liveSet =
    openSetId === STARRED_ID
      ? { id: STARRED_ID, name: "Starred", chords: favourites }
      : sets.find((s) => s.id === openSetId);
  const [shownSet, setShownSet] = useState<ChordSet | null>(null);
  if (liveSet && liveSet !== shownSet && !sameSet(liveSet, shownSet)) {
    setShownSet(liveSet);
  }

  const play = (name: string) => {
    const [g, c, e, a] = midiOfChordDiagram(chords[name]);
    chordPlayer.play([
      [g, 100],
      [c, 100],
      [e, 100],
      [a, 100],
    ]);
  };

  const toggleStar = (name: string) =>
    setFavourites((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : prev.concat(name)
    );

  const createSet = () => {
    const id = actions.create("New set");
    setEditingId(id);
    onOpenSet(id);
  };

  const finishEditing = (set: ChordSet) => {
    if (set.name.trim() === "") actions.rename(set.id, UNTITLED);
    setEditingId(null);
  };

  const close = () => {
    const open = sets.find((s) => s.id === openSetId);
    if (open && editingId === open.id) finishEditing(open);
    onOpenSet(null);
  };

  return (
    <div className="py-4 sm:px-4">
      <SetList
        sets={[
          { id: STARRED_ID, name: "Starred", chords: favourites },
          ...sets,
        ]}
        onOpen={onOpenSet}
        onCreate={createSet}
      />

      {/* The open set, in a drawer over most of the page. */}
      <Drawer
        open={liveSet != null}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        showSwipeHandle
      >
        <DrawerContent
          // A new set opens with its name ready to type over; others focus
          // the drawer itself, not its first button.
          initialFocus={() => {
            const name =
              shownSet && editingId === shownSet.id
                ? document.getElementById(nameFieldId(shownSet.id))
                : null;
            if (name instanceof HTMLInputElement) {
              name.select();
              return name;
            }
            return scrollRef.current;
          }}
          className="h-[calc(100dvh-2.5rem)] bg-card text-card-foreground [--drawer-bleed-background:var(--card)] data-[swipe-axis=y]:[--drawer-content-max-height:calc(100dvh-2.5rem)]"
        >
          <div
            ref={scrollRef}
            tabIndex={-1}
            className="min-h-0 flex-1 overflow-y-auto outline-none"
          >
            <div className="mx-auto w-full max-w-5xl px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
              {shownSet?.id === STARRED_ID ? (
                <section>
                  <DrawerTitle className="mb-4 flex items-baseline gap-2">
                    <span className="flex items-center gap-1.5 self-center text-lg font-bold">
                      <Star
                        className="size-4 fill-star stroke-star"
                        aria-hidden="true"
                      />
                      Starred
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {countLabel(favourites.length)}
                    </span>
                  </DrawerTitle>
                  {favourites.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No starred chords yet. Tap a chord's star in Ukulele
                      Chords, or drag the chord onto Starred, to add it here.
                    </p>
                  ) : (
                    <div className={CHORD_GRID}>
                      {favourites.map((name) => (
                        <ChordCard
                          key={name}
                          name={name}
                          diagram={chords[name]}
                        >
                          <PlayStarButtons
                            name={name}
                            starred
                            onPlay={() => play(name)}
                            onToggleStar={() => toggleStar(name)}
                          />
                        </ChordCard>
                      ))}
                    </div>
                  )}
                </section>
              ) : shownSet ? (
                <SetSection
                  set={shownSet}
                  actions={actions}
                  editing={editingId === shownSet.id}
                  onEdit={() => setEditingId(shownSet.id)}
                  onDone={() => finishEditing(shownSet)}
                  onAddChords={() => setPickerId(shownSet.id)}
                  onDelete={() => {
                    actions.remove(shownSet.id);
                    onOpenSet(null);
                  }}
                  isStarred={(name) => starred.has(name)}
                  onPlay={play}
                  onToggleStar={toggleStar}
                />
              ) : null}
            </div>
          </div>

          {/* Inside the set's drawer, so it opens as a drawer on top of it. */}
          <ChordPicker
            set={sets.find((s) => s.id === pickerId) ?? null}
            onToggle={(chord) =>
              pickerId && actions.toggleChord(pickerId, chord)
            }
            onClose={() => setPickerId(null)}
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

/** Whether two sets have the same id, name and chords. */
function sameSet(a: ChordSet, b: ChordSet | null) {
  return (
    b != null &&
    a.id === b.id &&
    a.name === b.name &&
    a.chords.length === b.chords.length &&
    a.chords.every((c, i) => c === b.chords[i])
  );
}

/**
 * Every set, to pick one to open: an iOS-style list on phones, a grid of cards
 * previewing their first chords on wider screens.
 */
function SetList({
  sets,
  onOpen,
  onCreate,
}: {
  sets: ChordSet[];
  onOpen: (id: string) => void;
  onCreate: () => void;
}) {
  const icon = (set: ChordSet, className: string) =>
    set.id === STARRED_ID ? (
      <Star
        className={cn(className, "fill-star stroke-star")}
        aria-hidden="true"
      />
    ) : (
      <ListMusic className={className} aria-hidden="true" />
    );

  return (
    <>
      {/* Phones: a list of cards, one per row, styled like the wider
          screens' cards. */}
      <ul className="space-y-3 md:hidden">
        {sets.map((set) => {
          const name = set.name.trim() || UNTITLED;
          return (
            <li key={set.id}>
              <button
                type="button"
                onClick={() => onOpen(set.id)}
                aria-label={`${name}, ${countLabel(set.chords.length)}`}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition-colors hover:bg-accent active:bg-accent"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  {icon(set, "size-4")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {name}
                    </span>
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {countLabel(set.chords.length)}
                    </span>
                  </span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {set.chords.length > 0
                      ? set.chords.join(" · ")
                      : "No chords yet"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={onCreate}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-4 text-sm font-medium text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
          >
            <Plus className="size-4" aria-hidden="true" />
            New set
          </button>
        </li>
      </ul>

      {/* Wider screens: cards. */}
      <div className="hidden grid-cols-2 gap-4 md:grid lg:grid-cols-3">
        {sets.map((set) => {
          const name = set.name.trim() || UNTITLED;
          const preview = set.chords.slice(0, 4);
          const more = set.chords.length - preview.length;
          return (
            <button
              key={set.id}
              type="button"
              onClick={() => onOpen(set.id)}
              aria-label={`${name}, ${countLabel(set.chords.length)}`}
              className="flex cursor-pointer flex-col gap-3 rounded-xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition-colors hover:bg-accent"
            >
              <span className="flex w-full items-center gap-2">
                {icon(set, "size-4 shrink-0")}
                <span className="min-w-0 flex-1 truncate font-medium">
                  {name}
                </span>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {countLabel(set.chords.length)}
                </span>
              </span>
              {/* Same height filled or empty, so the cards line up. */}
              <span
                aria-hidden="true"
                className="grid aspect-[4/1.35] w-full grid-cols-4 items-center gap-2"
              >
                {preview.length === 0 ? (
                  <span className="col-span-4 text-center text-sm text-muted-foreground">
                    No chords yet
                  </span>
                ) : (
                  preview.map((chord, i) => (
                    <span key={chord} className="relative">
                      <UkuleleChord
                        chord={chords[chord]}
                        name={chord}
                        size={100}
                        className="h-auto w-full"
                      />
                      {i === preview.length - 1 && more > 0 && (
                        <span className="absolute inset-0 flex items-center justify-center rounded-md bg-card/80 text-sm font-medium">
                          +{more + 1}
                        </span>
                      )}
                    </span>
                  ))
                )}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={onCreate}
          className="flex min-h-32 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
        >
          <Plus className="size-4" aria-hidden="true" />
          New set
        </button>
      </div>
    </>
  );
}

const nameFieldId = (setId: string) => `set-name-${setId}`;

/**
 * One of the user's sets. Normally its chords play and star like anywhere
 * else; while editing, it can be renamed and deleted, and its chords moved or
 * taken out.
 */
function SetSection({
  set,
  actions,
  editing,
  onEdit,
  onDone,
  onAddChords,
  onDelete,
  isStarred,
  onPlay,
  onToggleStar,
}: {
  set: ChordSet;
  actions: ChordSetActions;
  editing: boolean;
  onEdit: () => void;
  onDone: () => void;
  onAddChords: () => void;
  onDelete: () => void;
  isStarred: (chord: string) => boolean;
  onPlay: (chord: string) => void;
  onToggleStar: (chord: string) => void;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const name = set.name.trim() || UNTITLED;

  return (
    <section aria-label={name}>
      <div className="mb-4 flex items-center gap-2">
        {editing ? (
          <>
            <DrawerTitle className="sr-only">{name}</DrawerTitle>
            <input
              id={nameFieldId(set.id)}
              value={set.name}
              onChange={(e) => actions.rename(set.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              aria-label="Set name"
              placeholder={UNTITLED}
              enterKeyHint="done"
              // 16px or more, or iOS zooms the page in on focus.
              className="min-w-0 flex-1 rounded-md bg-muted px-2 py-1 text-lg font-bold outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </>
        ) : (
          <DrawerTitle className="flex min-w-0 flex-1 items-baseline gap-2">
            <span className="truncate text-lg font-bold">{name}</span>
            <span className="shrink-0 text-sm text-muted-foreground">
              {countLabel(set.chords.length)}
            </span>
          </DrawerTitle>
        )}
        {editing ? (
          <Button size="sm" onClick={onDone}>
            Done
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setConfirmingDelete(false);
              onEdit();
            }}
          >
            <Pencil aria-hidden="true" />
            Edit
          </Button>
        )}
      </div>

      <div className={CHORD_GRID}>
        {set.chords.map((chord, i) =>
          editing ? (
            <div key={chord} className="relative mx-auto w-full max-w-32">
              <ChordCard name={chord} diagram={chords[chord]}>
                <ButtonGroup variant={"outline"} size={"sm"}>
                  <ButtonGroupItem
                    className="cursor-pointer"
                    disabled={i === 0}
                    onClick={() => actions.moveChord(set.id, i, -1)}
                    aria-label={`Move ${chord} earlier`}
                  >
                    <ChevronLeft />
                  </ButtonGroupItem>
                  <ButtonGroupItem
                    className="cursor-pointer"
                    disabled={i === set.chords.length - 1}
                    onClick={() => actions.moveChord(set.id, i, 1)}
                    aria-label={`Move ${chord} later`}
                  >
                    <ChevronRight />
                  </ButtonGroupItem>
                </ButtonGroup>
              </ChordCard>
              <button
                type="button"
                onClick={() => actions.toggleChord(set.id, chord)}
                aria-label={`Remove ${chord} from ${name}`}
                className="absolute top-0 left-0 flex size-7 pointer-coarse:size-8 cursor-pointer items-center justify-center rounded-full bg-destructive text-white shadow-sm"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <ChordCard key={chord} name={chord} diagram={chords[chord]}>
              <PlayStarButtons
                name={chord}
                starred={isStarred(chord)}
                onPlay={() => onPlay(chord)}
                onToggleStar={() => onToggleStar(chord)}
              />
            </ChordCard>
          )
        )}
        {/* Sized like a chord diagram, at the end where new chords go. */}
        <button
          type="button"
          onClick={onAddChords}
          className="mx-auto flex aspect-[100/124] w-full max-w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
        >
          <Plus className="size-5" aria-hidden="true" />
          Add chords
        </button>
      </div>

      {editing && (
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          {confirmingDelete ? (
            <>
              <span>Delete “{name}”? This can't be undone.</span>
              <Button variant="destructive" size="sm" onClick={onDelete}>
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmingDelete(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => setConfirmingDelete(true)}
            >
              <Trash2 aria-hidden="true" />
              Delete set
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
