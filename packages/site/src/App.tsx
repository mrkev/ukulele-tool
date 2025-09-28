import AllChords from "./AllChords";
import { useChordPlayer } from "./wam/useChordPlayer";

export function App() {
  const chordPlayer = useChordPlayer();

  return (
    <div className="p-4">
      <h1 className="text-xl mb-2">Ukulele Chords</h1>
      <AllChords chordPlayer={chordPlayer} />
    </div>
  );
}
