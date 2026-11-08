import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * A floating search field at the bottom of the screen, in thumb reach, styled
 * after iOS: a frosted-glass pill over a soft blurred band, so the chart reads
 * as scrolling underneath it.
 *
 * Safari's own toolbar can't be styled by the page, but on iOS it floats over
 * the page, and what it shows through is whatever we draw there. The band
 * extends under it (viewport-fit=cover), so the toolbar sits on blur rather
 * than on sharp chord diagrams.
 */
export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" jumps to search with a keyboard, like most sites with a search box.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {/* The blurred edge, fading out upward so it has no hard top line. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-[calc(env(safe-area-inset-bottom)+5.5rem)] bg-linear-to-t from-background/70 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,black_45%,transparent)]"
      />
      <form
        role="search"
        // Enter just dismisses the keyboard; the chart already filters as you type.
        onSubmit={(e) => {
          e.preventDefault();
          inputRef.current?.blur();
        }}
        // Clear of the root index on the right edge on phones.
        className="fixed inset-x-10 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-20 mx-auto max-w-md"
      >
        <label className="flex h-12 items-center gap-2 rounded-full border border-border bg-background/60 pl-4 pr-1.5 shadow-lg backdrop-blur-xl backdrop-saturate-150 focus-within:ring-2 focus-within:ring-ring/50">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Search chords</span>
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onChange("");
                e.currentTarget.blur();
              }
            }}
            placeholder="Search chords"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            // 16px or iOS zooms the page in on focus.
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
          />
          {value !== "" && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </label>
      </form>
    </>
  );
}
