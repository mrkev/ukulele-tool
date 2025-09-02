import { ChordDiagram } from "./ChordDiagram";
import UkuleleChord from "./SVGChordDiagram";

const C: ChordDiagram = [0, 0, 0, 4];

export function App() {
  return (
    <div className="p-4">
      <h1 className="text-xl mb-2">Ukulele Chord</h1>
      <UkuleleChord chord={C} size={120} />
    </div>
  );
}
