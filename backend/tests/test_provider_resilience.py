"""
Resilience and Mocking Tests for Ollama and OpenAI Providers.
Ensures network errors, timeouts, and malformed streams are gracefully absorbed.
"""

import json
import pytest
from unittest.mock import AsyncMock, patch
import httpx

from bugwhisper.inference.base import InferenceResult
from bugwhisper.inference.manager import InferenceManager
from bugwhisper.inference.ollama_provider import OllamaProvider
from bugwhisper.inference.openai_provider import OpenAIProvider


@pytest.mark.asyncio
async def test_ollama_generate_success(monkeypatch):
    provider = OllamaProvider()

    mock_resp = httpx.Response(
        status_code=200,
        json={"message": {"content": "```python\ndef repaired(): pass\n```"}},
        request=httpx.Request("POST", "http://localhost:11434/api/chat"),
    )

    async def mock_post(*args, **kwargs):
        return mock_resp

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post)

    res = await provider.generate_fix("def broken(): pass", "error")
    assert res.success
    assert "def repaired(): pass" in res.fixed_code
    assert res.provider_name == "ollama"


@pytest.mark.asyncio
async def test_ollama_generate_http_error(monkeypatch):
    provider = OllamaProvider()

    async def mock_post(*args, **kwargs):
        raise httpx.ConnectError("Ollama daemon offline")

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post)

    res = await provider.generate_fix("def broken(): pass", "error")
    assert not res.success
    assert "Ollama daemon offline" in (res.error or "")


@pytest.mark.asyncio
async def test_openai_generate_success(monkeypatch):
    provider = OpenAIProvider()

    mock_resp = httpx.Response(
        status_code=200,
        json={"choices": [{"message": {"content": "```python\ndef vllm_fix(): pass\n```"}}]},
        request=httpx.Request("POST", "http://localhost:8000/v1/chat/completions"),
    )

    async def mock_post(*args, **kwargs):
        return mock_resp

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post)

    res = await provider.generate_fix("def broken(): pass", "error")
    assert res.success
    assert "def vllm_fix(): pass" in res.fixed_code
    assert res.provider_name == "openai_compat"


@pytest.mark.asyncio
async def test_openai_generate_http_error(monkeypatch):
    provider = OpenAIProvider()

    async def mock_post(*args, **kwargs):
        raise httpx.HTTPStatusError("401 Unauthorized", request=None, response=httpx.Response(401))

    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post)

    res = await provider.generate_fix("def broken(): pass", "error")
    assert not res.success
    assert res.error is not None


class FailingStreamProvider(OllamaProvider):
    async def stream_fix(self, code: str, stderr: str):
        raise httpx.ConnectTimeout("Connection timed out")
        yield ""  # pragma: no cover


@pytest.mark.asyncio
async def test_inference_manager_stream_fallback():
    failing = FailingStreamProvider()
    manager = InferenceManager(primary_provider=failing)

    # Heuristic fallback should activate seamlessly
    code = "def calc(): return 1 / 0\n"
    stderr = 'File "main.py", line 1, in calc\nZeroDivisionError: division by zero'

    chunks = []
    async for chunk in manager.stream_fix(code, stderr):
        chunks.append(chunk)

    full_output = "".join(chunks)
    assert len(full_output) > 0
    assert "0 != 0" in full_output or "!= 0" in full_output
