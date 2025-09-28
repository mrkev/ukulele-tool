import { ChordDiagram } from "./ChordDiagram";

function highestFrets(diagram: ChordDiagram) {
  let [g, c, e, a] = diagram;
  let [gp, cp, ep, ap] = [0, 0, 0, 0];

  while (g) {
    gp++;
    g >>= 1;
  }

  while (c) {
    cp++;
    c >>= 1;
  }

  while (e) {
    ep++;
    e >>= 1;
  }

  while (a) {
    ap++;
    a >>= 1;
  }

  return [gp, cp, ep, ap] as const;
}

export function midiOfChordDiagram(diagram: ChordDiagram) {
  const [g, c, e, a] = highestFrets(diagram);
  return [67 + g, 60 + c, 64 + e, 69 + a];
}
