import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
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

const UNTITLED = "Untitled set";

const countLabel = (n: number) => (n === 1 ? "1 chord" : `${n} chords`);

/**
 * Chords gathered into sets, one section each: the starred chords first, then
 * the user's own sets, which they can make, name, fill and put in order.
 */
export function Sets({
  chordPlayer,
  favourites,
  setFavourites,
}: {
  chordPlayer: ChordPlayer;
  favourites: string[];
  setFavourites: Dispatch<SetStateAction<string[]>>;
}) {
  const [sets, actions] = useChordSets();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pickerId, setPickerId] = useState<string | null>(null);
  const starred = useMemo(() => new Set(favourites), [favourites]);

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
    let id = "";
    // Render the new set now, so its name field can be focused while still
    // handling the tap: iOS only raises the keyboard for focus during a gesture.
    // eslint-disable-next-line @eslint-react/dom-no-flush-sync
    flushSync(() => {
      id = actions.create("New set");
      setEditingId(id);
    });
    const name = document.getElementById(nameFieldId(id));
    if (name instanceof HTMLInputElement) name.select();
  };

  const finishEditing = (set: ChordSet) => {
    if (set.name.trim() === "") actions.rename(set.id, UNTITLED);
    setEditingId(null);
  };

  return (
    <div className="space-y-10 py-4 sm:px-4">
      <section>
        <h2 className="mb-4 flex items-baseline gap-2">
          <span className="flex items-center gap-1.5 self-center text-lg font-bold">
            <Star className="size-4 fill-star stroke-star" aria-hidden="true" />
            Starred
          </span>
          <span className="text-sm text-muted-foreground">
            {countLabel(favourites.length)}
          </span>
        </h2>
        {favourites.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No starred chords yet. Tap a chord's star in All chords, or drag it
            into the starred drawer, to add it here.
          </p>
        ) : (
          <div className={CHORD_GRID}>
            {favourites.map((name) => (
              <ChordCard key={name} name={name} diagram={chords[name]}>
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

      {sets.map((set) => (
        <SetSection
          key={set.id}
          set={set}
          actions={actions}
          editing={editingId === set.id}
          onEdit={() => setEditingId(set.id)}
          onDone={() => finishEditing(set)}
          onAddChords={() => setPickerId(set.id)}
          isStarred={(name) => starred.has(name)}
          onPlay={play}
          onToggleStar={toggleStar}
        />
      ))}

      <button
        type="button"
        onClick={createSet}
        className="flex h-20 w-full max-w-xs cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
      >
        <Plus className="size-4" aria-hidden="true" />
        New set
      </button>

      <ChordPicker
        set={sets.find((s) => s.id === pickerId) ?? null}
        onToggle={(chord) => pickerId && actions.toggleChord(pickerId, chord)}
        onClose={() => setPickerId(null)}
      />
    </div>
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
        ) : (
          <h2 className="flex min-w-0 flex-1 items-baseline gap-2">
            <span className="truncate text-lg font-bold">{name}</span>
            <span className="shrink-0 text-sm text-muted-foreground">
              {countLabel(set.chords.length)}
            </span>
          </h2>
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
              <Button
                variant="destructive"
                size="sm"
                onClick={() => actions.remove(set.id)}
              >
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
