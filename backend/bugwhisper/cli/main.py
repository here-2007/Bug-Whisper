"""
Bug Whisper Developer CLI.
Commands:
  run   - Execute Python script, intercept crash, synthesize & verify fix with interactive prompt.
  check - Validate Python syntax and AST statically.
  serve - Start FastAPI backend server.
"""

from __future__ import annotations

import asyncio
import os
import warnings
from pathlib import Path
from typing import Optional

# Filter upstream Click 8.5+ deprecation warnings from Typer
warnings.filterwarnings("ignore", category=DeprecationWarning, message=r".*click\.utils.*")
warnings.filterwarnings("ignore", category=DeprecationWarning, module=r"typer.*")

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


from bugwhisper.core.venv import detect_virtual_env, resolve_python_executable


@app.command()
def run(
    script_path: Path = typer.Argument(..., help="Path to Python script to execute"),
    timeout: float = typer.Option(5.0, "--timeout", "-t", help="Timeout in seconds"),
    auto_apply: bool = typer.Option(False, "--apply", "-y", help="Automatically apply verified fix"),
    provider: str = typer.Option("auto", "--provider", "-p", help="Inference provider: auto, ollama, hf, kaggle, openai, heuristic"),
    venv: Optional[Path] = typer.Option(None, "--venv", help="Path to virtual environment root or python executable"),
) -> None:
    """Executes Python script safely; synthesizes and verifies fixes upon failure."""
    if provider != "auto":
        os.environ["BUGWHISPER_PROVIDER"] = provider
    if not script_path.exists():
        console.print(f"[red]Error:[/red] File '{script_path}' does not exist.")
        raise typer.Exit(code=1)

    python_bin = resolve_python_executable(venv=venv, script_dir=script_path.parent)
    active_venv = venv or detect_virtual_env(start_dir=script_path.parent)
    if active_venv:
        console.print(f"[dim]Virtual Environment: [cyan]{active_venv}[/cyan][/dim]")

    code = script_path.read_text(encoding="utf-8")
    run_res = run_code_sandboxed(
        code,
        timeout_seconds=timeout,
        python_executable=python_bin,
        venv=str(venv) if venv else None,
    )

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

    verify_res = verify_remediation(
        code,
        synth_res.fixed_code,
        original_error=analysis,
        python_executable=python_bin,
        venv=str(venv) if venv else None,
    )

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
def env(
    path: Optional[Path] = typer.Argument(None, help="Directory to inspect for virtual environments"),
) -> None:
    """Inspects detected virtual environment and active Python interpreter."""
    import sys
    detected = detect_virtual_env(start_dir=path)
    resolved = resolve_python_executable(venv=detected, script_dir=path)
    console.print("[bold]Python Environment Diagnostics:[/bold]")
    console.print(f"  • Host Python: [cyan]{sys.executable}[/cyan] ({sys.version.split()[0]})")
    if detected:
        console.print(f"  • Detected Virtualenv: [bold green]{detected}[/bold green]")
        console.print(f"  • Resolved Interpreter: [cyan]{resolved}[/cyan]")
    else:
        console.print("  • Detected Virtualenv: [yellow]None[/yellow] (using host Python)")


@app.command()
def serve(
    host: str = typer.Option("127.0.0.1", "--host", "-h", help="Bind host"),
    port: int = typer.Option(8000, "--port", "-p", help="Bind port"),
    reload: bool = typer.Option(False, "--reload", "-r", help="Auto-reload on code change"),
) -> None:
    """Starts the Bug Whisper FastAPI server."""
    uvicorn.run("bugwhisper.server.app:app", host=host, port=port, reload=reload)


@app.command()
def model(
    show_modelfile: bool = typer.Option(False, "--modelfile", "-m", help="Display Ollama Modelfile definition"),
    download_kaggle: bool = typer.Option(False, "--download-kaggle", "-k", help="Download Kaggle model weights locally"),
) -> None:
    """Inspects local model status and Ollama configuration."""
    if show_modelfile:
        modelfile_path = Path("Modelfile")
        if modelfile_path.exists():
            console.print(modelfile_path.read_text(encoding="utf-8"))
        else:
            console.print(
                'FROM qwen2.5-coder:3b\nPARAMETER temperature 0.0\nPARAMETER num_predict 768\n'
                'SYSTEM "You are an expert Python bug-fixing assistant. Fix all errors in the provided code and return only the corrected Python code."'
            )
        return

    from bugwhisper.inference.ollama_provider import OllamaProvider, CANDIDATE_MODELS
    provider = OllamaProvider()

    loop = asyncio.new_event_loop()
    pulled_models = loop.run_until_complete(provider.list_models())
    loop.close()

    if pulled_models:
        console.print("[bold green]Local Ollama instance is active at http://localhost:11434[/bold green]")
        console.print("Available models:")
        has_recommended = False
        for m in pulled_models:
            is_candidate = any(c in m for c in CANDIDATE_MODELS)
            if is_candidate:
                has_recommended = True
                console.print(f"  • [bold cyan]{m}[/bold cyan] [green](compatible with Bug Whisper)[/green]")
            else:
                console.print(f"  • {m}")

        if not has_recommended:
            console.print("\n[yellow]Recommended model not yet pulled.[/yellow]")
            console.print("Run one of the following to activate neural repair:")
            console.print("  ollama run qwen2.5-coder:3b")
            console.print("  ollama create bug-whisper -f Modelfile")
    else:
        console.print("[yellow]Ollama is currently offline at http://localhost:11434[/yellow]")
        console.print("[dim]Bug Whisper is operating in [bold green]Deterministic Heuristic Mode[/bold green] (zero weight / zero GPU needed).[/dim]\n")
        console.print("[bold]To enable local neural code synthesis:[/bold]")
        console.print("  1. Install & start Ollama: https://ollama.com")
        console.print("  2. Pull model: [cyan]ollama run qwen2.5-coder:3b[/cyan]")
        console.print("  3. (Optional) Create fine-tuned profile: [cyan]ollama create bug-whisper -f Modelfile[/cyan]")

    console.print("\n[bold]Hugging Face Hub Integration:[/bold]")
    try:
        import huggingface_hub
        hf_token = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_HUB_TOKEN")
        token_badge = "[green]Configured[/green]" if hf_token else "[dim]Optional (serverless)[/dim]"
        console.print(f"  • huggingface_hub: [green]v{huggingface_hub.__version__}[/green]")
        console.print(f"  • Target Model: [cyan]pernavjain/bug-whisper-qwen25-coder-3b[/cyan]")
        console.print(f"  • Auth Token: {token_badge}")
        console.print("  • Run with HF provider: [cyan]bugwhisper run script.py --provider hf[/cyan]")
    except ImportError:
        console.print("  • huggingface_hub: [yellow]Not installed[/yellow] (run: pip install -r requirements.txt)")

    console.print("\n[bold]Kaggle Hub Integration:[/bold]")
    try:
        import kagglehub
        from bugwhisper.inference.kaggle_provider import KaggleProvider, DEFAULT_KAGGLE_HANDLE

        kp = KaggleProvider()
        cached = kp.is_model_downloaded()
        cache_badge = "[bold green]Cached locally[/bold green]" if cached else "[yellow]Not cached (auto-downloads on first run)[/yellow]"
        console.print(f"  • kagglehub: [green]v{kagglehub.__version__}[/green]")
        console.print(f"  • Model Handle: [cyan]{DEFAULT_KAGGLE_HANDLE}[/cyan]")
        console.print(f"  • Local Cache: {cache_badge}")
        if download_kaggle:
            console.print("[cyan]Downloading Kaggle model weights via kagglehub...[/cyan]")
            path = kp.get_model_path(force_download=True)
            console.print(f"[bold green]Model cached at: {path}[/bold green]")
        else:
            console.print("  • Download weights now: [cyan]bugwhisper model --download-kaggle[/cyan]")
            console.print("  • Run with Kaggle provider: [cyan]bugwhisper run script.py --provider kaggle[/cyan]")
    except ImportError:
        console.print("  • kagglehub: [yellow]Not installed[/yellow] (run: pip install kagglehub)")


if __name__ == "__main__":
    app()

