"""
Bug Whisper Developer CLI.
Commands:
  run   - Execute Python script, intercept crash, synthesize & verify fix with interactive prompt.
  check - Validate Python syntax and AST statically.
  serve - Start FastAPI backend server.
"""

from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Optional

import typer
import uvicorn
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Confirm
from rich.syntax import Syntax

from bugwhisper.core.ast_validator import validate_syntax
from bugwhisper.core.runner import run_code_sandboxed
from bugwhisper.core.traceback_parser import parse_traceback
from bugwhisper.core.verifier import verify_remediation
from bugwhisper.inference.manager import get_default_inference_manager

app = typer.Typer(
    name="bugwhisper",
    help="Bug Whisper: AI & Deterministic Python Debugging Assistant",
    no_args_is_help=True,
)
console = Console()


@app.command()
def check(
    script_path: Path = typer.Argument(..., help="Path to Python script to validate"),
) -> None:
    """Statically validates Python syntax and AST without execution."""
    if not script_path.exists():
        console.print(f"[red]Error:[/red] File '{script_path}' does not exist.")
        raise typer.Exit(code=1)

    code = script_path.read_text(encoding="utf-8")
    res = validate_syntax(code, filename=str(script_path))

    if res.is_valid:
        console.print(f"[green]Syntax Valid:[/green] '{script_path}' parsed cleanly.")
    else:
        console.print(
            f"[red]Syntax Error:[/red] '{script_path}' line {res.line_number}: {res.error_message}"
        )
        raise typer.Exit(code=1)


@app.command()
def run(
    script_path: Path = typer.Argument(..., help="Path to Python script to execute"),
    timeout: float = typer.Option(5.0, "--timeout", "-t", help="Timeout in seconds"),
    auto_apply: bool = typer.Option(False, "--apply", "-y", help="Automatically apply verified fix"),
) -> None:
    """Executes Python script safely; synthesizes and verifies fixes upon failure."""
    if not script_path.exists():
        console.print(f"[red]Error:[/red] File '{script_path}' does not exist.")
        raise typer.Exit(code=1)

    code = script_path.read_text(encoding="utf-8")
    run_res = run_code_sandboxed(code, timeout_seconds=timeout)

    if run_res.success:
        if run_res.stdout:
            console.print(run_res.stdout, end="")
        console.print("[dim green]Execution succeeded (exit code 0).[/dim green]")
        return

    # Execution failed
    console.print(f"[bold red]Execution Failed (exit code {run_res.exit_code}):[/bold red]")
    console.print(run_res.stderr.strip())

    analysis = parse_traceback(run_res.stderr)
    console.print("\n[bold cyan]Synthesizing fix...[/bold cyan]")

    manager = get_default_inference_manager()
    loop = asyncio.new_event_loop()
    synth_res = loop.run_until_complete(manager.generate_fix(code, run_res.stderr))
    loop.close()

    verify_res = verify_remediation(code, synth_res.fixed_code, original_error=analysis)

    diff_syntax = Syntax(verify_res.diff.diff_text, "diff", theme="monokai", line_numbers=False)
    status_color = "green" if verify_res.status.value == "VERIFIED" else "yellow"
    console.print(
        Panel(
            diff_syntax,
            title=f"[{status_color}]Verification: {verify_res.status.value}[/{status_color}]",
            subtitle=f"[dim]+{verify_res.diff.additions} -{verify_res.diff.deletions} lines | {verify_res.details}[/dim]",
        )
    )

    if auto_apply or Confirm.ask(f"Apply fix to '{script_path}'?"):
        script_path.write_text(synth_res.fixed_code, encoding="utf-8")
        console.print(f"[bold green]Updated '{script_path}' successfully.[/bold green]")


@app.command()
def serve(
    host: str = typer.Option("127.0.0.1", "--host", "-h", help="Bind host"),
    port: int = typer.Option(8000, "--port", "-p", help="Bind port"),
    reload: bool = typer.Option(False, "--reload", "-r", help="Auto-reload on code change"),
) -> None:
    """Starts the Bug Whisper FastAPI server."""
    uvicorn.run("bugwhisper.server.app:app", host=host, port=port, reload=reload)


if __name__ == "__main__":
    app()
