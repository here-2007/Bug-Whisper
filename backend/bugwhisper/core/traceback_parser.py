"""
Deterministic CPython Traceback and Error Parser.
Handles dual-mode parsing (SyntaxError compile-time vs runtime exception stack inspection)
and filters out standard-library frames to pinpoint user-script bugs.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import List, Optional


@dataclass(frozen=True)
class StackFrame:
    """Represents a single frame in a Python call stack."""
    filename: str
    line_number: int
    function_name: str
    code_line: str


@dataclass(frozen=True)
class TracebackAnalysis:
    """Structured extraction of an unhandled Python exception."""
    has_error: bool
    error_type: Optional[str] = None
    error_message: Optional[str] = None
    line_number: Optional[int] = None
    column_offset: Optional[int] = None
    offending_code: Optional[str] = None
    user_frames: List[StackFrame] = field(default_factory=list)
    clean_traceback: str = ""
    is_syntax_error: bool = False


# Regex patterns for Python tracebacks and syntax errors
_SYNTAX_ERROR_RE = re.compile(
    r'File\s+"(?P<file>[^"]+)",\s+line\s+(?P<line>\d+)'
    r'(?:,\s+column\s+(?P<col>\d+))?'
    r'(?:\n\s+(?P<code>.+?)\n\s*(?P<caret>\^))?'
    r'.*?\n(?P<err_type>[A-Za-z_][A-Za-z0-9_]*Error):\s*(?P<msg>.*)',
    re.DOTALL,
)

_FRAME_RE = re.compile(
    r'^\s*File\s+"(?P<file>[^"]+)",\s+line\s+(?P<line>\d+)(?:,\s+in\s+(?P<func>.+))?$'
)

_EXCEPTION_LINE_RE = re.compile(
    r'^(?:[A-Za-z_][A-Za-z0-9_]*\.)*(?P<type>[A-Za-z_][A-Za-z0-9_]*(?:Error|Exception|Warning|Interrupt|Exit))(?::\s*(?P<msg>.*))?$'
)


def parse_traceback(stderr: str, target_filename: str = "main.py") -> TracebackAnalysis:
    """
    Deterministically parses Python stderr output into structured error metadata.

    Features:
    - Dedicated SyntaxError/IndentationError parser capturing line, column caret, and message.
    - Reverse stack search: ignores library frames (e.g. urllib, json) and isolates the user's call frame.
    - Cleans and formats the traceback for LLM prompt ingestion.
    """
    if not stderr or not stderr.strip():
        return TracebackAnalysis(has_error=False)

    lines = [line.rstrip() for line in stderr.splitlines() if line.strip()]
    clean_stderr = "\n".join(lines)

    # 1. Compile-Time SyntaxError Check
    syntax_match = _SYNTAX_ERROR_RE.search(clean_stderr)
    if syntax_match and ("SyntaxError" in clean_stderr or "IndentationError" in clean_stderr):
        err_type = syntax_match.group("err_type") or "SyntaxError"
        err_msg = (syntax_match.group("msg") or "").strip()
        line_num = int(syntax_match.group("line"))
        col_offset = None
        caret_str = syntax_match.group("caret")
        if caret_str:
            # Determine column offset from leading spaces on the caret line
            col_offset = len(caret_str) - 1
        code_line = (syntax_match.group("code") or "").strip()

        return TracebackAnalysis(
            has_error=True,
            error_type=err_type,
            error_message=err_msg,
            line_number=line_num,
            column_offset=col_offset,
            offending_code=code_line if code_line else None,
            user_frames=[
                StackFrame(
                    filename=target_filename,
                    line_number=line_num,
                    function_name="<module>",
                    code_line=code_line,
                )
            ],
            clean_traceback=clean_stderr,
            is_syntax_error=True,
        )

    # 2. Runtime Exception Stack Parsing
    user_frames: List[StackFrame] = []
    all_frames: List[StackFrame] = []
    error_type: Optional[str] = None
    error_message: Optional[str] = None

    i = 0
    while i < len(lines):
        line = lines[i]
        frame_match = _FRAME_RE.match(line)
        if frame_match:
            fn = frame_match.group("file")
            ln = int(frame_match.group("line"))
            func = (frame_match.group("func") or "<module>").strip()

            # The next line is usually the source code line
            code_line = ""
            if i + 1 < len(lines) and not _FRAME_RE.match(lines[i + 1]) and not _EXCEPTION_LINE_RE.match(lines[i + 1]):
                code_line = lines[i + 1].strip()
                i += 1

            frame = StackFrame(
                filename=fn,
                line_number=ln,
                function_name=func,
                code_line=code_line,
            )
            all_frames.append(frame)

            # Check if this frame is from standard library
            fn_lower = fn.lower().replace("\\", "/")
            is_stdlib = (
                "<frozen " in fn_lower
                or "/site-packages/" in fn_lower
                or "/dist-packages/" in fn_lower
                or (
                    "/lib/" in fn_lower
                    and any(pkg in fn_lower for pkg in ["python3", "cpython", "appdata", "json", "urllib", "asyncio", "http", "socket"])
                )
            )

            # Frame belongs to user if it matches target filename, is <string>/<stdin>, or is non-stdlib
            if target_filename in fn or fn in {"<string>", "<stdin>"} or not is_stdlib:
                user_frames.append(frame)

        else:
            # Check for exception class at the end of the traceback
            exc_match = _EXCEPTION_LINE_RE.match(line)
            if exc_match:
                error_type = exc_match.group("type")
                error_message = (exc_match.group("msg") or "").strip()

        i += 1

    if not error_type and not all_frames:
        # Fallback: check if the last line resembles an error
        last_line = lines[-1] if lines else ""
        if "Error:" in last_line or "Exception:" in last_line:
            parts = last_line.split(":", 1)
            error_type = parts[0].strip()
            error_message = parts[1].strip() if len(parts) > 1 else ""
            return TracebackAnalysis(
                has_error=True,
                error_type=error_type,
                error_message=error_message,
                clean_traceback=clean_stderr,
            )
        return TracebackAnalysis(has_error=False, clean_traceback=clean_stderr)

    # Reverse frame search: pick the deepest frame originating from user code
    target_frame = user_frames[-1] if user_frames else (all_frames[-1] if all_frames else None)

    return TracebackAnalysis(
        has_error=True,
        error_type=error_type or "RuntimeError",
        error_message=error_message or "",
        line_number=target_frame.line_number if target_frame else None,
        offending_code=target_frame.code_line if target_frame else None,
        user_frames=user_frames if user_frames else all_frames,
        clean_traceback=clean_stderr,
        is_syntax_error=False,
    )
