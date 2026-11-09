import { Search, X } from "lucide-react";
import { RefObject, useRef } from "react";

import { cn } from "@/lib/utils";
import { useSlashToSearch } from "@/lib/useSlashToSearch";

/**
 * The chord search field itself. The chart filters as you type; Escape clears
 * it.
 */
export function SearchField({
  value,
  onChange,
  inputRef,
  size,
  className,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  /** "sm" for the desktop header; "lg" for phones, in thumb reach. */
  size: "sm" | "lg";
  /** The field's look: background, border, shadow. */
  className?: string;
  onBlur?: () => void;
}) {
  return (
    <form
      role="search"
      // Enter just dismisses the keyboard; the chart already filters as you type.
      onSubmit={(e) => {
        e.preventDefault();
        inputRef.current?.blur();
      }}
      className="min-w-0 flex-1"
    >
      <label
        className={cn(
          "flex items-center gap-2 rounded-full focus-within:ring-2 focus-within:ring-ring/50",
          size === "sm" ? "h-10 pl-3.5 pr-1" : "h-14 pl-4 pr-2",
          className
        )}
      >
        <Search
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <span className="sr-only">Search chords</span>
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
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
          className={cn(
            "min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none",
            // 16px on phones, or iOS zooms the page in on focus.
            size === "sm" ? "text-sm" : "text-base"
          )}
        />
        {value !== "" && (
          <button
            type="button"
            // Keep the keyboard up: don't let the press blur the field.
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className={cn(
              "flex shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground",
              size === "sm" ? "size-8" : "size-10"
            )}
          >
            <X className="size-4" />
          </button>
        )}
      </label>
    </form>
  );
}

/** Search in the header, top right, where desktop sites put it. */
export function HeaderSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useSlashToSearch(() => {
    if (!inputRef.current?.getClientRects().length) return false;
    inputRef.current.focus();
    return true;
  });

  return (
    <div className="hidden w-64 shrink md:flex">
      <SearchField
        value={value}
        onChange={onChange}
        inputRef={inputRef}
        size="sm"
        // Matches the header's buttons.
        className="bg-card shadow-sm dark:ring-1 dark:ring-border"
      />
    </div>
  );
}
