import React from "react";
import { describeChord } from "./chordName";

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
  // Keyed by string name: the strings are fixed, so the name is their identity.
  const strings = [
    { name: "G", mask: g },
    { name: "C", mask: c },
    { name: "E", mask: e },
    { name: "A", mask: a },
  ];

  const padding = 20;
  const labelSpace = name ? 24 : 0;
  const width = size;
  const height = size + labelSpace;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2 - labelSpace;

  const stringSpacing = innerWidth / (strings.length - 1);
  const fretSpacing = innerHeight / frets;

  // The diagram is only meaningful to sighted users; give everyone else the
  // chord's name in words.
  const label = name ? `${describeChord(name)} ukulele chord` : undefined;

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
      role="img"
      aria-label={label}
    >
      {label && <title>{label}</title>}

      {/* Chord name */}
      {name && (
        <text
          x={width / 2}
          y={16}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          aria-hidden="true"
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
      {strings.map((string, i) => (
        <line
          key={string.name}
          x1={padding + i * stringSpacing}
          x2={padding + i * stringSpacing}
          y1={padding + labelSpace}
          y2={height - padding}
          stroke="black"
        />
      ))}

      {/* Dots */}
      {strings.map((string, i) =>
        decodeFretPositions(string.mask).map((fret) => (
          <circle
            key={`${string.name}-${fret}`}
            cx={padding + i * stringSpacing}
            cy={padding + labelSpace + fret * fretSpacing - fretSpacing / 2}
            r={6}
            fill="black"
          />
        ))
      )}

      {/* Open string indicators */}
      {strings.map((string, i) =>
        string.mask === 0 ? (
          <text
            key={string.name}
            x={padding + i * stringSpacing}
            y={padding + labelSpace - 6}
            textAnchor="middle"
            fontSize="12"
            aria-hidden="true"
          >
            O
          </text>
        ) : null
      )}
    </svg>
  );
};

export default UkuleleChord;
