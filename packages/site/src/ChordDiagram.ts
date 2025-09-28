// Ukulele chord diagrams encoded as bitmasks
// Each number is a bitmask of fret positions for that string.
// Example: 0 = open, 1 = fret 1, 2 = fret 2, 4 = fret 3, 8 = fret 4, etc.
// Multiple dots on the same string = sum of those values.

export type ChordDiagram = [g: number, c: number, e: number, a: number];

// C family
export const C: ChordDiagram = [0, 0, 0, 4];
export const C7: ChordDiagram = [0, 0, 0, 1];
export const Cm: ChordDiagram = [0, 4, 4, 4];
export const Cm7: ChordDiagram = [4, 4, 4, 4];
export const Cdim: ChordDiagram = [2, 4, 2, 4];
export const Caug: ChordDiagram = [1, 0, 0, 4];
export const C6: ChordDiagram = [0, 0, 0, 0];
export const Cmaj7: ChordDiagram = [0, 0, 0, 2];
export const C9: ChordDiagram = [0, 2, 0, 1];

// Db family
export const Db: ChordDiagram = [1, 1, 1, 8];
export const Db7: ChordDiagram = [1, 1, 1, 2];
export const Dbm: ChordDiagram = [1, 1, 0, 4];
export const Dbm7: ChordDiagram = [8, 8, 8, 8];
export const Dbdim: ChordDiagram = [0, 1, 0, 1];
export const Dbaug: ChordDiagram = [2, 1, 1, 0];
export const Db6: ChordDiagram = [1, 1, 1, 1];
export const Dbmaj7: ChordDiagram = [1, 1, 1, 5];
export const Db9: ChordDiagram = [1, 4, 1, 2];

// D family
export const D: ChordDiagram = [2, 2, 2, 0]; // [2, 2, 2, 16] according to chart, and it sounds good
export const D7: ChordDiagram = [2, 2, 2, 4];
export const Dm: ChordDiagram = [2, 2, 1, 0];
export const Dm7: ChordDiagram = [2, 2, 1, 4];
export const Ddim: ChordDiagram = [1, 2, 1, 2];
export const Daug: ChordDiagram = [4, 2, 2, 1];
export const D6: ChordDiagram = [2, 2, 2, 2];
export const Dmaj7: ChordDiagram = [2, 2, 2, 10];
export const D9: ChordDiagram = [2, 8, 2, 4];

// Eb family
export const Eb: ChordDiagram = [4, 4, 4, 1];
export const Eb7: ChordDiagram = [4, 4, 4, 8];
export const Ebm: ChordDiagram = [4, 4, 2, 1];
export const Ebm7: ChordDiagram = [4, 4, 2, 8];
export const Ebdim: ChordDiagram = [2, 4, 2, 4];
export const Ebaug: ChordDiagram = [3, 1, 1, 9];
export const Eb6: ChordDiagram = [4, 4, 4, 4];
export const Ebmaj7: ChordDiagram = [4, 4, 4, 0];
export const Eb9: ChordDiagram = [0, 1, 1, 1];

// E family
export const E: ChordDiagram = [8, 8, 8, 2];
export const E7: ChordDiagram = [1, 2, 0, 2];
export const Em: ChordDiagram = [0, 8, 4, 2];
export const Em7: ChordDiagram = [0, 2, 0, 2];
export const Edim: ChordDiagram = [0, 1, 0, 1];
export const Eaug: ChordDiagram = [1, 0, 0, 4];
export const E6: ChordDiagram = [1, 0, 2, 0];
export const Emaj7: ChordDiagram = [1, 4, 0, 2];
export const E9: ChordDiagram = [1, 2, 2, 2];

// F family
export const F: ChordDiagram = [2, 0, 1, 0];
export const F7: ChordDiagram = [2, 4, 1, 0];
export const Fm: ChordDiagram = [1, 0, 1, 4];
export const Fm7: ChordDiagram = [1, 4, 1, 4];
export const Fdim: ChordDiagram = [1, 2, 1, 2];
export const Faug: ChordDiagram = [2, 1, 1, 0];
export const F6: ChordDiagram = [2, 2, 1, 4];
export const Fmaj7: ChordDiagram = [2, 8, 1, 4];
export const F9: ChordDiagram = [2, 4, 4, 4];

// Gb family
export const Gb: ChordDiagram = [4, 1, 2, 1];
export const Gb7: ChordDiagram = [4, 8, 2, 8];
export const Gbm: ChordDiagram = [2, 1, 2, 0];
export const Gbm7: ChordDiagram = [2, 8, 2, 8];
export const Gbdim: ChordDiagram = [2, 4, 2, 4];
export const Gbaug: ChordDiagram = [8, 4, 2, 2]; // this sounds good: [4, 0, 0, 1], what chord is it?
export const Gb6: ChordDiagram = [4, 4, 2, 8];
export const Gbmaj7: ChordDiagram = [0, 1, 1, 1];
export const Gb9: ChordDiagram = [1, 1, 0, 1];

// G family
export const G: ChordDiagram = [0, 2, 4, 2];
export const G7: ChordDiagram = [0, 2, 1, 2];
export const Gm: ChordDiagram = [0, 2, 4, 1];
export const Gm7: ChordDiagram = [0, 2, 1, 1];
export const Gdim: ChordDiagram = [0, 1, 0, 1];
export const Gaug: ChordDiagram = [8, 4, 4, 2];
export const G6: ChordDiagram = [0, 2, 0, 2];
export const Gmaj7: ChordDiagram = [0, 2, 2, 2];
export const G9: ChordDiagram = [2, 2, 1, 2]; // [2, 2, 4, 2] sounds good, what chord is it?

// todo, below this

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

export const chordGroups: Record<string, [string, ChordDiagram][]> = {
  C: [
    ["C", C],
    ["C7", C7],
    ["Cm", Cm],
    ["Cm7", Cm7],
    ["Cdim", Cdim],
    ["Caug", Caug],
    ["C6", C6],
    ["Cmaj7", Cmaj7],
    ["C9", C9],
  ],
  Db: [
    ["Db", Db],
    ["Db7", Db7],
    ["Dbm", Dbm],
    ["Dbm7", Dbm7],
    ["Dbdim", Dbdim],
    ["Dbaug", Dbaug],
    ["Db6", Db6],
    ["Dbmaj7", Dbmaj7],
    ["Db9", Db9],
  ],
  D: [
    ["D", D],
    ["D7", D7],
    ["Dm", Dm],
    ["Dm7", Dm7],
    ["Ddim", Ddim],
    ["Daug", Daug],
    ["D6", D6],
    ["Dmaj7", Dmaj7],
    ["D9", D9],
  ],
  Eb: [
    ["Eb", Eb],
    ["Eb7", Eb7],
    ["Ebm", Ebm],
    ["Ebm7", Ebm7],
    ["Ebdim", Ebdim],
    ["Ebaug", Ebaug],
    ["Eb6", Eb6],
    ["Ebmaj7", Ebmaj7],
    ["Eb9", Eb9],
  ],
  E: [
    ["E", E],
    ["E7", E7],
    ["Em", Em],
    ["Em7", Em7],
    ["Edim", Edim],
    ["Eaug", Eaug],
    ["E6", E6],
    ["Emaj7", Emaj7],
    ["E9", E9],
  ],
  F: [
    ["F", F],
    ["F7", F7],
    ["Fm", Fm],
    ["Fm7", Fm7],
    ["Fdim", Fdim],
    ["Faug", Faug],
    ["F6", F6],
    ["Fmaj7", Fmaj7],
    ["F9", F9],
  ],
  Gb: [
    ["Gb", Gb],
    ["Gb7", Gb7],
    ["Gbm", Gbm],
    ["Gbm7", Gbm7],
    ["Gbdim", Gbdim],
    ["Gbaug", Gbaug],
    ["Gb6", Gb6],
    ["Gbmaj7", Gbmaj7],
    ["Gb9", Gb9],
  ],
  G: [
    ["G", G],
    ["G7", G7],
    ["Gm", Gm],
    ["Gm7", Gm7],
    ["Gdim", Gdim],
    ["Gaug", Gaug],
    ["G6", G6],
    ["Gmaj7", Gmaj7],
    ["G9", G9],
  ],
  Ab: [
    ["Ab", Ab],
    ["Ab7", Ab7],
    ["Abm", Abm],
    ["Abm7", Abm7],
    ["Abdim", Abdim],
    ["Abaug", Abaug],
    ["Ab6", Ab6],
    ["Abmaj7", Abmaj7],
    ["Ab9", Ab9],
  ],
  A: [
    ["A", A],
    ["A7", A7],
    ["Am", Am],
    ["Am7", Am7],
    ["Adim", Adim],
    ["Aaug", Aaug],
    ["A6", A6],
    ["Amaj7", Amaj7],
    ["A9", A9],
  ],
  Bb: [
    ["Bb", Bb],
    ["Bb7", Bb7],
    ["Bbm", Bbm],
    ["Bbm7", Bbm7],
    ["Bbdim", Bbdim],
    ["Bbaug", Bbaug],
    ["Bb6", Bb6],
    ["Bbmaj7", Bbmaj7],
    ["Bb9", Bb9],
  ],
  B: [
    ["B", B],
    ["B7", B7],
    ["Bm", Bm],
    ["Bm7", Bm7],
    ["Bdim", Bdim],
    ["Baug", Baug],
    ["B6", B6],
    ["Bmaj7", Bmaj7],
    ["B9", B9],
  ],
};

export const chords: Record<string, ChordDiagram> = {
  C: C,
  C7: C7,
  Cm: Cm,
  Cm7: Cm7,
  Cdim: Cdim,
  Caug: Caug,
  C6: C6,
  Cmaj7: Cmaj7,
  C9: C9,
  Db: Db,
  Db7: Db7,
  Dbm: Dbm,
  Dbm7: Dbm7,
  Dbdim: Dbdim,
  Dbaug: Dbaug,
  Db6: Db6,
  Dbmaj7: Dbmaj7,
  Db9: Db9,
  D: D,
  D7: D7,
  Dm: Dm,
  Dm7: Dm7,
  Ddim: Ddim,
  Daug: Daug,
  D6: D6,
  Dmaj7: Dmaj7,
  D9: D9,
  Eb: Eb,
  Eb7: Eb7,
  Ebm: Ebm,
  Ebm7: Ebm7,
  Ebdim: Ebdim,
  Ebaug: Ebaug,
  Eb6: Eb6,
  Ebmaj7: Ebmaj7,
  Eb9: Eb9,
  E: E,
  E7: E7,
  Em: Em,
  Em7: Em7,
  Edim: Edim,
  Eaug: Eaug,
  E6: E6,
  Emaj7: Emaj7,
  E9: E9,
  F: F,
  F7: F7,
  Fm: Fm,
  Fm7: Fm7,
  Fdim: Fdim,
  Faug: Faug,
  F6: F6,
  Fmaj7: Fmaj7,
  F9: F9,
  Gb: Gb,
  Gb7: Gb7,
  Gbm: Gbm,
  Gbm7: Gbm7,
  Gbdim: Gbdim,
  Gbaug: Gbaug,
  Gb6: Gb6,
  Gbmaj7: Gbmaj7,
  Gb9: Gb9,
  G: G,
  G7: G7,
  Gm: Gm,
  Gm7: Gm7,
  Gdim: Gdim,
  Gaug: Gaug,
  G6: G6,
  Gmaj7: Gmaj7,
  G9: G9,
  Ab: Ab,
  Ab7: Ab7,
  Abm: Abm,
  Abm7: Abm7,
  Abdim: Abdim,
  Abaug: Abaug,
  Ab6: Ab6,
  Abmaj7: Abmaj7,
  Ab9: Ab9,
  A: A,
  A7: A7,
  Am: Am,
  Am7: Am7,
  Adim: Adim,
  Aaug: Aaug,
  A6: A6,
  Amaj7: Amaj7,
  A9: A9,
  Bb: Bb,
  Bb7: Bb7,
  Bbm: Bbm,
  Bbm7: Bbm7,
  Bbdim: Bbdim,
  Bbaug: Bbaug,
  Bb6: Bb6,
  Bbmaj7: Bbmaj7,
  Bb9: Bb9,
  B: B,
  B7: B7,
  Bm: Bm,
  Bm7: Bm7,
  Bdim: Bdim,
  Baug: Baug,
  B6: B6,
  Bmaj7: Bmaj7,
  B9: B9,
};

export const chordCategories: Record<string, [string, ChordDiagram][]> = {
  Basic: [
    ["C", C],
    ["D", D],
    ["E", E],
    ["F", F],
    ["G", G],
    ["A", A],
    ["B", B],
  ],
  "7ths": [
    ["C7", C7],
    ["D7", D7],
    ["E7", E7],
    ["F7", F7],
    ["G7", G7],
    ["A7", A7],
    ["B7", B7],
  ],
  Minors: [
    ["Cm", Cm],
    ["Dm", Dm],
    ["Em", Em],
    ["Fm", Fm],
    ["Gm", Gm],
    ["Am", Am],
    ["Bm", Bm],
  ],
  "Minor 7ths": [
    ["Cm7", Cm7],
    ["Dm7", Dm7],
    ["Em7", Em7],
    ["Fm7", Fm7],
    ["Gm7", Gm7],
    ["Am7", Am7],
    ["Bm7", Bm7],
  ],
  Diminished: [
    ["Cdim", Cdim],
    ["Ddim", Ddim],
    ["Edim", Edim],
    ["Fdim", Fdim],
    ["Gdim", Gdim],
    ["Adim", Adim],
    ["Bdim", Bdim],
  ],
  Augmented: [
    ["Caug", Caug],
    ["Daug", Daug],
    ["Eaug", Eaug],
    ["Faug", Faug],
    ["Gaug", Gaug],
    ["Aaug", Aaug],
    ["Baug", Baug],
  ],
  Sixths: [
    ["C6", C6],
    ["D6", D6],
    ["E6", E6],
    ["F6", F6],
    ["G6", G6],
    ["A6", A6],
    ["B6", B6],
  ],
  "Major 7ths": [
    ["Cmaj7", Cmaj7],
    ["Dmaj7", Dmaj7],
    ["Emaj7", Emaj7],
    ["Fmaj7", Fmaj7],
    ["Gmaj7", Gmaj7],
    ["Amaj7", Amaj7],
    ["Bmaj7", Bmaj7],
  ],
  "9ths": [
    ["C9", C9],
    ["D9", D9],
    ["E9", E9],
    ["F9", F9],
    ["G9", G9],
    ["A9", A9],
    ["B9", B9],
  ],
};
