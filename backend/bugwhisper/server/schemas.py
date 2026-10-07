"""
Pydantic Request and Response Schemas for Bug Whisper API.
"""

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class ExecuteRequest(BaseModel):
    """Payload for code execution in the isolated sandbox."""
    code: str = Field(..., description="Python source code to execute")
    timeout_seconds: float = Field(default=3.0, description="Max execution duration in seconds")


class StackFrameModel(BaseModel):
    """Serialized stack frame from traceback."""
    filename: str
    line_number: int
    function_name: str
    code_line: str


class TracebackAnalysisModel(BaseModel):
    """Detailed deterministic extraction of Python traceback."""
    has_error: bool
    error_type: Optional[str] = None
    error_message: Optional[str] = None
    line_number: Optional[int] = None
    column_offset: Optional[int] = None
    offending_code: Optional[str] = None
    user_frames: List[StackFrameModel] = Field(default_factory=list)
    clean_traceback: str = ""
    is_syntax_error: bool = False


class ExecuteResponse(BaseModel):
    """Result of sandboxed code execution."""
    success: bool
    stdout: str
    stderr: str
    exit_code: int
    timed_out: bool
    duration_ms: float
    analysis: TracebackAnalysisModel


class SynthesizeRequest(BaseModel):
    """Payload for direct LLM or heuristic code remediation."""
    code: str = Field(..., description="Python code containing a bug")
    stderr: str = Field(..., description="Error message or traceback output")
    provider: Optional[str] = Field(default=None, description="Requested provider: heuristic, ollama, openai")


class SynthesizeResponse(BaseModel):
    """Output from synthesis engine."""
    fixed_code: str
    latency_ms: float
    provider_name: str
    model_name: str
    success: bool


class DiffSummaryModel(BaseModel):
    """Change statistics and unified diff text."""
    diff_text: str
    additions: int
    deletions: int
    has_changes: bool
    modified_line_ranges: List[int] = Field(default_factory=list)


class VerificationSummaryModel(BaseModel):
    """Outcome of two-stage static AST and dynamic verification."""
    status: str
    is_valid_syntax: bool
    details: str
    exit_code: Optional[int] = None
    new_error_type: Optional[str] = None


class RepairRequest(BaseModel):
    """High-level one-shot request to diagnose, synthesize, and verify a bug fix."""
    code: str = Field(..., description="Source code to repair")
    stderr: Optional[str] = Field(default=None, description="Optional pre-existing traceback")
    provider: Optional[str] = Field(default=None, description="Inference provider override")
    dynamic_verify: bool = Field(default=True, description="Whether to dynamically re-execute fix")
    timeout_seconds: float = Field(default=3.0, description="Max runtime for sandbox execution")


class RepairResponse(BaseModel):
    """Full remediation pipeline report."""
    original_code: str
    repaired_code: str
    original_error: Optional[TracebackAnalysisModel] = None
    diff: DiffSummaryModel
    verification: VerificationSummaryModel
    latency_ms: float
    provider_name: str
    model_name: str


class PresetItem(BaseModel):
    """Curated bug example."""
    id: str
    title: str
    category: str
    code: str
    description: str


class HealthResponse(BaseModel):
    """Health check report."""
    status: str
    version: str
    python_version: str
    available_providers: List[str]
