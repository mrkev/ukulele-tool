import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import type { ChordDiagram } from "../ChordDiagram";
import UkuleleChord from "../SVGChordDiagram";
import { ChordDragContext, useChordDragContext, type Drag } from "./chordDragContext";

/** Movement (px) before a mouse press becomes a drag instead of a click. */
const MOUSE_THRESHOLD = 6;
/** Hold (ms) before a touch becomes a drag, so taps and page scrolls still work. */
const TOUCH_HOLD_MS = 250;
/** Movement (px) during the hold that cancels it — the finger is scrolling, not dragging. */
const TOUCH_HOLD_TOLERANCE = 10;

export function ChordDragProvider({
  onDrop,
  onDragStart,
  onDragEnd,
  children,
}: {
  /** Called with the chord name when it is released over the drop zone. */
  onDrop: (name: string) => void;
  /** Called once a press has actually turned into a drag — not on every press. */
  onDragStart?: () => void;
  /** Called when that drag finishes, telling you whether it landed on the drop zone. */
  onDragEnd?: (dropped: boolean) => void;
  children: ReactNode;
}) {
  const [drag, setDrag] = useState<Drag | null>(null);
  const dropZoneRef = useRef<HTMLElement | null>(null);

  const onDropRef = useRef(onDrop);
  const onDragStartRef = useRef(onDragStart);
  const onDragEndRef = useRef(onDragEnd);
  useEffect(() => {
    onDropRef.current = onDrop;
    onDragStartRef.current = onDragStart;
    onDragEndRef.current = onDragEnd;
  }, [onDrop, onDragStart, onDragEnd]);

  const setDropZone = useCallback((el: HTMLElement | null) => {
    dropZoneRef.current = el;
  }, []);

  const isOverDropZone = useCallback((x: number, y: number) => {
    const el = dropZoneRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }, []);

  const startDrag = useCallback(
    (e: ReactPointerEvent, name: string, diagram: ChordDiagram) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      // The card's own play/star buttons keep their normal click behaviour.
      if ((e.target as HTMLElement).closest("button")) return;

      const { pointerId } = e;
      const origin = { x: e.clientX, y: e.clientY };
      const isTouch = e.pointerType !== "mouse";
      let started = false;
      let holdTimer: number | undefined;

      const cleanup = () => {
        window.clearTimeout(holdTimer);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        document.removeEventListener("touchmove", blockScroll);
        setDrag(null);
      };

      // Promotes the press to a real drag. Announced so the drop zone can reveal itself.
      function begin(x: number, y: number) {
        started = true;
        onDragStartRef.current?.();
        track(x, y);
      }

      function track(x: number, y: number) {
        setDrag({ name, diagram, x, y, over: isOverDropZone(x, y) });
      }

      function onMove(ev: PointerEvent) {
        if (ev.pointerId !== pointerId) return;

        if (!started) {
          const dist = Math.hypot(ev.clientX - origin.x, ev.clientY - origin.y);
          if (isTouch) {
            // Moved before the hold elapsed — treat it as a scroll and bail out.
            if (dist > TOUCH_HOLD_TOLERANCE) cleanup();
            return;
          }
          if (dist < MOUSE_THRESHOLD) return;
          begin(ev.clientX, ev.clientY);
          return;
        }

        track(ev.clientX, ev.clientY);
      }

      function onUp(ev: PointerEvent) {
        if (ev.pointerId !== pointerId) return;
        const dropped = started && isOverDropZone(ev.clientX, ev.clientY);
        if (dropped) onDropRef.current(name);
        finish(dropped);
      }

      function onCancel(ev: PointerEvent) {
        if (ev.pointerId === pointerId) finish(false);
      }

      function finish(dropped: boolean) {
        const wasDragging = started;
        cleanup();
        if (wasDragging) onDragEndRef.current?.(dropped);
      }

      // Once a touch drag is underway the page must not scroll out from under it.
      // Registered up front (non-passive) so the very first move can be blocked.
      function blockScroll(ev: TouchEvent) {
        if (started) ev.preventDefault();
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
      document.addEventListener("touchmove", blockScroll, { passive: false });

      if (isTouch) {
        holdTimer = window.setTimeout(() => begin(origin.x, origin.y), TOUCH_HOLD_MS);
      }
    },
    [isOverDropZone]
  );

  // Keep the page from selecting text under the cursor mid-drag.
  const isDragging = drag != null;
  useEffect(() => {
    if (!isDragging) return;
    const { body } = document;
    const previous = body.style.userSelect;
    body.style.userSelect = "none";
    return () => {
      body.style.userSelect = previous;
    };
  }, [isDragging]);

  return (
    <ChordDragContext value={{ drag, setDropZone, startDrag }}>
      {children}
      <ChordDragGhost drag={drag} />
    </ChordDragContext>
  );
}

/** The chord that follows the pointer. Lives on <body> so no ancestor can clip it. */
function ChordDragGhost({ drag }: { drag: Drag | null }) {
  if (!drag) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2"
      style={{ left: drag.x, top: drag.y }}
    >
      <div
        className={cn(
          "rounded-xl border-2 bg-white p-1 shadow-xl transition-transform",
          drag.over
            ? "scale-110 border-orange-400 ring-4 ring-orange-200"
            : "scale-100 rotate-3 border-neutral-300"
        )}
      >
        <UkuleleChord chord={drag.diagram} name={drag.name} size={96} />
      </div>
    </div>,
    document.body
  );
}

/**
 * Wraps the part of a chord card that can be picked up. Mouse drags start after a
 * few pixels of movement; touch drags start after a short hold, so the page stays
 * scrollable.
 */
export function ChordDragHandle({
  name,
  diagram,
  className,
  children,
}: {
  name: string;
  diagram: ChordDiagram;
  className?: string;
  children: ReactNode;
}) {
  const { drag, startDrag } = useChordDragContext();
  const isDragging = drag?.name === name;

  return (
    <div
      onPointerDown={(e) => startDrag(e, name, diagram)}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "cursor-grab touch-auto select-none [-webkit-touch-callout:none] active:cursor-grabbing",
        isDragging && "opacity-30",
        className
      )}
    >
      {children}
    </div>
  );
}
