"""
AST-guided Focal Window Extractor.
For files exceeding the model's 768-token training budget (>1,200 chars),
identifies and extracts only the enclosing function/class or line context
containing the offending line number, and splices repaired blocks back cleanly.
"""

from __future__ import annotations

import ast
from dataclasses import dataclass
from typing import Optional, Tuple


@dataclass(frozen=True)
class FocalWindow:
    """Represents a localized snippet of code containing a bug."""
    scoped_code: str
    start_line: int  # 1-indexed
    end_line: int    # 1-indexed, inclusive
    is_windowed: bool


def extract_focal_window(
    full_code: str,
    target_line: Optional[int],
    char_threshold: int = 1200,
    context_lines: int = 15,
) -> FocalWindow:
    """
    Extracts a localized scope around `target_line` if `full_code` exceeds `char_threshold`.

    Priority:
    1. If code <= char_threshold or target_line is None: return full code.
    2. Enclosing AST FunctionDef / AsyncFunctionDef / ClassDef node.
    3. Fallback: line slice [target_line - context_lines : target_line + context_lines].
    """
    lines = full_code.splitlines()
    total_lines = len(lines)

    if len(full_code) <= char_threshold or target_line is None or total_lines <= 25:
        return FocalWindow(
            scoped_code=full_code,
            start_line=1,
            end_line=total_lines,
            is_windowed=False,
        )

    target_line = max(1, min(target_line, total_lines))

    # Try AST-based enclosing block search
    try:
        tree = ast.parse(full_code)
        enclosing_node = None

        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                start = getattr(node, "lineno", None)
                end = getattr(node, "end_lineno", None)
                if start is not None and end is not None and start <= target_line <= end:
                    # Pick the tightest enclosing scope
                    if enclosing_node is None or (end - start) < (enclosing_node.end_lineno - enclosing_node.lineno):
                        enclosing_node = node

        if enclosing_node is not None:
            start_l = enclosing_node.lineno
            end_l = enclosing_node.end_lineno
            scoped = "\n".join(lines[start_l - 1 : end_l])
            # If the enclosing block itself is reasonably sized, return it
            if len(scoped) <= char_threshold * 1.5:
                return FocalWindow(
                    scoped_code=scoped,
                    start_line=start_l,
                    end_line=end_l,
                    is_windowed=True,
                )

    except SyntaxError:
        # If code has syntax errors, ast.parse fails; fall back to line slicing
        pass

    # Line-slicing fallback
    start_l = max(1, target_line - context_lines)
    end_l = min(total_lines, target_line + context_lines)
    scoped = "\n".join(lines[start_l - 1 : end_l])

    return FocalWindow(
        scoped_code=scoped,
        start_line=start_l,
        end_line=end_l,
        is_windowed=True,
    )


def splice_focal_window(
    full_code: str,
    repaired_scoped_code: str,
    window: FocalWindow,
) -> str:
    """
    Splices the repaired focal window back into the original full source code.
    """
    if not window.is_windowed:
        return repaired_scoped_code

    lines = full_code.splitlines()
    before_lines = lines[: window.start_line - 1]
    after_lines = lines[window.end_line :]

    repaired_lines = repaired_scoped_code.splitlines()

    all_lines = before_lines + repaired_lines + after_lines
    return "\n".join(all_lines)
