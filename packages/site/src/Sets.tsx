import { Star } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { chords } from "./ChordDiagram";
import { CHORD_GRID, ChordCard } from "./ChordCard";
import { ChordPlayer } from "./audio/useChordPlayer";
import { midiOfChordDiagram } from "./midiOfChordDiagram";

/**
 * Chords gathered into sets, one section each. For now the only set is the
 * starred chords.
 */
export function Sets({
  chordPlayer,
  favourites,
  setFavourites,
}: {
  chordPlayer: ChordPlayer;
  favourites: string[];
  setFavourites: Dispatch<SetStateAction<string[]>>;
}) {
  const play = (name: string) => {
    const [g, c, e, a] = midiOfChordDiagram(chords[name]);
    chordPlayer.play([
      [g, 100],
      [c, 100],
      [e, 100],
      [a, 100],
    ]);
  };

  return (
    <div className="space-y-8 py-4 sm:px-4">
      <section>
        <h2 className="mb-4 flex items-baseline gap-2">
          <span className="flex items-center gap-1.5 self-center text-lg font-bold">
            <Star className="size-4 fill-star stroke-star" aria-hidden="true" />
            Starred
          </span>
          <span className="text-sm text-muted-foreground">
            {favourites.length === 1
              ? "1 chord"
              : `${favourites.length} chords`}
          </span>
        </h2>
        {favourites.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No starred chords yet. Tap a chord's star in All chords, or drag it
            into the starred drawer, to add it here.
          </p>
        ) : (
          <div className={CHORD_GRID}>
            {favourites.map((name) => (
              <ChordCard
                key={name}
                name={name}
                diagram={chords[name]}
                starred
                onPlay={() => play(name)}
                onToggleStar={() =>
                  setFavourites((prev) => prev.filter((x) => x !== name))
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
