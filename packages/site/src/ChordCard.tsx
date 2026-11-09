import { Play, Star } from "lucide-react";
import type { ReactNode } from "react";
import type { ChordDiagram } from "./ChordDiagram";
import UkuleleChord from "./SVGChordDiagram";
import { ButtonGroup, ButtonGroupItem } from "./components/ButtonGroup";
import { ChordDragHandle } from "./dnd/ChordDrag";

/** A chord's diagram with its buttons under it, as shown in the chart. */
export function ChordCard({
  name,
  diagram,
  draggable = false,
  children,
}: {
  name: string;
  diagram: ChordDiagram;
  /** Whether it can be dragged into the starred drawer. */
  draggable?: boolean;
  /** The buttons; usually <PlayStarButtons>. */
  children: ReactNode;
}) {
  const picture = (
    <UkuleleChord
      chord={diagram}
      name={name}
      size={100}
      className="w-full h-auto"
    />
  );

  return (
    // Shrinks with its column on narrow phones; 128px at most.
    <div className="w-full max-w-32 mx-auto flex flex-col items-center">
      {draggable ? (
        <ChordDragHandle name={name} diagram={diagram} className="w-full">
          {picture}
        </ChordDragHandle>
      ) : (
        <div className="w-full">{picture}</div>
      )}
      {children}
    </div>
  );
}

/** The usual buttons under a chord: play it, and star or unstar it. */
export function PlayStarButtons({
  name,
  starred,
  onPlay,
  onToggleStar,
}: {
  name: string;
  starred: boolean;
  onPlay: () => void;
  onToggleStar: () => void;
}) {
  return (
    <ButtonGroup variant={"outline"} size={"sm"}>
      <ButtonGroupItem
        className="cursor-pointer"
        onClick={onPlay}
        aria-label={`Play ${name}`}
      >
        <Play />
      </ButtonGroupItem>
      <ButtonGroupItem
        className="cursor-pointer"
        onClick={onToggleStar}
        aria-label={starred ? `Unstar ${name}` : `Star ${name}`}
        aria-pressed={starred}
      >
        <Star className={starred ? "fill-star stroke-star" : undefined} />
      </ButtonGroupItem>
    </ButtonGroup>
  );
}

/** The grid chords are laid out in, in the chart and in sets. */
export const CHORD_GRID =
  "grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-x-2 gap-y-6 sm:gap-6";
