import { useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";

/**
 * Safari's Audio Session API (iOS 17+). Not in TypeScript's DOM typings yet.
 * https://w3c.github.io/audio-session/
 */
type AudioSessionNavigator = Navigator & {
  audioSession?: { type: "auto" | "playback" | "ambient" | string };
};

/** Whether this browser lets the page choose how its audio is treated. */
export function canPlayInSilentMode() {
  return (
    typeof navigator !== "undefined" &&
    (navigator as AudioSessionNavigator).audioSession != null
  );
}

/**
 * The "play in silent mode" setting, off by default.
 *
 * iOS mutes Web Audio while the ring/silent switch is on, as it would a game's
 * sound effects. Marking the page's audio as "playback" (media the user asked
 * for) makes it play anyway, but like any media it also pauses other audio,
 * such as music someone is practising along to. So it's opt-in.
 *
 * Use it once, near the root, so the setting is in effect from page load.
 */
export function useSilentModePlayback() {
  const [enabled, setEnabled] = useLocalStorageState<boolean>(
    "ukulele-tool.play-in-silent-mode",
    { defaultValue: false }
  );

  useEffect(() => {
    const session = (navigator as AudioSessionNavigator).audioSession;
    if (session) session.type = enabled ? "playback" : "auto";
  }, [enabled]);

  return [enabled, setEnabled] as const;
}
