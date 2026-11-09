import { Play, Star } from "lucide-react";
import type { ReactNode } from "react";
import type { ChordDiagram } from "./ChordDiagram";
import UkuleleChord from "./SVGChordDiagram";
import { ButtonGroup, ButtonGroupItem } from "./components/ButtonGroup";
import { ChordDragHandle } from "./dnd/ChordDrag";

/** A chord's diagram with its play and star buttons, as shown in the chart. */
export function ChordCard({
  name,
  diagram,
  starred,
  onPlay,
  onToggleStar,
  draggable = false,
}: {
  name: string;
  diagram: ChordDiagram;
  starred: boolean;
  onPlay: () => void;
  onToggleStar: () => void;
  /** Whether it can be dragged into the starred drawer. */
  draggable?: boolean;
}) {
  const picture: ReactNode = (
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
    </div>
  );
}

/** The grid chords are laid out in, in the chart and in sets. */
export const CHORD_GRID =
  "grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-x-2 gap-y-6 sm:gap-6";
