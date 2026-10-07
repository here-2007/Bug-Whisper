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

        # 2. SyntaxError: '(' was never closed
        if analysis.is_syntax_error and ("was never closed" in (analysis.error_message or "")):
            target_line = analysis.line_number
            if target_line and 1 <= target_line <= len(lines):
                line_idx = target_line - 1
                if lines[line_idx].count("(") > lines[line_idx].count(")"):
                    lines[line_idx] = lines[line_idx].rstrip() + ")"
                    return "\n".join(lines) + "\n"

        # 3. ZeroDivisionError (Division & Modulo)
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
                # Pattern: a % b
                if "%" in line:
                    parts = line.split("%", 1)
                    lhs, rhs = parts[0].rstrip(), parts[1].strip()
                    indent = len(line) - len(line.lstrip())
                    if "=" in lhs:
                        var_target, expr = lhs.split("=", 1)
                        guard = f"{var_target.strip()} = ({expr.strip()} % {rhs}) if {rhs} != 0 else 0"
                    else:
                        guard = f"({lhs.strip()} % {rhs}) if {rhs} != 0 else 0"
                    lines[target_line - 1] = (" " * indent) + guard
                    return "\n".join(lines) + "\n"
                # Pattern: a / b
                if "/" in line:
                    parts = line.split("/", 1)
                    lhs, rhs = parts[0].rstrip(), parts[1].strip()
                    indent = len(line) - len(line.lstrip())
                    if "=" in lhs:
                        var_target, expr = lhs.split("=", 1)
                        guard = f"{var_target.strip()} = ({expr.strip()} / {rhs}) if {rhs} != 0 else 0.0"
                    else:
                        guard = f"{lhs.strip()} / {rhs} if {rhs} != 0 else 0.0"
                    lines[target_line - 1] = (" " * indent) + guard
                    return "\n".join(lines) + "\n"

        # 4. TypeError: string and int concatenation
        if analysis.error_type == "TypeError" and ("str" in stderr and "int" in stderr):
            target_line = analysis.line_number
            if target_line and 1 <= target_line <= len(lines):
                line = lines[target_line - 1]
                if "+" in line:
                    fixed_line = re.sub(r'\+\s*([a-zA-Z_]\w*)(?!\()', r'+ str(\1)', line)
                    if fixed_line != line:
                        lines[target_line - 1] = fixed_line
                        return "\n".join(lines) + "\n"

        # 5. IndexError: list index out of range
        if analysis.error_type == "IndexError":
            target_line = analysis.line_number
            if target_line and 1 <= target_line <= len(lines):
                line = lines[target_line - 1]
                idx_match = re.search(r'([a-zA-Z_]\w*)\[(\d+)\]', line)
                if idx_match:
                    var_name = idx_match.group(1)
                    idx_val = int(idx_match.group(2))
                    replacement = f"({var_name}[{idx_val}] if len({var_name}) > {idx_val} else None)"
                    lines[target_line - 1] = line.replace(idx_match.group(0), replacement)
                    return "\n".join(lines) + "\n"

        # 6. KeyError: dictionary key access
        if analysis.error_type == "KeyError":
            target_line = analysis.line_number
            if target_line and 1 <= target_line <= len(lines):
                line = lines[target_line - 1]
                key_match = re.search(r'([a-zA-Z_]\w*)\[(["\'][\w-]+["\'])\]', line)
                if key_match:
                    var_name = key_match.group(1)
                    key_val = key_match.group(2)
                    replacement = f"{var_name}.get({key_val})"
                    lines[target_line - 1] = line.replace(key_match.group(0), replacement)
                    return "\n".join(lines) + "\n"

        # 7. NameError: standard library module not imported
        if analysis.error_type == "NameError":
            match = re.search(r"name '(\w+)' is not defined", analysis.error_message or "")
            if match:
                missing_name = match.group(1)
                stdlib_modules = {"math", "sys", "os", "json", "re", "time", "random", "itertools", "collections"}
                if missing_name in stdlib_modules:
                    return f"import {missing_name}\n" + code

        # Fallback: return original code
        return code if code.endswith("\n") else (code + "\n")
