import { useEffect, useRef } from "react";

/**
 * Calls `onSlash` when "/" is pressed outside a text field: the usual keyboard
 * shortcut for search. It should return false when its search isn't on
 * screen, so the key goes to the one that is.
 */
export function useSlashToSearch(onSlash: () => boolean) {
  const onSlashRef = useRef(onSlash);
  useEffect(() => {
    onSlashRef.current = onSlash;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      if (onSlashRef.current()) e.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
