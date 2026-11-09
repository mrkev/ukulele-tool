import { Check, ListMusic, Plus, Star } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ChordSet } from "@/lib/chordSets";
import { useChordDrag, useChordDropZone } from "./dnd/chordDragContext";

/** Drop zone ids that aren't one of the user's sets. */
export const STARRED_ZONE = "starred";
export const NEW_SET_ZONE = "new-set";

const UNTITLED = "Untitled set";

/**
 * Slides up from the bottom while a chord is dragged, with a tile for each set
 * to drop it on: starred, the user's own, or a new one. It stays a moment
 * after a drop to show where the chord went.
 */
export function DropTray({
  starred,
  sets,
}: {
  starred: string[];
  sets: ChordSet[];
}) {
  const { drag, lastDrop } = useChordDrag();
  const targets: ChordSet[] = [
    { id: STARRED_ZONE, name: "Starred", chords: starred },
    ...sets,
  ];

  // Whether the chord was already in the zone it was last over, remembered
  // past the drop: by then the set has it either way.
  const [lastOver, setLastOver] = useState<{
    id: string;
    already: boolean;
  } | null>(null);
  if (drag && drag.overId !== (lastOver?.id ?? null)) {
    const target = targets.find((t) => t.id === drag.overId);
    setLastOver(
      drag.overId
        ? { id: drag.overId, already: !!target?.chords.includes(drag.name) }
        : null
    );
  }

  // Keep the last chord's name while the tray slides away.
  const [chord, setChord] = useState<string | null>(null);
  const current = drag?.name ?? lastDrop?.name ?? null;
  if (current && current !== chord) setChord(current);

  const shown = drag != null || lastDrop != null;
  const nameOf = (id: string) =>
    targets.find((t) => t.id === id)?.name.trim() || UNTITLED;

  let message = "";
  if (drag) {
    if (!drag.overId) message = `Drop ${drag.name} on a set`;
    else if (drag.overId === NEW_SET_ZONE)
      message = `Start a new set with ${drag.name}`;
    else if (lastOver?.already)
      message = `${drag.name} is already in ${nameOf(drag.overId)}`;
    else message = `Add ${drag.name} to ${nameOf(drag.overId)}`;
  } else if (lastDrop) {
    if (lastDrop.zoneId === NEW_SET_ZONE)
      message = `Started a new set with ${lastDrop.name}`;
    else if (lastOver?.already)
      message = `${lastDrop.name} was already in ${nameOf(lastDrop.zoneId)}`;
    else message = `Added ${lastDrop.name} to ${nameOf(lastDrop.zoneId)}`;
  }

  return (
    <div
      inert={!shown}
      className={cn(
        "fixed inset-x-0 bottom-0 z-[55] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        shown ? "translate-y-0" : "translate-y-[calc(100%+2rem)]"
      )}
    >
      <div className="mx-auto max-w-3xl rounded-t-2xl border-t border-border bg-card px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] text-card-foreground shadow-[0_-8px_30px_rgba(0,0,0,0.15)] sm:border-x">
        <p className="mb-3 text-sm font-medium" aria-live="polite">
          {message}
        </p>
        <div className="grid max-h-[45dvh] grid-cols-3 gap-2 overflow-hidden sm:grid-cols-4 md:grid-cols-6">
          {targets.map((target) => (
            <DropTile
              key={target.id}
              id={target.id}
              icon={
                target.id === STARRED_ZONE ? (
                  <Star className="size-4 fill-star stroke-star" />
                ) : (
                  <ListMusic className="size-4" />
                )
              }
              title={target.name.trim() || UNTITLED}
              detail={
                chord && target.chords.includes(chord)
                  ? "Already in"
                  : target.chords.length === 1
                    ? "1 chord"
                    : `${target.chords.length} chords`
              }
              already={!!chord && target.chords.includes(chord)}
              landed={lastDrop?.zoneId === target.id}
              landedDetail={lastOver?.already ? "Already in" : "Added"}
            />
          ))}
          <DropTile
            id={NEW_SET_ZONE}
            icon={<Plus className="size-4" />}
            title="New set"
            detail="Start one"
            already={false}
            landed={lastDrop?.zoneId === NEW_SET_ZONE}
            landedDetail="Started"
          />
        </div>
      </div>
    </div>
  );
}

function DropTile({
  id,
  icon,
  title,
  detail,
  already,
  landed,
  landedDetail,
}: {
  id: string;
  icon: ReactNode;
  title: string;
  detail: string;
  /** The dragged chord is in this set already. */
  already: boolean;
  /** The chord was just dropped here. */
  landed: boolean;
  /** What the tile says once the chord has landed. */
  landedDetail: string;
}) {
  const { dropZoneRef, isOver } = useChordDropZone(id);

  return (
    <div
      ref={dropZoneRef}
      className={cn(
        "flex h-20 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl border-2 px-2 text-center text-xs transition-[scale,background-color,border-color,opacity] duration-150",
        landed
          ? "border-star bg-star/15"
          : isOver
            ? already
              ? "border-muted-foreground/40 bg-muted"
              : "scale-105 border-star bg-star/15"
            : already
              ? "border-dashed border-border opacity-50"
              : "border-dashed border-muted-foreground/40"
      )}
    >
      <span aria-hidden="true" className="mb-0.5">
        {landed ? <Check className="size-4 text-star" /> : icon}
      </span>
      <span className="w-full truncate font-medium">{title}</span>
      <span className="text-muted-foreground">
        {landed ? landedDetail : detail}
      </span>
    </div>
  );
}
