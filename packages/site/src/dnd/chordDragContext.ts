// The drag state shared between <ChordDragProvider> and the pieces that read it.
// Kept apart from ChordDrag.tsx so that file exports only components and stays
// fast-refreshable.
import { createContext, use, type PointerEvent as ReactPointerEvent } from "react";

import type { ChordDiagram } from "../ChordDiagram";

export type Drag = {
  name: string;
  diagram: ChordDiagram;
  /** Viewport coords of the pointer. */
  x: number;
  y: number;
  /** Pointer is currently inside the drop zone. */
  over: boolean;
};

type ChordDragContextValue = {
  drag: Drag | null;
  setDropZone: (el: HTMLElement | null) => void;
  startDrag: (
    e: ReactPointerEvent,
    name: string,
    diagram: ChordDiagram
  ) => void;
};

export const ChordDragContext = createContext<ChordDragContextValue | null>(null);

export function useChordDragContext() {
  const ctx = use(ChordDragContext);
  if (!ctx) {
    throw new Error("Chord drag components must be inside <ChordDragProvider>");
  }
  return ctx;
}

/** Marks an element as the target chords can be dropped on. */
export function useChordDropZone() {
  const { drag, setDropZone } = useChordDragContext();
  return {
    dropZoneRef: setDropZone,
    isDragging: drag != null,
    isOver: drag?.over ?? false,
    draggingName: drag?.name ?? null,
  };
}
