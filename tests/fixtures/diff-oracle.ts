/**
 * Unified Git Diff Utility Oracle.
 * Produces standard git diff patches and verifies patch reversibility.
 */

export interface DiffHunk {
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: string[];
}

/**
 * Generates unified git diff patch between two strings.
 */
export function generateUnifiedDiff(
  original: string,
  fixed: string,
  filename: string = 'main.py'
): string {
  if (original === fixed) {
    return '';
  }

  const origLines = original.split('\n');
  const fixedLines = fixed.split('\n');

  // Simple Myers-style or line-by-line diff generator
  const lcs = computeLCS(origLines, fixedLines);
  const hunks = buildHunks(origLines, fixedLines, lcs);

  if (hunks.length === 0) {
    return '';
  }

  const header = `--- a/${filename}\n+++ b/${filename}`;
  const hunkStrings = hunks.map((hunk) => {
    const hunkHeader = `@@ -${hunk.oldStart},${hunk.oldCount} +${hunk.newStart},${hunk.newCount} @@`;
    return `${hunkHeader}\n${hunk.lines.join('\n')}`;
  });

  return `${header}\n${hunkStrings.join('\n')}\n`;
}

/**
 * Applies a unified diff patch to the original text.
 * Returns the patched text.
 */
export function applyUnifiedDiff(original: string, patchText: string): string {
  if (!patchText || patchText.trim() === '') {
    return original;
  }

  const patchLines = patchText.split('\n');
  const resultLines: string[] = [];
  let inHunk = false;

  for (const line of patchLines) {
    if (line.startsWith('--- ') || line.startsWith('+++ ')) {
      continue;
    }
    if (line.startsWith('@@ ')) {
      inHunk = true;
      continue;
    }
    if (inHunk) {
      if (line.startsWith('+')) {
        resultLines.push(line.slice(1));
      } else if (line.startsWith(' ')) {
        resultLines.push(line.slice(1));
      } else if (line.startsWith('-')) {
        // Line removed, skip
      }
    }
  }

  return resultLines.join('\n');
}

function computeLCS(a: string[], b: string[]): boolean[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (a[i] === b[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const matches: boolean[][] = Array.from({ length: m }, () => Array(n).fill(false));
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      matches[i - 1][j - 1] = true;
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return matches;
}

function buildHunks(
  origLines: string[],
  fixedLines: string[],
  matches: boolean[][]
): DiffHunk[] {
  let i = 0;
  let j = 0;
  const hunks: DiffHunk[] = [];
  const currentLines: string[] = [];
  let oldStart = 1;
  let newStart = 1;
  let oldCount = 0;
  let newCount = 0;

  while (i < origLines.length || j < fixedLines.length) {
    const isMatched = i < origLines.length && j < fixedLines.length && matches[i][j];

    if (isMatched) {
      currentLines.push(` ${origLines[i]}`);
      oldCount++;
      newCount++;
      i++;
      j++;
    } else if (i < origLines.length && (j >= fixedLines.length || !isRowMatched(matches, i))) {
      currentLines.push(`-${origLines[i]}`);
      oldCount++;
      i++;
    } else if (j < fixedLines.length) {
      currentLines.push(`+${fixedLines[j]}`);
      newCount++;
      j++;
    }
  }

  if (currentLines.some((l) => l.startsWith('+') || l.startsWith('-'))) {
    hunks.push({
      oldStart,
      oldCount,
      newStart,
      newCount,
      lines: currentLines,
    });
  }

  return hunks;
}

function isRowMatched(matches: boolean[][], row: number): boolean {
  return matches[row].some(Boolean);
}
