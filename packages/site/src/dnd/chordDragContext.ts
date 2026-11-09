// The drag state shared between <ChordDragProvider> and the pieces that read it.
// Kept apart from ChordDrag.tsx so that file exports only components and stays
// fast-refreshable.
import {
  createContext,
  use,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { ChordDiagram } from "../ChordDiagram";

export type Drag = {
  name: string;
  diagram: ChordDiagram;
  /** Viewport coords of the pointer. */
  x: number;
  y: number;
  /** The drop zone under the pointer, if any. */
  overId: string | null;
};

/** The last chord dropped, kept briefly so its drop zone can confirm it. */
export type Drop = { name: string; zoneId: string };

type ChordDragContextValue = {
  drag: Drag | null;
  lastDrop: Drop | null;
  setDropZone: (id: string, el: HTMLElement | null) => void;
  startDrag: (
    e: ReactPointerEvent,
    name: string,
    diagram: ChordDiagram
  ) => void;
};

export const ChordDragContext = createContext<ChordDragContextValue | null>(
  null
);

export function useChordDragContext() {
  const ctx = use(ChordDragContext);
  if (!ctx) {
    throw new Error("Chord drag components must be inside <ChordDragProvider>");
  }
  return ctx;
}

/** The drag in progress, if any, and the drop that just finished. */
export function useChordDrag() {
  const { drag, lastDrop } = useChordDragContext();
  return { drag, lastDrop };
}

/** Makes an element a target chords can be dropped on, known by `id`. */
export function useChordDropZone(id: string) {
  const { drag, setDropZone } = useChordDragContext();
  const dropZoneRef = useCallback(
    (el: HTMLElement | null) => setDropZone(id, el),
    [id, setDropZone]
  );
  return { dropZoneRef, isOver: drag?.overId === id };
}
