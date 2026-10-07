"""
Automatic sys.excepthook Interceptor.
Catches unhandled Python crashes and immediately synthesizes and displays verified fixes in terminal.
"""

from __future__ import annotations

import sys
import traceback
from typing import Any

from rich.console import Console
from rich.panel import Panel
from rich.syntax import Syntax

from bugwhisper.core.diff_engine import generate_diff
from bugwhisper.core.traceback_parser import parse_traceback
from bugwhisper.inference.heuristic_provider import HeuristicProvider

console = Console(stderr=True)
_original_excepthook = sys.excepthook


def exception_handler(exc_type: type[BaseException], exc_val: BaseException, exc_tb: Any) -> None:
    """Custom excepthook that provides deterministic analysis and diff repair suggestions."""
    # First, print normal Python traceback via original hook or traceback module
    _original_excepthook(exc_type, exc_val, exc_tb)

    try:
        raw_tb = "".join(traceback.format_exception(exc_type, exc_val, exc_tb))
        analysis = parse_traceback(raw_tb)

        if not analysis.has_error or not analysis.user_frames:
            return

        last_frame = analysis.user_frames[-1]
        target_file = last_frame.filename

        # Read offending file content if available
        try:
            with open(target_file, "r", encoding="utf-8") as f:
                source_code = f.read()
        except Exception:
            return

        # Generate deterministic fix
        provider = HeuristicProvider()
        import asyncio
        loop = asyncio.new_event_loop()
        synth_res = loop.run_until_complete(provider.generate_fix(source_code, raw_tb))
        loop.close()

        if not synth_res.success or synth_res.fixed_code.strip() == source_code.strip():
            return

        diff_res = generate_diff(source_code, synth_res.fixed_code, original_filename=target_file)
        if not diff_res.has_changes:
            return

        diff_syntax = Syntax(diff_res.diff_text, "diff", theme="monokai", line_numbers=False)
        console.print()
        console.print(
            Panel(
                diff_syntax,
                title=f"[bold cyan]Bug Whisper: Suggested Fix for {analysis.error_type}[/bold cyan]",
                subtitle=f"[dim]+{diff_res.additions} -{diff_res.deletions} lines[/dim]",
                border_style="cyan",
            )
        )
    except Exception:
        # Never crash the interpreter in excepthook
        pass


def install_auto_hook() -> None:
    """Installs the Bug Whisper exception hook."""
    sys.excepthook = exception_handler


def uninstall_auto_hook() -> None:
    """Restores the original system exception hook."""
    sys.excepthook = _original_excepthook
