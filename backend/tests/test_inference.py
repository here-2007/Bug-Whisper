"""
Unit tests for multi-tier inference engine and deterministic fallback.
"""

import pytest
from bugwhisper.inference.base import InferenceProvider, InferenceResult
from bugwhisper.inference.heuristic_provider import HeuristicProvider
from bugwhisper.inference.manager import InferenceManager


@pytest.mark.asyncio
async def test_heuristic_provider_zerodivision():
    code = "def average(total, count):\n    return total / count\n"
    stderr = (
        'Traceback (most recent call last):\n'
        '  File "main.py", line 2, in average\n'
        '    return total / count\n'
        'ZeroDivisionError: division by zero\n'
    )
    provider = HeuristicProvider()
    res = await provider.generate_fix(code, stderr)
    assert res.success
    assert "count != 0" in res.fixed_code
    assert res.provider_name == "heuristic"


@pytest.mark.asyncio
async def test_heuristic_provider_missing_colon():
    code = "def greet(name)\n    print(name)\n"
    stderr = (
        '  File "main.py", line 1\n'
        '    def greet(name)\n'
        '                   ^\n'
        'SyntaxError: expected \':\'\n'
    )
    provider = HeuristicProvider()
    res = await provider.generate_fix(code, stderr)
    assert res.success
    assert "def greet(name):" in res.fixed_code


@pytest.mark.asyncio
async def test_heuristic_provider_stream():
    code = "def f(): pass\n"
    stderr = ""
    provider = HeuristicProvider()
    chunks = []
    async for chunk in provider.stream_fix(code, stderr):
        chunks.append(chunk)
    streamed_text = "".join(chunks)
    assert streamed_text.strip() == code.strip()


class FailingProvider(InferenceProvider):
    def __init__(self, provider_name: str = "mock_failing", model_name: str = "fail-model"):
        self.provider_name = provider_name
        self.model_name = model_name

    async def generate_fix(self, code: str, stderr: str) -> InferenceResult:
        raise ConnectionRefusedError("LLM server offline")

    async def stream_fix(self, code: str, stderr: str):
        raise ConnectionRefusedError("LLM server offline")
        yield ""  # pragma: no cover


@pytest.mark.asyncio
async def test_inference_manager_fallback_on_failure():
    failing_primary = FailingProvider("mock_failing", "fail-model")
    heuristic_fallback = HeuristicProvider()
    manager = InferenceManager(primary_provider=failing_primary, fallback_provider=heuristic_fallback)

    code = "def calc(x):\n    return x / 0\n"
    stderr = 'File "main.py", line 2, in calc\nZeroDivisionError: division by zero'

    res = await manager.generate_fix(code, stderr)
    assert res.success
    assert res.provider_name == "heuristic"
    assert "0 != 0" in res.fixed_code or "!= 0" in res.fixed_code
