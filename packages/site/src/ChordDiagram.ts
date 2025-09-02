// Ukulele chord diagrams encoded as bitmasks
// Each number is a bitmask of fret positions for that string.
// Example: 0 = open, 1 = fret 1, 2 = fret 2, 4 = fret 3, 8 = fret 4, etc.
// Multiple dots on the same string = sum of those values.

export type ChordDiagram = [g: number, c: number, e: number, a: number];

// C family
export const C: ChordDiagram = [0, 0, 0, 4];
export const C7: ChordDiagram = [0, 0, 0, 2];
export const Cm: ChordDiagram = [0, 0, 3, 4];
export const Cm7: ChordDiagram = [0, 0, 3, 2];
export const Cdim: ChordDiagram = [0, 2, 1, 2];
export const Caug: ChordDiagram = [1, 0, 0, 4];
export const C6: ChordDiagram = [0, 0, 0, 0];
export const Cmaj7: ChordDiagram = [0, 0, 0, 3]; // corrected
export const C9: ChordDiagram = [2, 0, 0, 2]; // corrected

// Db family
export const Db: ChordDiagram = [1, 1, 1, 4];
export const Db7: ChordDiagram = [1, 1, 1, 2];
export const Dbm: ChordDiagram = [1, 1, 0, 2];
export const Dbm7: ChordDiagram = [1, 1, 0, 0];
export const Dbdim: ChordDiagram = [1, 2, 1, 2];
export const Dbaug: ChordDiagram = [1, 1, 1, 0]; // corrected
export const Db6: ChordDiagram = [1, 1, 1, 1];
export const Dbmaj7: ChordDiagram = [1, 1, 1, 5];
export const Db9: ChordDiagram = [3, 1, 1, 3]; // corrected

// D family
export const D: ChordDiagram = [2, 2, 2, 0];
export const D7: ChordDiagram = [2, 2, 2, 3];
export const Dm: ChordDiagram = [2, 2, 1, 0];
export const Dm7: ChordDiagram = [2, 2, 1, 3];
export const Ddim: ChordDiagram = [2, 3, 2, 3];
export const Daug: ChordDiagram = [3, 2, 2, 1]; // corrected
export const D6: ChordDiagram = [2, 2, 2, 2];
export const Dmaj7: ChordDiagram = [2, 2, 2, 4];
export const D9: ChordDiagram = [0, 2, 0, 2]; // corrected

// Eb family
export const Eb: ChordDiagram = [3, 3, 3, 1];
export const Eb7: ChordDiagram = [3, 3, 3, 4];
export const Ebm: ChordDiagram = [3, 3, 2, 1];
export const Ebm7: ChordDiagram = [3, 3, 2, 4];
export const Ebdim: ChordDiagram = [3, 4, 3, 4];
export const Ebaug: ChordDiagram = [0, 3, 3, 2]; // corrected
export const Eb6: ChordDiagram = [3, 3, 3, 3];
export const Ebmaj7: ChordDiagram = [3, 3, 3, 0]; // corrected
export const Eb9: ChordDiagram = [1, 3, 1, 3]; // corrected

// E family
export const E: ChordDiagram = [1, 4, 0, 2];
export const E7: ChordDiagram = [1, 2, 0, 2];
export const Em: ChordDiagram = [0, 4, 3, 2];
export const Em7: ChordDiagram = [0, 2, 0, 2];
export const Edim: ChordDiagram = [1, 2, 1, 2];
export const Eaug: ChordDiagram = [1, 0, 0, 3]; // corrected
export const E6: ChordDiagram = [1, 1, 0, 2];
export const Emaj7: ChordDiagram = [1, 3, 0, 2];
export const E9: ChordDiagram = [2, 2, 2, 2]; // corrected

// F family
export const F: ChordDiagram = [2, 0, 1, 0];
export const F7: ChordDiagram = [2, 3, 1, 0];
export const Fm: ChordDiagram = [1, 0, 1, 3];
export const Fm7: ChordDiagram = [1, 3, 1, 3];
export const Fdim: ChordDiagram = [1, 2, 1, 2];
export const Faug: ChordDiagram = [2, 1, 1, 0]; // corrected
export const F6: ChordDiagram = [2, 2, 1, 3];
export const Fmaj7: ChordDiagram = [1, 0, 1, 0];
export const F9: ChordDiagram = [0, 2, 1, 2]; // corrected

// Gb family
export const Gb: ChordDiagram = [3, 1, 2, 1];
export const Gb7: ChordDiagram = [3, 4, 2, 1];
export const Gbm: ChordDiagram = [2, 1, 2, 0];
export const Gbm7: ChordDiagram = [2, 4, 2, 4];
export const Gbdim: ChordDiagram = [2, 3, 2, 3];
export const Gbaug: ChordDiagram = [3, 0, 0, 1]; // corrected
export const Gb6: ChordDiagram = [3, 3, 2, 4];
export const Gbmaj7: ChordDiagram = [3, 5, 2, 4];
export const Gb9: ChordDiagram = [1, 3, 2, 3]; // corrected

// G family
export const G: ChordDiagram = [0, 2, 3, 2];
export const G7: ChordDiagram = [0, 2, 1, 2];
export const Gm: ChordDiagram = [0, 2, 3, 1];
export const Gm7: ChordDiagram = [0, 2, 1, 1];
export const Gdim: ChordDiagram = [0, 1, 0, 1];
export const Gaug: ChordDiagram = [1, 0, 0, 3]; // corrected
export const G6: ChordDiagram = [0, 2, 0, 2];
export const Gmaj7: ChordDiagram = [0, 2, 2, 2];
export const G9: ChordDiagram = [2, 2, 3, 2]; // corrected

// Ab family
export const Ab: ChordDiagram = [1, 3, 2, 3];
export const Ab7: ChordDiagram = [1, 3, 1, 3];
export const Abm: ChordDiagram = [1, 3, 2, 2];
export const Abm7: ChordDiagram = [1, 3, 1, 2];
export const Abdim: ChordDiagram = [1, 2, 1, 2];
export const Abaug: ChordDiagram = [1, 0, 0, 4]; // corrected
export const Ab6: ChordDiagram = [1, 3, 1, 3];
export const Abmaj7: ChordDiagram = [1, 3, 3, 3];
export const Ab9: ChordDiagram = [3, 3, 2, 3]; // corrected

// A family
export const A: ChordDiagram = [2, 1, 0, 0];
export const A7: ChordDiagram = [0, 1, 0, 0];
export const Am: ChordDiagram = [2, 0, 0, 0];
export const Am7: ChordDiagram = [0, 0, 0, 0];
export const Adim: ChordDiagram = [2, 3, 2, 3];
export const Aaug: ChordDiagram = [2, 1, 1, 0]; // corrected
export const A6: ChordDiagram = [2, 4, 2, 4];
export const Amaj7: ChordDiagram = [1, 1, 0, 0];
export const A9: ChordDiagram = [2, 1, 2, 0]; // corrected

// Bb family
export const Bb: ChordDiagram = [3, 2, 1, 1];
export const Bb7: ChordDiagram = [1, 2, 1, 1];
export const Bbm: ChordDiagram = [3, 1, 1, 1];
export const Bbm7: ChordDiagram = [1, 1, 1, 1];
export const Bbdim: ChordDiagram = [1, 2, 1, 2];
export const Bbaug: ChordDiagram = [3, 2, 2, 1]; // corrected
export const Bb6: ChordDiagram = [3, 5, 3, 5];
export const Bbmaj7: ChordDiagram = [2, 2, 1, 1];
export const Bb9: ChordDiagram = [1, 2, 1, 3]; // corrected

// B family
export const B: ChordDiagram = [4, 3, 2, 2];
export const B7: ChordDiagram = [2, 3, 2, 2];
export const Bm: ChordDiagram = [4, 2, 2, 2];
export const Bm7: ChordDiagram = [2, 2, 2, 2];
export const Bdim: ChordDiagram = [2, 3, 2, 3];
export const Baug: ChordDiagram = [4, 3, 3, 2]; // corrected
export const B6: ChordDiagram = [4, 6, 4, 6];
export const Bmaj7: ChordDiagram = [3, 3, 2, 2];
export const B9: ChordDiagram = [2, 3, 2, 4]; // corrected
