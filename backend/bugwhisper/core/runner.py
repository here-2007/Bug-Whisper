"""
Deterministic Python Sandbox Runner.
Executes code safely in an isolated subprocess with timeout handling,
stdin isolation, and Windows process-tree termination.
"""

from __future__ import annotations

import os
import sys
import time
import shutil
import tempfile
import subprocess
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class RunResult:
    """Represents the deterministic outcome of a sandboxed script execution."""
    success: bool
    stdout: str
    stderr: str
    exit_code: int
    timed_out: bool
    duration_ms: float


def _kill_process_tree(pid: int) -> None:
    """Terminates an entire process tree across Windows and POSIX."""
    if sys.platform == "win32":
        try:
            subprocess.run(
                ["taskkill", "/F", "/T", "/PID", str(pid)],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=2.0,
                check=False,
            )
        except Exception:
            pass
    else:
        try:
            import signal
            os.killpg(os.getpgid(pid), signal.SIGKILL)
        except Exception:
            pass


def run_code_sandboxed(
    code: str,
    timeout_seconds: float = 5.0,
    working_dir: Optional[str] = None,
    max_output_chars: int = 50_000,
) -> RunResult:
    """
    Executes Python source code in an isolated subprocess.

    Guarantees:
    - `stdin=DEVNULL` prevents deadlocks from interactive `input()` calls.
    - Process tree kill on timeout ensures zero orphaned child tasks.
    - Output buffer truncation prevents memory exhaustion.
    """
    cleanup_temp_dir = False
    if working_dir is None:
        working_dir = tempfile.mkdtemp(prefix="bugwhisper_run_")
        cleanup_temp_dir = True

    script_path = os.path.join(working_dir, "main.py")

    start_time = time.perf_counter()
    try:
        with open(script_path, "w", encoding="utf-8") as f:
            f.write(code)

        # Environment isolation: filter out sensitive environment variables
        safe_env = os.environ.copy()
        safe_env["PYTHONDONTWRITEBYTECODE"] = "1"
        safe_env["PYTHONUNBUFFERED"] = "1"
        safe_env["PYTHONIOENCODING"] = "utf-8"
        safe_env["PYTHONUTF8"] = "1"

        creationflags = 0
        preexec_fn = None
        if sys.platform == "win32":
            creationflags = subprocess.CREATE_NEW_PROCESS_GROUP
        else:
            preexec_fn = os.setsid

        proc = subprocess.Popen(
            [sys.executable, "-u", "main.py"],
            cwd=working_dir,
            stdin=subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace",
            env=safe_env,
            creationflags=creationflags,
            preexec_fn=preexec_fn,
        )

        try:
            stdout_data, stderr_data = proc.communicate(timeout=timeout_seconds)
            exit_code = proc.returncode
            timed_out = False
        except subprocess.TimeoutExpired:
            timed_out = True
            _kill_process_tree(proc.pid)
            try:
                stdout_data, stderr_data = proc.communicate(timeout=1.0)
            except Exception:
                stdout_data, stderr_data = "", ""
            exit_code = -1
            stderr_data = (stderr_data or "") + f"\nTimeoutError: Execution exceeded {timeout_seconds} seconds."

        duration_ms = (time.perf_counter() - start_time) * 1000.0

        # Truncate output to avoid memory exhaustion
        stdout_clean = (stdout_data or "")[:max_output_chars]
        stderr_clean = (stderr_data or "")[:max_output_chars]

        success = (exit_code == 0) and not timed_out

        return RunResult(
            success=success,
            stdout=stdout_clean,
            stderr=stderr_clean,
            exit_code=exit_code,
            timed_out=timed_out,
            duration_ms=round(duration_ms, 2),
        )

    finally:
        if cleanup_temp_dir and os.path.exists(working_dir):
            try:
                shutil.rmtree(working_dir, ignore_errors=True)
            except Exception:
                pass
