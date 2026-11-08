import { useEffect } from "react";

/**
 * Keeps the screen from dimming or locking while `active` is true, so a chord
 * stays readable with both hands on the instrument.
 *
 * The browser releases the lock whenever the page is hidden (tab switch, phone
 * locked), so it is requested again each time the page comes back. Unsupported
 * browsers and refused requests (low battery mode, permissions policy) are
 * ignored: the page just behaves as it would without this.
 */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return;

    let lock: WakeLockSentinel | null = null;
    let cancelled = false;

    const acquire = async () => {
      if (document.visibilityState !== "visible" || (lock && !lock.released)) {
        return;
      }
      try {
        const next = await navigator.wakeLock.request("screen");
        if (cancelled) {
          void next.release();
        } else {
          lock = next;
        }
      } catch {
        // Refused; nothing to do.
      }
    };

    void acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", acquire);
      void lock?.release();
    };
  }, [active]);
}
