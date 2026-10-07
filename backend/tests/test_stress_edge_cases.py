"""
Stress and Edge-Case Tests.
Tests recursion limits, massive stdout truncation, temporary file isolation,
Unicode handling, sys.exit codes, and AST focal windowing on complex structures.
"""

from bugwhisper.core.focal_window import extract_focal_window, splice_focal_window
from bugwhisper.core.runner import run_code_sandboxed
from bugwhisper.core.traceback_parser import parse_traceback


def test_recursion_error_handling():
    code = "def recurse(n):\n    return recurse(n + 1)\n\nrecurse(0)\n"
    res = run_code_sandboxed(code, timeout_seconds=3.0)
    assert not res.success
    analysis = parse_traceback(res.stderr)
    assert analysis.has_error
    assert analysis.error_type == "RecursionError"
    assert "maximum recursion depth exceeded" in (analysis.error_message or "")


def test_massive_output_truncation():
    # Print 50,000 characters
    code = "print('A' * 50000)\n"
    res = run_code_sandboxed(code, timeout_seconds=3.0, max_output_chars=2000)
    assert res.success
    assert len(res.stdout) == 2000
    assert res.stdout.startswith("AAAA")


def test_scratch_dir_file_creation_isolation():
    code = "with open('temp_created_file.txt', 'w') as f:\n    f.write('transient')\nprint('done')\n"
    res = run_code_sandboxed(code, timeout_seconds=2.0)
    assert res.success
    assert "done" in res.stdout


def test_unicode_and_emojis():
    code = "msg = '🚀 Bug Whisper 🐍 调试成功'\nprint(msg)\n"
    res = run_code_sandboxed(code, timeout_seconds=2.0)
    assert res.success
    assert "🚀 Bug Whisper 🐍 调试成功" in res.stdout


def test_sys_exit_code():
    code = "import sys\nsys.exit(42)\n"
    res = run_code_sandboxed(code, timeout_seconds=2.0)
    assert not res.success
    assert res.exit_code == 42
    analysis = parse_traceback(res.stderr)
    assert not analysis.has_error


def test_focal_window_class_method():
    lines = [
        "class Calculator:",
        "    def __init__(self, base: int):",
        "        self.base = base",
        "        self.history = []",
        "",
        "    def log_operation(self, op: str) -> None:",
        "        self.history.append(op)",
        "",
        "    def compute_average(self, total: int, count: int) -> float:",
        "        return (total / count) + self.base",
        "",
        "    def reset(self) -> None:",
        "        self.history.clear()",
        "",
        "    def get_summary(self) -> str:",
        "        return f'Base: {self.base}, Ops: {len(self.history)}'",
        "",
        "    def add_constant(self, val: int) -> int:",
        "        return self.base + val",
        "",
        "    def subtract_constant(self, val: int) -> int:",
        "        return self.base - val",
        "",
        "    def is_positive(self) -> bool:",
        "        return self.base > 0",
        "",
        "    def helper(self):",
        "        return True",
    ]
    code = "\n".join(lines) + "\n"
    # Target line 10: "return (total / count) + self.base"
    focal = extract_focal_window(code, target_line=10, char_threshold=50)
    assert focal.is_windowed
    assert "def compute_average" in focal.scoped_code
    assert "return (total / count) + self.base" in focal.scoped_code

    # Splice back a repaired method
    repaired_method = (
        "    def compute_average(self, total: int, count: int) -> float:\n"
        "        return ((total / count) if count != 0 else 0.0) + self.base"
    )
    spliced = splice_focal_window(code, repaired_method, focal)
    assert "class Calculator:" in spliced
    assert "count != 0" in spliced
    assert "def helper(self):" in spliced


def test_chained_exceptions_parsing():
    chained_tb = (
        'Traceback (most recent call last):\n'
        '  File "main.py", line 2, in step_one\n'
        '    raise ValueError("first error")\n'
        'ValueError: first error\n\n'
        'During handling of the above exception, another exception occurred:\n\n'
        'Traceback (most recent call last):\n'
        '  File "main.py", line 6, in step_two\n'
        '    raise RuntimeError("second error")\n'
        'RuntimeError: second error\n'
    )
    analysis = parse_traceback(chained_tb)
    assert analysis.has_error
    assert analysis.error_type == "RuntimeError"
    assert analysis.error_message == "second error"
    assert analysis.line_number == 6
