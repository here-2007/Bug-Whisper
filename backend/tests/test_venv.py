"""
Tests for Virtual Environment Detection and Execution Resolution.
"""

import os
import sys
import tempfile
from pathlib import Path

import pytest
from bugwhisper.core.venv import detect_virtual_env, resolve_python_executable, get_venv_env
from bugwhisper.core.runner import run_code_sandboxed


def test_resolve_fallback_to_sys_executable():
    """When no venv is found, resolution cleanly falls back to sys.executable."""
    exe = resolve_python_executable()
    assert exe == sys.executable


def test_resolve_explicit_executable():
    """Explicitly passing an executable file returns that file."""
    exe = resolve_python_executable(venv=sys.executable)
    assert Path(exe).resolve() == Path(sys.executable).resolve()


def test_detect_virtual_env_from_env_var(monkeypatch):
    """VIRTUAL_ENV environment variable is correctly detected."""
    with tempfile.TemporaryDirectory() as tmpdir:
        monkeypatch.setenv("VIRTUAL_ENV", tmpdir)
        detected = detect_virtual_env()
        assert detected == Path(tmpdir).resolve()


def test_detect_virtual_env_from_directory(tmp_path):
    """Local .venv directory with pyvenv.cfg is detected."""
    venv_dir = tmp_path / ".venv"
    venv_dir.mkdir()
    (venv_dir / "pyvenv.cfg").write_text("home = /usr/bin\n", encoding="utf-8")

    sub_dir = tmp_path / "src" / "deep"
    sub_dir.mkdir(parents=True)

    detected = detect_virtual_env(start_dir=sub_dir)
    assert detected == venv_dir.resolve()


def test_get_venv_env_sets_path_and_virtual_env(tmp_path):
    """Environment dictionary prepends venv Scripts/bin to PATH and sets VIRTUAL_ENV."""
    venv_dir = tmp_path / "my_venv"
    if sys.platform == "win32":
        scripts_dir = venv_dir / "Scripts"
        scripts_dir.mkdir(parents=True)
        fake_py = scripts_dir / "python.exe"
        fake_py.write_text("", encoding="utf-8")
    else:
        scripts_dir = venv_dir / "bin"
        scripts_dir.mkdir(parents=True)
        fake_py = scripts_dir / "python"
        fake_py.write_text("", encoding="utf-8")

    (venv_dir / "pyvenv.cfg").write_text("home = /usr\n", encoding="utf-8")

    env = get_venv_env(str(fake_py))
    assert env["VIRTUAL_ENV"] == str(venv_dir.resolve())
    assert env["PATH"].startswith(str(scripts_dir.resolve()))


def test_sandboxed_run_with_custom_python():
    """run_code_sandboxed correctly executes with explicit python_executable."""
    code = "import sys; print('PYTHON_OK', sys.version_info[0])"
    res = run_code_sandboxed(code, python_executable=sys.executable)
    assert res.success is True
    assert "PYTHON_OK" in res.stdout
