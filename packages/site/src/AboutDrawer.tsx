import { Info, Play, Star } from "lucide-react";
import { Drawer } from "vaul";

/**
 * How to use the chart and what it is, behind a button in the header. Worth
 * reading once, so it stays out of the way of the chords afterwards.
 */
export function AboutDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger
        aria-label="About this chart"
        className="flex size-10 pointer-coarse:size-11 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent dark:ring-1 dark:ring-border"
      >
        <Info className="size-4" />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-[10px] border-t border-border bg-card text-card-foreground outline-none"
        >
          <div className="mx-auto w-full max-w-2xl overflow-y-auto p-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
            <Drawer.Handle />
            <Drawer.Title className="mt-4 mb-3 font-medium">
              About this chord chart
            </Drawer.Title>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Diagrams for 108 ukulele chords in standard GCEA tuning. Press{" "}
                <Play className="inline h-3 w-3 align-baseline" aria-label="play" />{" "}
                to hear a chord, or{" "}
                <Star className="inline h-3 w-3 align-baseline" aria-label="star" />{" "}
                to keep it in your starred list. You can also drag a chord down
                into the starred list.
              </p>
              <p>
                Every chord is drawn for a ukulele in standard GCEA (C6) tuning,
                with the strings left to right: G, C, E, A. A dot marks where to
                press, and an O above a string means it is played open. Chords
                are grouped by root note — C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb
                and B — and each root has major, minor, dominant 7th, minor 7th,
                diminished, augmented, 6th, major 7th and 9th voicings.
              </p>
              <p>
                Playback uses a sampled ukulele soundfont, so what you hear is a
                real strum. Starred chords are saved in your browser and will be
                here the next time you visit. The chart is free and open source
                on{" "}
                <a
                  className="underline hover:text-foreground"
                  href="https://github.com/mrkev/ukulele-tool"
                >
                  GitHub
                </a>
                .
              </p>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
