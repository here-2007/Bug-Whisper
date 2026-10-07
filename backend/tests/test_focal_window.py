"""
Unit tests for AST focal window extraction and splicing.
"""

from bugwhisper.core.focal_window import extract_focal_window, splice_focal_window


def test_focal_window_short_code_unwindowed():
    short_code = "def add(a, b):\n    return a + b\n\nprint(add(1, 2))"
    window = extract_focal_window(short_code, target_line=2, char_threshold=1200)

    assert window.is_windowed is False
    assert window.scoped_code == short_code


def test_focal_window_large_code_enclosing_function():
    # Construct a file > 1200 chars with multiple functions
    func1 = "def helper_one():\n" + "    pass  # filler line\n" * 40
    func2 = "def faulty_function(x):\n    # This has an error\n    return x / 0\n" + "    pass  # filler line\n" * 20
    func3 = "def helper_two():\n" + "    pass  # filler line\n" * 40

    full_code = f"{func1}\n{func2}\n{func3}"
    assert len(full_code) > 1200

    # Locate the error line in func2
    lines = full_code.splitlines()
    error_line = None
    for idx, line in enumerate(lines, 1):
        if "return x / 0" in line:
            error_line = idx
            break

    assert error_line is not None

    window = extract_focal_window(full_code, target_line=error_line, char_threshold=1200)

    assert window.is_windowed is True
    assert "faulty_function" in window.scoped_code
    assert "return x / 0" in window.scoped_code
    assert "helper_one" not in window.scoped_code

    # Test splicing
    repaired_scope = window.scoped_code.replace("return x / 0", "return x / 1")
    spliced = splice_focal_window(full_code, repaired_scope, window)

    assert "return x / 1" in spliced
    assert "return x / 0" not in spliced
    assert "helper_one" in spliced
    assert "helper_two" in spliced
