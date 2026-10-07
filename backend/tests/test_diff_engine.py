"""
Unit tests for the diff engine.
"""

from bugwhisper.core.diff_engine import generate_diff


def test_diff_engine_identical_code():
    code = "def add(a, b):\n    return a + b\n"
    res = generate_diff(code, code)
    assert not res.has_changes
    assert res.additions == 0
    assert res.deletions == 0
    assert res.diff_text == ""


def test_diff_engine_modifications():
    orig = "def div(a, b):\n    return a / b\n"
    rep = "def div(a, b):\n    if b == 0:\n        return 0\n    return a / b\n"
    res = generate_diff(orig, rep)
    assert res.has_changes
    assert res.additions > 0
    assert "+    if b == 0:" in res.diff_text
    assert len(res.modified_line_ranges) > 0


def test_diff_engine_replacement():
    orig = "x = 1\ny = 2\n"
    rep = "x = 10\ny = 20\n"
    res = generate_diff(orig, rep)
    assert res.has_changes
    assert res.additions == 2
    assert res.deletions == 2
