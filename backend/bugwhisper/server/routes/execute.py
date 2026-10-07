"""
Sandboxed Execution Route.
Runs user code safely in a subprocess with timeout constraints and deterministic error extraction.
"""

from __future__ import annotations

from fastapi import APIRouter
from bugwhisper.core.runner import run_code_sandboxed
from bugwhisper.core.traceback_parser import parse_traceback
from bugwhisper.server.schemas import (
    ExecuteRequest,
    ExecuteResponse,
    StackFrameModel,
    TracebackAnalysisModel,
)

router = APIRouter(tags=["Execution"])


@router.post("/execute", response_model=ExecuteResponse)
async def execute_code(request: ExecuteRequest) -> ExecuteResponse:
    """Executes Python code in an isolated subprocess sandbox."""
    res = run_code_sandboxed(request.code, timeout_seconds=request.timeout_seconds)
    parsed = parse_traceback(res.stderr)

    user_frames = [
        StackFrameModel(
            filename=f.filename,
            line_number=f.line_number,
            function_name=f.function_name,
            code_line=f.code_line,
        )
        for f in parsed.user_frames
    ]

    analysis = TracebackAnalysisModel(
        has_error=parsed.has_error,
        error_type=parsed.error_type,
        error_message=parsed.error_message,
        line_number=parsed.line_number,
        column_offset=parsed.column_offset,
        offending_code=parsed.offending_code,
        user_frames=user_frames,
        clean_traceback=parsed.clean_traceback,
        is_syntax_error=parsed.is_syntax_error,
    )

    return ExecuteResponse(
        success=res.success,
        stdout=res.stdout,
        stderr=res.stderr,
        exit_code=res.exit_code,
        timed_out=res.timed_out,
        duration_ms=res.duration_ms,
        analysis=analysis,
    )
