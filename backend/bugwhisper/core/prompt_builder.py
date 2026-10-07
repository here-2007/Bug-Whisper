"""
Strict ChatML Prompt Contract Builder.
Adheres 100% to the 3-turn template and length budget defined in context.md.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional

SYSTEM_PROMPT = (
    "You are an expert Python bug-fixing assistant. "
    "Fix all errors in the provided code and return only the corrected Python code."
)

MAX_STDERR_CHARS = 300
MAX_TOTAL_CHARS = 1800


@dataclass(frozen=True)
class PromptBundle:
    """Carries formatted prompt in both raw ChatML string and structured message formats."""
    raw_chatml: str
    messages: List[Dict[str, str]]
    truncated_stderr: str
    char_count: int


def build_chatml_prompt(code: str, stderr: str) -> PromptBundle:
    """
    Constructs the exact 3-turn ChatML prompt used during Qwen 2.5 Coder 3B fine-tuning.

    Contract:
    - stderr is sliced strictly to the first 300 characters.
    - system prompt is identical to training distribution.
    - Assistant turn primes code output with ```python.
    """
    clean_stderr = (stderr or "").strip()
    truncated_stderr = clean_stderr[:MAX_STDERR_CHARS]

    user_content = (
        f"Fix the bug in this Python code:\n\n"
        f"```python\n"
        f"{code}\n"
        f"```\n\n"
        f"Error output:\n"
        f"```\n"
        f"{truncated_stderr}\n"
        f"```"
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_content},
    ]

    raw_chatml = (
        f"<|im_start|>system\n"
        f"{SYSTEM_PROMPT}<|im_end|>\n"
        f"<|im_start|>user\n"
        f"{user_content}<|im_end|>\n"
        f"<|im_start|>assistant\n"
        f"```python\n"
    )

    total_chars = len(code) + len(truncated_stderr)

    return PromptBundle(
        raw_chatml=raw_chatml,
        messages=messages,
        truncated_stderr=truncated_stderr,
        char_count=total_chars,
    )
