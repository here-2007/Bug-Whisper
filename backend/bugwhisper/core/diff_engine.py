"""
Unified Diff Engine.
Calculates high-precision unified diffs and structural change metrics between original and repaired code.
"""

from __future__ import annotations

import difflib
import re
from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class DiffResult:
    """Summary and raw content of a code diff."""
    diff_text: str
    additions: int
    deletions: int
    has_changes: bool
    modified_line_ranges: List[int]


def generate_diff(
    original_code: str,
    repaired_code: str,
    original_filename: str = "original.py",
    repaired_filename: str = "repaired.py",
) -> DiffResult:
    """
    Generates a unified diff between original and repaired code.
    Calculates addition/deletion counts and tracks affected original line numbers.
    """
    orig_lines = original_code.splitlines(keepends=True)
    rep_lines = repaired_code.splitlines(keepends=True)

    diff_generator = difflib.unified_diff(
        orig_lines,
        rep_lines,
        fromfile=original_filename,
        tofile=repaired_filename,
        lineterm="\n",
    )
    diff_lines = list(diff_generator)
    diff_text = "".join(diff_lines)

    additions = sum(
        1 for line in diff_lines if line.startswith("+") and not line.startswith("+++")
    )
    deletions = sum(
        1 for line in diff_lines if line.startswith("-") and not line.startswith("---")
    )
    has_changes = original_code != repaired_code and (additions > 0 or deletions > 0)

    # Extract original line numbers affected from hunk headers (@@ -start,count +start,count @@)
    modified_ranges: List[int] = []
    hunk_pattern = re.compile(r"^@@\s+-(\d+)(?:,(\d+))?\s+\+(\d+)(?:,(\d+))?\s+@@")
    for line in diff_lines:
        match = hunk_pattern.match(line)
        if match:
            start_line = int(match.group(1))
            modified_ranges.append(start_line)

    return DiffResult(
        diff_text=diff_text,
        additions=additions,
        deletions=deletions,
        has_changes=has_changes,
        modified_line_ranges=modified_ranges,
    )
