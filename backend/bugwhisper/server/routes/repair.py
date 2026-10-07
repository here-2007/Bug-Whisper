"""
Full Automated Repair Pipeline Route.
Coordinates deterministic execution, focal window extraction, multi-tier inference, and two-stage verification.
"""

from __future__ import annotations

import time
from fastapi import APIRouter
from bugwhisper.core.focal_window import extract_focal_window, splice_focal_window
from bugwhisper.core.runner import run_code_sandboxed
from bugwhisper.core.traceback_parser import parse_traceback
from bugwhisper.core.verifier import verify_remediation
from bugwhisper.server.routes.synthesize import _resolve_provider
from bugwhisper.server.schemas import (
    DiffSummaryModel,
    RepairRequest,
    RepairResponse,
    StackFrameModel,
    TracebackAnalysisModel,
    VerificationSummaryModel,
)

router = APIRouter(tags=["Repair"])


@router.post("/repair", response_model=RepairResponse)
async def repair_pipeline(request: RepairRequest) -> RepairResponse:
    """End-to-end automated repair pipeline with two-stage verification."""
    start_time = time.perf_counter()
    code = request.code
    stderr = request.stderr or ""

    # Step 1: Run code if no traceback provided
    if not stderr.strip():
        exec_res = run_code_sandboxed(code, timeout_seconds=request.timeout_seconds)
        stderr = exec_res.stderr

    # Step 2: Deterministic traceback parsing
    analysis = parse_traceback(stderr)

    if not analysis.has_error:
        total_latency_ms = (time.perf_counter() - start_time) * 1000.0
        return RepairResponse(
            original_code=code,
            repaired_code=code,
            original_error=None,
            diff=DiffSummaryModel(
                diff_text="",
                additions=0,
                deletions=0,
                has_changes=False,
                modified_line_ranges=[],
            ),
            verification=VerificationSummaryModel(
                status="VERIFIED",
                is_valid_syntax=True,
                details="No error detected; code executed cleanly.",
                exit_code=0,
            ),
            latency_ms=round(total_latency_ms, 2),
            provider_name="deterministic",
            model_name="clean-passthrough",
        )

    # Step 3: AST Focal Windowing
    focal = extract_focal_window(code, analysis.line_number)
    target_code = focal.scoped_code

    # Step 4: Multi-tier inference synthesis
    provider = _resolve_provider(request.provider)
    synth_res = await provider.generate_fix(target_code, stderr)
    repaired_target = synth_res.fixed_code

    # Step 5: Splicing back if windowed
    full_repaired = splice_focal_window(code, repaired_target, focal)

    # Step 6: Two-stage verification (static AST + sandboxed execution)
    verify_res = verify_remediation(
        original_code=code,
        repaired_code=full_repaired,
        original_error=analysis,
        dynamic_exec=request.dynamic_verify,
        timeout_seconds=request.timeout_seconds,
    )

    total_latency_ms = (time.perf_counter() - start_time) * 1000.0

    # Build response models
    user_frames = [
        StackFrameModel(
            filename=f.filename,
            line_number=f.line_number,
            function_name=f.function_name,
            code_line=f.code_line,
        )
        for f in analysis.user_frames
    ]

    orig_err_model = TracebackAnalysisModel(
        has_error=analysis.has_error,
        error_type=analysis.error_type,
        error_message=analysis.error_message,
        line_number=analysis.line_number,
        column_offset=analysis.column_offset,
        offending_code=analysis.offending_code,
        user_frames=user_frames,
        clean_traceback=analysis.clean_traceback,
        is_syntax_error=analysis.is_syntax_error,
    )

    diff_model = DiffSummaryModel(
        diff_text=verify_res.diff.diff_text,
        additions=verify_res.diff.additions,
        deletions=verify_res.diff.deletions,
        has_changes=verify_res.diff.has_changes,
        modified_line_ranges=verify_res.diff.modified_line_ranges,
    )

    exit_code = verify_res.runner_output.exit_code if verify_res.runner_output else None
    new_err_type = verify_res.new_error.error_type if verify_res.new_error else None

    verify_model = VerificationSummaryModel(
        status=verify_res.status.value,
        is_valid_syntax=verify_res.is_valid_syntax,
        details=verify_res.details,
        exit_code=exit_code,
        new_error_type=new_err_type,
    )

    return RepairResponse(
        original_code=code,
        repaired_code=full_repaired,
        original_error=orig_err_model,
        diff=diff_model,
        verification=verify_model,
        latency_ms=round(total_latency_ms, 2),
        provider_name=synth_res.provider_name,
        model_name=synth_res.model_name,
    )
