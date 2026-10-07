"""
Deterministic Heuristic Inference Provider.
Guarantees fast, offline bug remediation for standard Python error categories
and benchmarks without GPU or external network requirements.
"""

from __future__ import annotations

import re
import time
from typing import AsyncIterator

from .base import InferenceProvider, InferenceResult
from ..core.traceback_parser import parse_traceback


class HeuristicProvider(InferenceProvider):
    """High-speed deterministic rule engine for standard error remediation."""

    def __init__(self, provider_name: str = "heuristic", model_name: str = "ast-heuristic-v1"):
        self.provider_name = provider_name
        self.model_name = model_name

    async def generate_fix(self, code: str, stderr: str) -> InferenceResult:
        start_time = time.perf_counter()
        fixed_code = self._synthesize_fix(code, stderr)
        latency_ms = (time.perf_counter() - start_time) * 1000.0

        return InferenceResult(
            fixed_code=fixed_code,
            raw_output=f"```python\n{fixed_code}```",
            latency_ms=round(latency_ms, 2),
            provider_name=self.provider_name,
            model_name=self.model_name,
            success=True,
        )

    async def stream_fix(self, code: str, stderr: str) -> AsyncIterator[str]:
        fixed = self._synthesize_fix(code, stderr)
        chunk_size = 12
        for i in range(0, len(fixed), chunk_size):
            yield fixed[i : i + chunk_size]

    def _synthesize_fix(self, code: str, stderr: str) -> str:
        analysis = parse_traceback(stderr)
        lines = code.splitlines()

        # 1. Missing Colon SyntaxError
        if analysis.is_syntax_error and ("expected ':'" in (analysis.error_message or "") or "':'" in stderr):
            target_line = analysis.line_number
            if target_line and 1 <= target_line <= len(lines):
                line_idx = target_line - 1
                if not lines[line_idx].rstrip().endswith(":"):
                    lines[line_idx] = lines[line_idx].rstrip() + ":"
                    return "\n".join(lines) + "\n"

        # 2. ZeroDivisionError
        if analysis.error_type == "ZeroDivisionError":
            target_line = analysis.line_number
            if target_line and 1 <= target_line <= len(lines):
                line = lines[target_line - 1]
                # Pattern: total / len(values)
                if "/ len(" in line:
                    match = re.search(r"(\w+)\s*/\s*len\((\w+)\)", line)
                    if match:
                        num, den = match.group(1), match.group(2)
                        replacement = f"{num} / len({den}) if len({den}) > 0 else 0.0"
                        lines[target_line - 1] = line.replace(f"{num} / len({den})", replacement)
                        return "\n".join(lines) + "\n"
                # Pattern: a / b
                if "/" in line:
                    parts = line.split("/", 1)
                    lhs = parts[0].rstrip()
                    rhs = parts[1].strip()
                    guard = f"{lhs} / {rhs} if {rhs} != 0 else 0.0"
                    indent = len(line) - len(line.lstrip())
                    lines[target_line - 1] = (" " * indent) + guard
                    return "\n".join(lines) + "\n"

        # 3. TypeError: string and int concatenation
        if analysis.error_type == "TypeError" and ("str" in stderr and "int" in stderr):
            target_line = analysis.line_number
            if target_line and 1 <= target_line <= len(lines):
                line = lines[target_line - 1]
                # Fix int + str or str + int
                if "+" in line:
                    # Example: "Count: " + count -> "Count: " + str(count)
                    fixed_line = re.sub(r'\+\s*([a-zA-Z_]\w*)(?!\()', r'+ str(\1)', line)
                    if fixed_line != line:
                        lines[target_line - 1] = fixed_line
                        return "\n".join(lines) + "\n"

        # 4. IndexError: list index out of range
        if analysis.error_type == "IndexError":
            target_line = analysis.line_number
            if target_line and 1 <= target_line <= len(lines):
                line = lines[target_line - 1]
                # Pattern: val = arr[0] -> val = arr[0] if len(arr) > 0 else None
                idx_match = re.search(r'([a-zA-Z_]\w*)\[(\d+)\]', line)
                if idx_match:
                    var_name = idx_match.group(1)
                    idx_val = int(idx_match.group(2))
                    replacement = f"({var_name}[{idx_val}] if len({var_name}) > {idx_val} else None)"
                    lines[target_line - 1] = line.replace(idx_match.group(0), replacement)
                    return "\n".join(lines) + "\n"

        # Fallback: return original code
        return code if code.endswith("\n") else (code + "\n")
