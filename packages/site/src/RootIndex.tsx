import { useEffect, useRef, useState, type PointerEvent } from "react";

import { cn } from "@/lib/utils";
import { sectionId } from "./sections";

/**
 * How far below the sticky header (see --sticky-top) a section must reach to
 * count as current.
 */
const ACTIVE_MARGIN = 24;

function activeOffset() {
  const stickyTop = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--sticky-top")
  );
  return (Number.isNaN(stickyTop) ? 72 : stickyTop) + ACTIVE_MARGIN;
}

/**
 * A vertical index of chord roots down the right edge, like the A–Z strip in a
 * phone's contacts list. Tap a root to jump to it, or press and slide along the
 * strip to scrub through sections; the root you're scrolled to stays highlighted,
 * so it doubles as a scrollbar.
 *
 * Each root is still a plain link, so it works before hydration and from the
 * keyboard; pointer scrubbing is layered on top.
 */
export function RootIndex({ roots }: { roots: string[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [scrolledRoot, setScrolledRoot] = useState(roots[0]);
  /** Index under the pointer while scrubbing, null otherwise. */
  const [scrubIndex, setScrubIndex] = useState<number | null>(null);
  const scrubIndexRef = useRef<number | null>(null);

  // Track which section is on screen, the way a scrollbar tracks position.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      const offset = activeOffset();
      let current = roots[0];
      for (const root of roots) {
        const el = document.getElementById(sectionId(root));
        if (el && (atBottom || el.getBoundingClientRect().top <= offset)) {
          current = root;
        }
      }
      setScrolledRoot(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [roots]);

  const scrubTo = (clientY: number) => {
    const list = listRef.current;
    if (!list) return;
    const rect = list.getBoundingClientRect();
    const fraction = (clientY - rect.top) / rect.height;
    const index = Math.min(
      roots.length - 1,
      Math.max(0, Math.floor(fraction * roots.length))
    );
    if (index === scrubIndexRef.current) return;
    scrubIndexRef.current = index;
    setScrubIndex(index);
    document
      .getElementById(sectionId(roots[index]))
      ?.scrollIntoView({ block: "start", behavior: "instant" });
    // A tick per section, where supported (Android; iOS ignores it).
    navigator.vibrate?.(8);
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // Keep receiving moves when the finger drifts off the strip.
    e.currentTarget.setPointerCapture(e.pointerId);
    scrubIndexRef.current = null;
    scrubTo(e.clientY);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (scrubIndexRef.current !== null) scrubTo(e.clientY);
  };

  const endScrub = () => {
    scrubIndexRef.current = null;
    setScrubIndex(null);
  };

  const activeRoot = scrubIndex !== null ? roots[scrubIndex] : scrolledRoot;

  return (
    <nav
      aria-label="Chord roots"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endScrub}
      onPointerCancel={endScrub}
      className={cn(
        // Inset on wide screens, clear of thick desktop scrollbars.
        "fixed right-0 lg:right-4 top-1/2 z-10 w-7 -translate-y-1/2 touch-none select-none rounded-l-xl lg:rounded-xl py-2 transition-colors",
        scrubIndex !== null && "bg-muted/90"
      )}
    >
      <ol ref={listRef} className="flex h-[min(360px,70dvh)] flex-col">
        {roots.map((root) => {
          const active = root === activeRoot;
          return (
            <li key={root} className="relative flex flex-1">
              <a
                href={`#${sectionId(root)}`}
                // Otherwise a mouse drag starts a native link drag and cancels the scrub.
                draggable={false}
                aria-current={active ? "location" : undefined}
                // The pointer handlers above already jumped; a mouse/touch click
                // must not jump again. Keyboard activation (detail 0) still does.
                onClick={(e) => {
                  if (e.detail > 0) e.preventDefault();
                }}
                className={cn(
                  "flex w-full items-center justify-center text-[11px] font-semibold",
                  active ? "text-star" : "text-muted-foreground"
                )}
              >
                {root}
              </a>
              {/* Big readout beside the finger, which covers the letter itself. */}
              {scrubIndex !== null && active && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-full top-1/2 mr-4 flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-xl font-semibold text-background shadow-lg"
                >
                  {root}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
