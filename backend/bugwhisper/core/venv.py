"""
Virtual Environment Discovery & Python Executable Resolver.
Detects active virtual environments (VIRTUAL_ENV), local .venv/venv folders,
and resolves platform-specific Python interpreter binaries (Windows Scripts vs POSIX bin).
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Optional

COMMON_VENV_NAMES = (".venv", "venv", "env", ".env")


def detect_virtual_env(start_dir: Optional[str | Path] = None) -> Optional[Path]:
    """
    Detects an active or co-located Python virtual environment directory.
    Checks:
    1. VIRTUAL_ENV environment variable (active shell/session).
    2. Local candidate directories (.venv, venv, env, .env) in start_dir and parents.
    """
    # 1. Environment variable
    env_var = os.environ.get("VIRTUAL_ENV")
    if env_var:
        p = Path(env_var)
        if p.is_dir():
            return p.resolve()

    # 2. Search start_dir and parent directories
    current = Path(start_dir).resolve() if start_dir else Path.cwd().resolve()
    if current.is_file():
        current = current.parent

    # Traverse upward up to 4 levels or filesystem root
    max_levels = 4
    for _ in range(max_levels):
        for candidate_name in COMMON_VENV_NAMES:
            candidate = current / candidate_name
            if candidate.is_dir():
                # Verify that it looks like a valid venv (has bin or Scripts)
                if sys.platform == "win32":
                    py_bin = candidate / "Scripts" / "python.exe"
                else:
                    py_bin = candidate / "bin" / "python"
                if py_bin.exists() or (candidate / "pyvenv.cfg").exists():
                    return candidate.resolve()

        if current.parent == current:
            break
        current = current.parent

    return None


def resolve_python_executable(
    venv: Optional[str | Path] = None,
    script_dir: Optional[str | Path] = None,
) -> str:
    """
    Resolves the exact Python executable path for a given or detected venv.
    Falls back safely to sys.executable if no valid venv is found.
    """
    target_dir: Optional[Path] = None

    if venv:
        v_path = Path(venv).resolve()
        if v_path.is_file():
            # Directly provided executable path
            return str(v_path)
        if v_path.is_dir():
            target_dir = v_path
    else:
        target_dir = detect_virtual_env(start_dir=script_dir)

    if target_dir:
        # Check platform binaries
        if sys.platform == "win32":
            candidates = [
                target_dir / "Scripts" / "python.exe",
                target_dir / "Scripts" / "python",
                target_dir / "python.exe",
            ]
        else:
            candidates = [
                target_dir / "bin" / "python3",
                target_dir / "bin" / "python",
                target_dir / "python",
            ]

        for cand in candidates:
            if cand.exists() and os.access(str(cand), os.X_OK):
                return str(cand.resolve())
            if cand.exists() and sys.platform == "win32":
                return str(cand.resolve())

    return sys.executable


def get_venv_env(
    python_executable: str,
    base_env: Optional[dict[str, str]] = None,
) -> dict[str, str]:
    """
    Constructs subprocess environment with VIRTUAL_ENV and PATH correctly configured
    for the target Python executable.
    """
    env = dict(base_env or os.environ)
    py_path = Path(python_executable).resolve()
    venv_dir = py_path.parent.parent  # e.g., <venv>/Scripts/python.exe -> <venv>

    if (venv_dir / "pyvenv.cfg").exists() or py_path.parent.name in ("Scripts", "bin"):
        env["VIRTUAL_ENV"] = str(venv_dir)
        scripts_dir = str(py_path.parent)
        current_path = env.get("PATH", "")
        # Prepend venv bin/Scripts directory to PATH
        env["PATH"] = f"{scripts_dir}{os.pathsep}{current_path}"

    return env
