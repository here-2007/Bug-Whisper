"""
Code Sanitizer & Markdown Fence Stripper.
Extracts pure executable Python code from LLM generation and strips
conversational filler, trailing tags, and markdown formatting.
"""

from __future__ import annotations

import re


_CODE_BLOCK_RE = re.compile(
    r"```(?:python)?\s*\n(?P<code>.*?)```",
    re.DOTALL | re.IGNORECASE,
)

_UNCLOSED_CODE_BLOCK_RE = re.compile(
    r"```(?:python)?\s*\n(?P<code>.*)",
    re.DOTALL | re.IGNORECASE,
)


def extract_python_code(raw_output: str) -> str:
    """
    Deterministically extracts pure Python code from model output.

    Handles:
    - Standard markdown fences: ```python ... ```
    - Incomplete/unclosed markdown fences: ```python ...
    - Special ChatML tokens (<|im_end|>, <|im_start|>, <|endoftext|>)
    - Conversational preambles or post-scripts.
    """
    if not raw_output:
        return ""

    text = raw_output.strip()

    # Strip special ChatML tokens
    for token in ("<|im_end|>", "<|im_start|>", "<|endoftext|>", "assistant"):
        text = text.replace(token, "")
    text = text.strip()

    # 1. Closed code block match
    match = _CODE_BLOCK_RE.search(text)
    if match:
        code = match.group("code")
        return code.strip() + "\n"

    # 2. Unclosed code block match (e.g. streamed output or token cut)
    unclosed_match = _UNCLOSED_CODE_BLOCK_RE.search(text)
    if unclosed_match:
        code = unclosed_match.group("code")
        return code.strip() + "\n"

    # 3. If no fences, treat the clean string as raw code if it looks like code
    lines = text.splitlines()
    clean_lines = []
    in_code = False
    for line in lines:
        stripped = line.strip()
        # Skip conversational intros
        if not in_code and (
            stripped.lower().startswith("here is")
            or stripped.lower().startswith("sure")
            or stripped.lower().startswith("fixed code:")
        ):
            continue
        clean_lines.append(line)

    result = "\n".join(clean_lines).strip()
    return (result + "\n") if result else ""
