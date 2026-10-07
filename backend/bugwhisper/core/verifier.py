"""
Two-Stage Verification Engine.
Stage 1: Static AST validation to instantly reject syntax regressions.
Stage 2: Dynamic sandboxed re-execution to verify error resolution.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Optional

from bugwhisper.core.ast_validator import validate_syntax
from bugwhisper.core.diff_engine import DiffResult, generate_diff
from bugwhisper.core.runner import RunResult, run_code_sandboxed
from bugwhisper.core.traceback_parser import TracebackAnalysis, parse_traceback


class VerificationStatus(str, Enum):
    """Categorization of remediation verification outcome."""
    VERIFIED = "VERIFIED"           # Re-executed cleanly with exit code 0
    SYNTAX_PASSED = "SYNTAX_PASSED" # AST parsed, dynamic execution skipped
    FAILED = "FAILED"               # Re-execution failed with the exact same error
    REGRESSED = "REGRESSED"         # Re-execution failed with a new or different error
    SYNTAX_ERROR = "SYNTAX_ERROR"   # Proposed patch has invalid syntax


@dataclass(frozen=True)
class VerificationResult:
    """Detailed outcome of the two-stage verification process."""
    status: VerificationStatus
    is_valid_syntax: bool
    repaired_code: str
    original_error: Optional[TracebackAnalysis]
    new_error: Optional[TracebackAnalysis]
    runner_output: Optional[RunResult]
    diff: DiffResult
    details: str


def verify_remediation(
    original_code: str,
    repaired_code: str,
    original_error: Optional[TracebackAnalysis] = None,
    dynamic_exec: bool = True,
    timeout_seconds: float = 3.0,
    python_executable: Optional[str] = None,
    venv: Optional[str] = None,
) -> VerificationResult:
    """
    Executes two-stage verification against repaired code.
    1. Static syntax check via AST compilation.
    2. Dynamic sandboxed execution (if dynamic_exec is True).
    """
    # Compute diff
    diff_res = generate_diff(original_code, repaired_code)

    # Stage 1: Static AST Validation
    syntax_res = validate_syntax(repaired_code)
    if not syntax_res.is_valid:
        return VerificationResult(
            status=VerificationStatus.SYNTAX_ERROR,
            is_valid_syntax=False,
            repaired_code=repaired_code,
            original_error=original_error,
            new_error=None,
            runner_output=None,
            diff=diff_res,
            details=f"SyntaxError in remediation at line {syntax_res.line_number}: {syntax_res.error_message}",
        )

    if not dynamic_exec:
        return VerificationResult(
            status=VerificationStatus.SYNTAX_PASSED,
            is_valid_syntax=True,
            repaired_code=repaired_code,
            original_error=original_error,
            new_error=None,
            runner_output=None,
            diff=diff_res,
            details="Static syntax verification succeeded. Dynamic execution was skipped.",
        )

    # Stage 2: Dynamic Sandboxed Re-run
    run_result = run_code_sandboxed(
        repaired_code,
        timeout_seconds=timeout_seconds,
        python_executable=python_executable,
        venv=venv,
    )

    if run_result.timed_out:
        return VerificationResult(
            status=VerificationStatus.REGRESSED,
            is_valid_syntax=True,
            repaired_code=repaired_code,
            original_error=original_error,
            new_error=None,
            runner_output=run_result,
            diff=diff_res,
            details=f"Execution timed out after {timeout_seconds}s (infinite loop or hang).",
        )

    if run_result.success:
        return VerificationResult(
            status=VerificationStatus.VERIFIED,
            is_valid_syntax=True,
            repaired_code=repaired_code,
            original_error=original_error,
            new_error=None,
            runner_output=run_result,
            diff=diff_res,
            details="Code executed successfully with exit code 0.",
        )

    # Execution failed; parse new traceback
    new_traceback = parse_traceback(run_result.stderr)

    # Compare against original error
    if (
        original_error is not None
        and original_error.has_error
        and new_traceback.has_error
        and original_error.error_type == new_traceback.error_type
        and original_error.line_number == new_traceback.line_number
    ):
        status = VerificationStatus.FAILED
        details = (
            f"Remediation failed: original error persisted ({new_traceback.error_type} "
            f"at line {new_traceback.line_number})."
        )
    else:
        status = VerificationStatus.REGRESSED
        err_desc = (
            f"{new_traceback.error_type} at line {new_traceback.line_number}: {new_traceback.error_message}"
            if new_traceback.has_error
            else f"Exit code {run_result.exit_code}: {run_result.stderr[:200]}"
        )
        details = f"Remediation introduced a regression or new error: {err_desc}"

    return VerificationResult(
        status=status,
        is_valid_syntax=True,
        repaired_code=repaired_code,
        original_error=original_error,
        new_error=new_traceback,
        runner_output=run_result,
        diff=diff_res,
        details=details,
    )
