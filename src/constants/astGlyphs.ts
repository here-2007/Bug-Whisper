// 8-Bit AST fault-localization glyph matrices
export const AST_GLYPHS: number[][][] = [
  // 1: Center Cross
  [
    [0, 1, 0],
    [1, 2, 1],
    [0, 1, 0],
  ],
  // 2: Box Loop
  [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  // 3: Plus Pointer
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 2, 1],
  ],
  // 4: Corner Target
  [
    [1, 1, 0],
    [1, 2, 0],
    [0, 0, 0],
  ],
  // 5: Diamond Node
  [
    [0, 1, 0],
    [1, 2, 1],
    [0, 1, 0],
  ],
  // 6: Step Diagonal
  [
    [1, 0, 0],
    [0, 2, 0],
    [0, 0, 1],
  ],
  // 7: Corner Bracket
  [
    [0, 0, 0],
    [0, 2, 1],
    [0, 1, 1],
  ],
  // 8: Gutter Pill
  [
    [1, 1, 1],
    [0, 2, 0],
    [1, 1, 1],
  ],
  // 9: Cluster End
  [
    [0, 0, 0],
    [1, 2, 1],
    [1, 1, 1],
  ],
];

// Alias for backwards compatibility
export const CONVEX_GLYPHS = AST_GLYPHS;
