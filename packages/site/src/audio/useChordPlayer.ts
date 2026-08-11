import { useCallback, useEffect, useState } from "react";
import { AsyncResult, ensureError } from "./AsyncResult";
import { UkuleleSynth, createUkuleleSynth } from "./ukuleleSynth";

export type ChordPlayer = {
  start: () => Promise<void>;
  play: (notes: MidiNoteDescription[]) => Promise<void>;
  status: AsyncResult<unknown>["status"];
};

export type MidiNoteDescription = [note: number, velocity: number];

const CHANNEL = 0;

// Notes are handed to us in string order (g, C, E, A), so offsetting each one a
// little makes a chord sound strummed rather than struck all at once.
const STRUM_SECONDS = 0.025;

// How long a note is held before its release. The samples decay on their own,
// so this is about when the chord stops ringing, not how loud it is.
const NOTE_SECONDS = 1.5;

// The synth is a page-lifetime resource: one AudioContext, one worklet, one
// several-megabyte soundfont. Keeping it at module scope (rather than in a ref)
// means every caller shares one instance, nobody races to build a second, and
// strict mode's double mount doesn't load the soundfont twice. Holding the
// promise rather than the value is what makes concurrent callers await the same
// initialization.
let synthPromise: Promise<UkuleleSynth> | null = null;

function getSynth() {
  if (synthPromise == null) {
    synthPromise = createUkuleleSynth().catch((error) => {
      // Let the next interaction retry rather than failing for good.
      synthPromise = null;
      throw ensureError(error);
    });
  }
  return synthPromise;
}

/** Browsers only let an AudioContext produce sound after a user gesture. */
async function resumed() {
  const synth = await getSynth();
  if (synth.context.state !== "running") {
    await synth.context.resume();
  }
  return synth;
}

export function useChordPlayer(): ChordPlayer {
  const [status, setStatus] =
    useState<AsyncResult<UkuleleSynth>["status"]>("pending");

  useEffect(() => {
    // Warm up ahead of the first click: the soundfont is a few megabytes and
    // the worklet takes a moment to come up. The context stays suspended until
    // a gesture reaches `start` or `play`.
    let cancelled = false;
    getSynth().then(
      () => !cancelled && setStatus("ready"),
      () => !cancelled && setStatus("error")
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const start = useCallback(async () => {
    await resumed();
  }, []);

  const play = useCallback(async (notes: MidiNoteDescription[]) => {
    const { context, synth } = await resumed();

    const now = context.currentTime;
    notes.forEach(([note, velocity], index) => {
      const time = now + index * STRUM_SECONDS;
      synth.noteOn(CHANNEL, note, velocity, { time });
      synth.noteOff(CHANNEL, note, { time: time + NOTE_SECONDS });
    });
  }, []);

  return { start, play, status };
}
