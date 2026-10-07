"""
Unit tests for deterministic traceback parser.
"""

from bugwhisper.core.traceback_parser import parse_traceback


def test_parse_syntax_error():
    sample_stderr = """  File "main.py", line 3
    def calculate(x, y)
                       ^
SyntaxError: expected ':'
"""
    analysis = parse_traceback(sample_stderr, target_filename="main.py")

    assert analysis.has_error is True
    assert analysis.is_syntax_error is True
    assert analysis.error_type == "SyntaxError"
    assert "expected ':'" in (analysis.error_message or "")
    assert analysis.line_number == 3
    assert analysis.offending_code == "def calculate(x, y)"


def test_parse_indentation_error():
    sample_stderr = """  File "main.py", line 4
    return x + y
    ^
IndentationError: unexpected indent
"""
    analysis = parse_traceback(sample_stderr, target_filename="main.py")

    assert analysis.has_error is True
    assert analysis.is_syntax_error is True
    assert analysis.error_type == "IndentationError"
    assert "unexpected indent" in (analysis.error_message or "")
    assert analysis.line_number == 4


def test_parse_runtime_zerodivision():
    sample_stderr = """Traceback (most recent call last):
  File "main.py", line 7, in <module>
    result = compute(10, 0)
  File "main.py", line 4, in compute
    return a / b
ZeroDivisionError: division by zero
"""
    analysis = parse_traceback(sample_stderr, target_filename="main.py")

    assert analysis.has_error is True
    assert analysis.is_syntax_error is False
    assert analysis.error_type == "ZeroDivisionError"
    assert analysis.error_message == "division by zero"
    assert analysis.line_number == 4
    assert analysis.offending_code == "return a / b"
    assert len(analysis.user_frames) == 2


def test_parse_stdlib_frame_filtering():
    # If standard library raises an exception, the deepest user frame in main.py must be isolated
    sample_stderr = """Traceback (most recent call last):
  File "main.py", line 12, in parse_payload
    return json.loads(raw_data)
  File "C:\\Python311\\Lib\\json\\__init__.py", line 346, in loads
    return _default_decoder.decode(s)
  File "C:\\Python311\\Lib\\json\\decoder.py", line 337, in decode
    obj, end = self.raw_decode(s, idx=_w(s, 0).end())
  File "C:\\Python311\\Lib\\json\\decoder.py", line 355, in raw_decode
    raise JSONDecodeError("Expecting value", s, err.value) from None
json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
"""
    analysis = parse_traceback(sample_stderr, target_filename="main.py")

    assert analysis.has_error is True
    assert analysis.error_type == "JSONDecodeError"
    # Target frame should be line 12 in main.py, NOT line 355 in decoder.py
    assert analysis.line_number == 12
    assert analysis.offending_code == "return json.loads(raw_data)"


def test_parse_type_error():
    sample_stderr = """Traceback (most recent call last):
  File "main.py", line 5, in <module>
    total = sum([1, 2, "3"])
TypeError: unsupported operand type(s) for +: 'int' and 'str'
"""
    analysis = parse_traceback(sample_stderr, target_filename="main.py")

    assert analysis.has_error is True
    assert analysis.error_type == "TypeError"
    assert analysis.line_number == 5
    assert "unsupported operand type" in (analysis.error_message or "")


def test_parse_index_error():
    sample_stderr = """Traceback (most recent call last):
  File "main.py", line 2, in <module>
    item = [][0]
IndexError: list index out of range
"""
    analysis = parse_traceback(sample_stderr, target_filename="main.py")

    assert analysis.has_error is True
    assert analysis.error_type == "IndexError"
    assert analysis.line_number == 2
    assert "list index out of range" in (analysis.error_message or "")


def test_parse_no_error():
    analysis = parse_traceback("")
    assert analysis.has_error is False

    analysis_whitespace = parse_traceback("   \n\n  ")
    assert analysis_whitespace.has_error is False
