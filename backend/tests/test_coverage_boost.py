"""
Targeted tests to push backend test coverage beyond 90%.
"""

from pathlib import Path
from unittest.mock import AsyncMock, patch
import httpx
import pytest
from fastapi.testclient import TestClient
from typer.testing import CliRunner

from bugwhisper.cli.auto_hook import exception_handler
from bugwhisper.cli.main import app as cli_app
from bugwhisper.inference.base import InferenceResult
from bugwhisper.server.app import app as api_app

client = TestClient(api_app)
cli_runner = CliRunner()


def test_cli_missing_files():
    res = cli_runner.invoke(cli_app, ["check", "non_existent_file.py"])
    assert res.exit_code == 1
    assert "does not exist" in res.stdout

    res2 = cli_runner.invoke(cli_app, ["run", "non_existent_file.py"])
    assert res2.exit_code == 1
    assert "does not exist" in res2.stdout


def test_synthesize_with_ollama_and_openai_providers(monkeypatch):
    async def mock_generate_fix(*args, **kwargs):
        return InferenceResult(
            fixed_code="def mock_repaired(): pass\n",
            raw_output="",
            latency_ms=10.0,
            provider_name="mock",
            model_name="mock-model",
            success=True,
        )

    monkeypatch.setattr(
        "bugwhisper.inference.ollama_provider.OllamaProvider.generate_fix",
        mock_generate_fix,
    )
    monkeypatch.setattr(
        "bugwhisper.inference.openai_provider.OpenAIProvider.generate_fix",
        mock_generate_fix,
    )

    res_ollama = client.post(
        "/api/synthesize",
        json={"code": "def f(): pass", "stderr": "error", "provider": "ollama"},
    )
    assert res_ollama.status_code == 200
    assert "mock_repaired" in res_ollama.json()["fixed_code"]

    res_openai = client.post(
        "/api/synthesize",
        json={"code": "def f(): pass", "stderr": "error", "provider": "openai"},
    )
    assert res_openai.status_code == 200
    assert "mock_repaired" in res_openai.json()["fixed_code"]


def test_stream_repair_provider_exception(monkeypatch):
    async def mock_stream_error(*args, **kwargs):
        raise RuntimeError("Stream failed unexpectedly")
        yield ""  # pragma: no cover

    monkeypatch.setattr(
        "bugwhisper.inference.heuristic_provider.HeuristicProvider.stream_fix",
        mock_stream_error,
    )

    res = client.post(
        "/api/repair/stream",
        json={"code": "def f(): pass", "stderr": "", "provider": "heuristic"},
    )
    assert res.status_code == 200
    assert "event: error" in res.text
    assert "Stream failed unexpectedly" in res.text


def test_auto_hook_with_traceback_and_file(tmp_path: Path):
    target = tmp_path / "script_crash.py"
    target.write_text("x = 10 / 0\n", encoding="utf-8")

    try:
        # Simulate execution of target file
        exec(compile(target.read_text(), str(target), "exec"))
    except ZeroDivisionError:
        import sys
        exc_type, exc_val, exc_tb = sys.exc_info()
        # Should execute without raising and print rich diff panel
        exception_handler(exc_type, exc_val, exc_tb)
