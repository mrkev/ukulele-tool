import React from "react";

type ChordDiagram = [g: number, c: number, e: number, a: number];

interface Props {
  chord: ChordDiagram;
  name?: string; // optional chord name
  frets?: number; // number of frets to display
  size?: number; // overall size in px
  className?: string;
}

export const UkuleleChord: React.FC<Props> = ({
  chord,
  name,
  frets = 4,
  size = 120,
  className,
}) => {
  const [g, c, e, a] = chord;
  const stringMasks = [g, c, e, a];

  const padding = 20;
  const labelSpace = name ? 24 : 0;
  const width = size;
  const height = size + labelSpace;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2 - labelSpace;

  const stringSpacing = innerWidth / (stringMasks.length - 1);
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
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      {/* Chord name */}
      {name && (
        <text
          x={width / 2}
          y={16}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
        >
          {name}
        </text>
      )}

      {/* Fretboard */}
      {Array.from({ length: frets + 1 }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={padding}
          x2={width - padding}
          y1={padding + labelSpace + i * fretSpacing}
          y2={padding + labelSpace + i * fretSpacing}
          stroke="black"
        />
      ))}

      {/* Strings */}
      {stringMasks.map((_, i) => (
        <line
          key={`string-${i}`}
          x1={padding + i * stringSpacing}
          x2={padding + i * stringSpacing}
          y1={padding + labelSpace}
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
            cy={padding + labelSpace + fret * fretSpacing - fretSpacing / 2}
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
            y={padding + labelSpace - 6}
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
