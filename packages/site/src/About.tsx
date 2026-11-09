import { ChevronDown, Play, Star } from "lucide-react";

/**
 * What the chart is and how to use it, collapsed at the foot of the page.
 * Worth reading once, so it stays out of the way of the chords. It's still in
 * the page's HTML while collapsed, and it's most of the page's plain text,
 * which is what search engines read to know what the page is about.
 */
export function About() {
  return (
    <details className="group mt-12 max-w-2xl px-0 sm:px-4">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-1 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
        <h2>About this chord chart</h2>
        <ChevronDown
          className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="mt-3 space-y-3 text-sm text-muted-foreground">
        <p>
          Diagrams for 108 ukulele chords in standard GCEA tuning. Press{" "}
          <Play className="inline h-3 w-3 align-baseline" aria-label="play" />{" "}
          to hear a chord, or{" "}
          <Star className="inline h-3 w-3 align-baseline" aria-label="star" />{" "}
          to keep it in your starred list. You can also drag a chord down into
          the starred list.
        </p>
        <p>
          Every chord is drawn for a ukulele in standard GCEA (C6) tuning, with
          the strings left to right: G, C, E, A. A dot marks where to press, and
          an O above a string means it is played open. Chords are grouped by
          root note — C, Db (C#), D, Eb (D#), E, F, Gb (F#), G, Ab (G#), A, Bb
          (A#) and B — and each root has major, minor, dominant 7th, minor 7th,
          diminished, augmented, 6th, major 7th and 9th voicings.
        </p>
        <p>
          Playback uses a sampled ukulele soundfont, so what you hear is a real
          strum. Starred chords are saved in your browser and will be here the
          next time you visit. The chart is free and open source on{" "}
          <a
            className="underline hover:text-foreground"
            href="https://github.com/mrkev/ukulele-tool"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </details>
  );
}
