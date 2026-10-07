"""
Unit tests for Typer Developer CLI.
"""

from pathlib import Path
from typer.testing import CliRunner
from bugwhisper.cli.main import app

runner = CliRunner()


def test_cli_help():
    result = runner.invoke(app, ["--help"])
    assert result.exit_code == 0
    assert "Bug Whisper" in result.stdout
    assert "check" in result.stdout
    assert "run" in result.stdout
    assert "serve" in result.stdout


def test_cli_check_valid_script(tmp_path: Path):
    valid_file = tmp_path / "valid.py"
    valid_file.write_text("def add(a, b):\n    return a + b\n")

    result = runner.invoke(app, ["check", str(valid_file)])
    assert result.exit_code == 0
    assert "Syntax Valid" in result.stdout


def test_cli_check_invalid_syntax(tmp_path: Path):
    broken_file = tmp_path / "broken.py"
    broken_file.write_text("def broken(\n")

    result = runner.invoke(app, ["check", str(broken_file)])
    assert result.exit_code == 1
    assert "Syntax Error" in result.stdout


def test_cli_run_successful_script(tmp_path: Path):
    good_file = tmp_path / "good.py"
    good_file.write_text("print('cli success')\n")

    result = runner.invoke(app, ["run", str(good_file)])
    assert result.exit_code == 0
    assert "cli success" in result.stdout


def test_cli_run_auto_apply_fix(tmp_path: Path):
    buggy_file = tmp_path / "buggy.py"
    buggy_file.write_text("x = 10\ny = 0\nprint(x / y)\n")

    result = runner.invoke(app, ["run", str(buggy_file), "--apply"])
    assert result.exit_code == 0
    assert "Verification: VERIFIED" in result.stdout or "Updated" in result.stdout

    # Check file was rewritten with fixed code
    updated_code = buggy_file.read_text()
    assert "0 != 0" in updated_code or "!= 0" in updated_code or "y != 0" in updated_code
