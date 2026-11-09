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
import {
  ChordDragContext,
  useChordDragContext,
  type Drag,
  type Drop,
} from "./chordDragContext";

/** How long a drop stays in `lastDrop`, for its zone to show it landing. */
const DROP_LINGER_MS = 900;

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
  /** Called with the chord name and the drop zone's id when it lands on one. */
  onDrop: (name: string, zoneId: string) => void;
  /** Called once a press has actually turned into a drag — not on every press. */
  onDragStart?: () => void;
  /** Called when that drag finishes, telling you whether it landed on a drop zone. */
  onDragEnd?: (dropped: boolean) => void;
  children: ReactNode;
}) {
  const [drag, setDrag] = useState<Drag | null>(null);
  const [lastDrop, setLastDrop] = useState<Drop | null>(null);
  const dropZones = useRef(new Map<string, HTMLElement>());
  const lingerTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(lingerTimer.current), []);

  const onDropRef = useRef(onDrop);
  const onDragStartRef = useRef(onDragStart);
  const onDragEndRef = useRef(onDragEnd);
  useEffect(() => {
    onDropRef.current = onDrop;
    onDragStartRef.current = onDragStart;
    onDragEndRef.current = onDragEnd;
  }, [onDrop, onDragStart, onDragEnd]);

  const setDropZone = useCallback((id: string, el: HTMLElement | null) => {
    if (el) dropZones.current.set(id, el);
    else dropZones.current.delete(id);
  }, []);

  /** The id of the drop zone at a point, if any. */
  const dropZoneAt = useCallback((x: number, y: number) => {
    for (const [id, el] of dropZones.current) {
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return id;
    }
    return null;
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

      // Promotes the press to a real drag. Announced so drop zones can reveal themselves.
      function begin(x: number, y: number) {
        started = true;
        window.clearTimeout(lingerTimer.current);
        setLastDrop(null);
        onDragStartRef.current?.();
        track(x, y);
      }

      function track(x: number, y: number) {
        setDrag({ name, diagram, x, y, overId: dropZoneAt(x, y) });
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
        const zoneId = started ? dropZoneAt(ev.clientX, ev.clientY) : null;
        if (zoneId) {
          onDropRef.current(name, zoneId);
          window.clearTimeout(lingerTimer.current);
          setLastDrop({ name, zoneId });
          lingerTimer.current = window.setTimeout(
            () => setLastDrop(null),
            DROP_LINGER_MS
          );
        }
        finish(zoneId != null);
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
        holdTimer = window.setTimeout(
          () => begin(origin.x, origin.y),
          TOUCH_HOLD_MS
        );
      }
    },
    [dropZoneAt]
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
    <ChordDragContext value={{ drag, lastDrop, setDropZone, startDrag }}>
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
      className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-1/2"
      style={{ left: drag.x, top: drag.y }}
    >
      <div
        className={cn(
          "rounded-xl border-2 bg-card p-1 text-card-foreground shadow-xl transition-transform",
          drag.overId
            ? "scale-110 border-star ring-4 ring-star/30"
            : "scale-100 rotate-3 border-border"
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
  // Pressed down on, before or during a drag: sinks slightly, as a hint that
  // the chord can be picked up.
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onPointerDown={(e) => {
        startDrag(e, name, diagram);
        if (e.pointerType === "mouse" && e.button !== 0) return;
        setPressed(true);
        const release = () => {
          setPressed(false);
          window.removeEventListener("pointerup", release);
          window.removeEventListener("pointercancel", release);
        };
        window.addEventListener("pointerup", release);
        window.addEventListener("pointercancel", release);
      }}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "cursor-grab touch-auto select-none rounded-lg transition-[scale,background-color] duration-150 ease-out [-webkit-touch-callout:none] active:cursor-grabbing",
        // The short delay keeps a finger that is only starting to scroll the
        // page from flashing the style: scrolling cancels the press first.
        pressed && "scale-95 bg-muted/60 delay-75",
        isDragging && "opacity-30",
        className
      )}
    >
      {children}
    </div>
  );
}
