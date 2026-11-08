import { Info, Play, Star } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

/**
 * How to use the chart and what it is, behind a button in the header. Worth
 * reading once, so it stays out of the way of the chords afterwards.
 */
export function AboutDrawer() {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger
        aria-label="About this chart"
        className="flex size-10 pointer-coarse:size-11 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent dark:ring-1 dark:ring-border"
      >
        <Info className="size-4" />
      </DrawerTrigger>
      <DrawerContent
        swipeFromContent
        className="bg-card text-card-foreground [--drawer-bleed-background:var(--card)]"
      >
        <div className="mx-auto w-full max-w-2xl overflow-y-auto p-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
          <DrawerTitle className="mb-3">About this chord chart</DrawerTitle>
          <AboutText />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/**
 * What the chart is and how to use it. Shown in the drawer, and also at the
 * foot of the page: it's most of the page's plain text, which is what search
 * engines read to know what the page is about.
 */
export function AboutText() {
  return (
    <div className="space-y-3 text-sm text-muted-foreground">
      <p>
        Diagrams for 108 ukulele chords in standard GCEA tuning. Press{" "}
        <Play className="inline h-3 w-3 align-baseline" aria-label="play" /> to
        hear a chord, or{" "}
        <Star className="inline h-3 w-3 align-baseline" aria-label="star" /> to
        keep it in your starred list. You can also drag a chord down into the
        starred list.
      </p>
      <p>
        Every chord is drawn for a ukulele in standard GCEA (C6) tuning, with
        the strings left to right: G, C, E, A. A dot marks where to press, and
        an O above a string means it is played open. Chords are grouped by root
        note — C, Db (C#), D, Eb (D#), E, F, Gb (F#), G, Ab (G#), A, Bb (A#) and
        B — and each root has major, minor, dominant 7th, minor 7th, diminished,
        augmented, 6th, major 7th and 9th voicings.
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
  );
}

/** The about text at the end of the page, below the chords. */
export function AboutFooter() {
  return (
    <footer className="mt-12 max-w-2xl px-0 sm:px-4">
      <h2 className="mb-3 text-sm font-medium text-foreground">
        About this chord chart
      </h2>
      <AboutText />
    </footer>
  );
}
