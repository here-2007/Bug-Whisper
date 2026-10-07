"""
Unit tests for ChatML prompt builder.
"""

from bugwhisper.core.prompt_builder import build_chatml_prompt, MAX_STDERR_CHARS


def test_build_chatml_prompt_structure():
    code = "def divide(a, b):\n    return a / b"
    stderr = "Traceback (most recent call last):\n  File 'main.py', line 2\nZeroDivisionError: division by zero"

    bundle = build_chatml_prompt(code, stderr)

    # Check raw ChatML tags
    assert "<|im_start|>system" in bundle.raw_chatml
    assert "<|im_end|>" in bundle.raw_chatml
    assert "<|im_start|>user" in bundle.raw_chatml
    assert "<|im_start|>assistant\n```python" in bundle.raw_chatml

    # Check structured messages
    assert len(bundle.messages) == 2
    assert bundle.messages[0]["role"] == "system"
    assert bundle.messages[1]["role"] == "user"
    assert "ZeroDivisionError: division by zero" in bundle.messages[1]["content"]


def test_build_chatml_prompt_truncation():
    code = "x = 1"
    huge_stderr = "E" * 500

    bundle = build_chatml_prompt(code, huge_stderr)

    assert len(bundle.truncated_stderr) == MAX_STDERR_CHARS
    assert bundle.truncated_stderr == "E" * MAX_STDERR_CHARS
