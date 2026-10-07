"""
Unit tests for the two-stage verification engine.
"""

from bugwhisper.core.traceback_parser import parse_traceback
from bugwhisper.core.verifier import VerificationStatus, verify_remediation


def test_verifier_syntax_error():
    orig = "print('hello')\n"
    broken_rep = "def foo(\n"  # Invalid syntax
    res = verify_remediation(orig, broken_rep)
    assert res.status == VerificationStatus.SYNTAX_ERROR
    assert not res.is_valid_syntax
    assert "SyntaxError" in res.details


def test_verifier_syntax_passed_when_dynamic_skipped():
    orig = "print('hello')\n"
    rep = "print('world')\n"
    res = verify_remediation(orig, rep, dynamic_exec=False)
    assert res.status == VerificationStatus.SYNTAX_PASSED
    assert res.is_valid_syntax
    assert res.runner_output is None


def test_verifier_verified():
    orig = "a = 10\nb = 0\nprint(a / b)\n"
    rep = "a = 10\nb = 2\nprint(a / b)\n"
    orig_err = parse_traceback("File 'main.py', line 3\nZeroDivisionError: division by zero")
    res = verify_remediation(orig, rep, original_error=orig_err, dynamic_exec=True)
    assert res.status == VerificationStatus.VERIFIED
    assert res.is_valid_syntax
    assert res.runner_output is not None
    assert res.runner_output.success


def test_verifier_failed_same_error():
    orig = "a = 10\nb = 0\nprint(a / b)\n"
    rep = "a = 10\nb = 0\nprint(a / b)\n"  # Identical failure at same line
    orig_err = parse_traceback('File "main.py", line 3\nZeroDivisionError: division by zero')
    res = verify_remediation(orig, rep, original_error=orig_err, dynamic_exec=True)
    assert res.status == VerificationStatus.FAILED
    assert res.new_error is not None
    assert res.new_error.error_type == "ZeroDivisionError"


def test_verifier_regression():
    orig = "a = 10\nb = 0\nprint(a / b)\n"
    rep = "raise ValueError('new error')\n"
    orig_err = parse_traceback('File "main.py", line 3\nZeroDivisionError: division by zero')
    res = verify_remediation(orig, rep, original_error=orig_err, dynamic_exec=True)
    assert res.status == VerificationStatus.REGRESSED
    assert res.new_error is not None
    assert res.new_error.error_type == "ValueError"
