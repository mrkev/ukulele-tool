import React from "react";
import { ChordDiagram } from "./ChordDiagram";

interface Props {
  chord: ChordDiagram;
  frets?: number; // how many frets to display (default 4)
  size?: number; // overall size of diagram in px (default 120)
}

export const UkuleleChord: React.FC<Props> = ({
  chord,
  frets = 4,
  size = 120,
}) => {
  const [g, c, e, a] = chord;
  const stringNames = ["g", "c", "e", "a"];
  const stringMasks = [g, c, e, a];

  const padding = 20;
  const width = size;
  const height = size;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const stringSpacing = innerWidth / (stringNames.length - 1);
  const fretSpacing = innerHeight / frets;

  // Decode bitmask into fret positions
  const decodeFretPositions = (mask: number): number[] => {
    const positions: number[] = [];
    let bit = 1;
    for (let fret = 0; fret <= frets; fret++) {
      if (mask & bit) {
        positions.push(fret + 1); // fret numbers start at 1
      }
      bit <<= 1;
    }
    return positions;
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Fretboard */}
      {Array.from({ length: frets + 1 }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={padding}
          x2={width - padding}
          y1={padding + i * fretSpacing}
          y2={padding + i * fretSpacing}
          stroke="black"
        />
      ))}

      {/* Strings */}
      {stringNames.map((s, i) => (
        <line
          key={`string-${s}`}
          x1={padding + i * stringSpacing}
          x2={padding + i * stringSpacing}
          y1={padding}
          y2={height - padding}
          stroke="black"
        />
      ))}

      {/* Dots */}
      {stringMasks.map((mask, i) =>
        decodeFretPositions(mask).map((fret) => (
          <circle
            key={`dot-${i}-${fret}`}
            cx={padding + i * stringSpacing}
            cy={padding + fret * fretSpacing - fretSpacing / 2}
            r={6}
            fill="black"
          />
        ))
      )}

      {/* Open string indicators */}
      {stringMasks.map((mask, i) =>
        mask === 0 ? (
          <text
            key={`open-${i}`}
            x={padding + i * stringSpacing}
            y={padding - 8}
            textAnchor="middle"
            fontSize="12"
          >
            O
          </text>
        ) : null
      )}
    </svg>
  );
};

export default UkuleleChord;
