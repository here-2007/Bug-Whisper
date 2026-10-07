"""
Static AST & Syntax Validator.
Validates code without runtime execution to detect syntax regressions.
"""

from __future__ import annotations

import ast
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class SyntaxValidationResult:
    """Outcome of static syntax verification."""
    is_valid: bool
    error_message: Optional[str] = None
    line_number: Optional[int] = None
    column_offset: Optional[int] = None


def validate_syntax(code: str, filename: str = "<remediation>") -> SyntaxValidationResult:
    """
    Statically checks if Python source code parses and compiles cleanly.
    """
    try:
        compile(code, filename, "exec")
        ast.parse(code, filename)
        return SyntaxValidationResult(is_valid=True)
    except SyntaxError as syn_err:
        return SyntaxValidationResult(
            is_valid=False,
            error_message=syn_err.msg or "syntax error",
            line_number=syn_err.lineno,
            column_offset=syn_err.offset,
        )
    except Exception as exc:
        return SyntaxValidationResult(
            is_valid=False,
            error_message=str(exc),
        )
