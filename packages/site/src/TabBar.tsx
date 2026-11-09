import { Search } from "lucide-react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { cn } from "@/lib/utils";
import { useSlashToSearch } from "@/lib/useSlashToSearch";
import { SearchField } from "./SearchBar";
import { TABS, type Tab } from "./tabs";

/** Frosted glass, like iOS's floating bars. */
const GLASS =
  "border border-border bg-background/60 shadow-lg backdrop-blur-xl backdrop-saturate-150";

/**
 * The phone's tab bar, floating at the bottom of the screen in thumb reach,
 * after iOS's: the tabs in one pill and search in a round button beside it.
 * Tapping search folds the tabs into a button showing the current one and
 * opens the search field in their place; that button folds search away again.
 *
 * It sits over a soft blurred band. Safari's own toolbar can't be styled by
 * the page, but on iOS it floats over the page, and what it shows through is
 * whatever we draw there. The band extends under it (viewport-fit=cover), so
 * the toolbar sits on blur rather than on sharp chord diagrams.
 */
export function TabBar({
  tab,
  onTabChange,
  query,
  onQueryChange,
}: {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  query: string;
  onQueryChange: (query: string) => void;
}) {
  const [searching, setSearching] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const current = TABS.find((t) => t.value === tab) ?? TABS[0];

  const openSearch = () => {
    // Render the field now, so it can be focused while still handling the
    // tap: iOS only raises the keyboard for focus during a user gesture.
    // eslint-disable-next-line @eslint-react/dom-no-flush-sync
    flushSync(() => setSearching(true));
    inputRef.current?.focus();
  };

  const closeSearch = () => {
    onQueryChange("");
    setSearching(false);
  };

  useSlashToSearch(() => {
    if (!barRef.current?.getClientRects().length) return false;
    openSearch();
    return true;
  });

  return (
    <>
      {/* The blurred edge, fading out upward so it has no hard top line. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-[calc(env(safe-area-inset-bottom)+6rem)] bg-linear-to-t from-background/70 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,black_45%,transparent)] md:hidden"
      />
      <div
        ref={barRef}
        // Clear of the root index on the right edge.
        className="fixed inset-x-10 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-20 mx-auto flex max-w-md items-center gap-3 md:hidden"
      >
        {searching ? (
          <>
            <button
              type="button"
              onClick={closeSearch}
              aria-label={`Close search, back to ${current.label}`}
              className={cn(
                "flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-full text-star animate-in fade-in zoom-in-75 duration-200",
                GLASS
              )}
            >
              <current.Icon className="size-5" aria-hidden="true" />
            </button>
            <SearchField
              value={query}
              onChange={onQueryChange}
              inputRef={inputRef}
              size="lg"
              // Nothing typed: fold back into the tab bar once it's left.
              onBlur={() => {
                if (query === "") setSearching(false);
              }}
              className={cn(
                "animate-in fade-in slide-in-from-right-8 duration-200",
                GLASS
              )}
            />
          </>
        ) : (
          <>
            <nav
              aria-label="Views"
              className={cn(
                "flex h-14 min-w-0 flex-1 gap-1 rounded-full p-1 animate-in fade-in duration-200",
                GLASS
              )}
            >
              {TABS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onTabChange(value)}
                  aria-current={value === tab ? "page" : undefined}
                  className={cn(
                    "flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full text-[0.6875rem] font-medium transition-colors",
                    value === tab
                      ? "bg-foreground/10 text-star"
                      : "text-foreground"
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </nav>
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search chords"
              className={cn(
                "flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-full animate-in fade-in zoom-in-75 duration-200",
                GLASS
              )}
            >
              <Search className="size-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </>
  );
}
