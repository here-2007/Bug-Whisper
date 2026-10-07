"""
Unit tests for deterministic Python sandbox runner.
"""

import sys
import pytest
from bugwhisper.core.runner import run_code_sandboxed


def test_runner_successful_execution():
    code = "print('Hello, Bug Whisper!')\nx = 10 + 20\nprint(f'Result: {x}')"
    result = run_code_sandboxed(code, timeout_seconds=5.0)

    assert result.success is True
    assert result.exit_code == 0
    assert result.timed_out is False
    assert "Hello, Bug Whisper!" in result.stdout
    assert "Result: 30" in result.stdout
    assert result.stderr == ""
    assert result.duration_ms > 0


def test_runner_runtime_exception():
    code = "def divide(a, b):\n    return a / b\n\nprint(divide(10, 0))"
    result = run_code_sandboxed(code, timeout_seconds=5.0)

    assert result.success is False
    assert result.exit_code != 0
    assert result.timed_out is False
    assert "ZeroDivisionError" in result.stderr
    assert "division by zero" in result.stderr


def test_runner_syntax_error():
    code = "def invalid_syntax(\n    return 42"
    result = run_code_sandboxed(code, timeout_seconds=5.0)

    assert result.success is False
    assert result.exit_code != 0
    assert "SyntaxError" in result.stderr


def test_runner_timeout_termination():
    code = "import time\nwhile True:\n    time.sleep(0.1)"
    result = run_code_sandboxed(code, timeout_seconds=1.0)

    assert result.success is False
    assert result.timed_out is True
    assert result.exit_code == -1
    assert "TimeoutError" in result.stderr


def test_runner_stdin_eof_no_deadlock():
    # Calling input() should fail with EOFError immediately instead of hanging
    code = "val = input('Prompt: ')\nprint(val)"
    result = run_code_sandboxed(code, timeout_seconds=2.0)

    assert result.success is False
    assert result.timed_out is False  # Must not time out
    assert "EOFError" in result.stderr
