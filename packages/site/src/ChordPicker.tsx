import { useMemo, useRef, useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import type { ChordSet } from "@/lib/chordSets";
import { chordGroups } from "./ChordDiagram";
import { searchChords } from "./chordSearch";
import { SearchField } from "./SearchBar";
import UkuleleChord from "./SVGChordDiagram";

/**
 * A drawer of every chord, for filling a set: tapping a chord adds it to the
 * end of the set, or takes it out if it's already in. Chords in the set show
 * their place in it.
 */
export function ChordPicker({
  set,
  onToggle,
  onClose,
}: {
  /** The set being filled; null when the picker is closed. */
  set: ChordSet | null;
  onToggle: (chord: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  // Keep showing the set while the drawer slides away.
  const [shown, setShown] = useState(set);
  if (set && set !== shown) setShown(set);

  const groups = useMemo(() => searchChords(chordGroups, query), [query]);
  const chords = shown?.chords ?? [];

  return (
    <Drawer
      open={set != null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      onOpenChangeComplete={(open) => {
        if (!open) setQuery("");
      }}
      showSwipeHandle
    >
      <DrawerContent
        // Don't raise the keyboard on phones just for opening it.
        initialFocus={false}
        className="h-[calc(100dvh-6rem)] bg-card text-card-foreground [--drawer-bleed-background:var(--card)]"
      >
        <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
          <div className="shrink-0 space-y-3 px-4 pt-2 pb-3">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <DrawerTitle className="truncate">
                  Add chords to {shown?.name || "Untitled set"}
                </DrawerTitle>
                <DrawerDescription className="mt-0.5">
                  Tap a chord to add it at the end, or again to take it out.
                </DrawerDescription>
              </div>
              <Button size="sm" onClick={onClose}>
                Done
              </Button>
            </div>
            <SearchField
              value={query}
              onChange={setQuery}
              inputRef={inputRef}
              size="sm"
              className="bg-muted"
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
            {Object.keys(groups).length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No chords match “{query.trim()}”.
              </p>
            )}
            <div className="space-y-6">
              {Object.entries(groups).map(([root, rootChords]) => (
                <section key={root}>
                  <h3 className="mb-2 text-sm font-semibold">{root}</h3>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-9">
                    {rootChords.map(([name, diagram]) => {
                      const place = chords.indexOf(name) + 1;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => onToggle(name)}
                          aria-pressed={place > 0}
                          aria-label={
                            place > 0
                              ? `${name}, number ${place} in the set. Remove it.`
                              : `Add ${name}`
                          }
                          className="relative cursor-pointer rounded-lg p-1 transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 aria-pressed:bg-star/10 aria-pressed:ring-2 aria-pressed:ring-star aria-pressed:ring-inset"
                        >
                          <UkuleleChord
                            chord={diagram}
                            name={name}
                            size={80}
                            className="pointer-events-none h-auto w-full"
                          />
                          {place > 0 && (
                            <span
                              aria-hidden="true"
                              className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-star text-[0.6875rem] font-semibold text-white"
                            >
                              {place}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
