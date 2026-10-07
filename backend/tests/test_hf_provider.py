"""
Unit tests for HuggingFaceProvider and Hugging Face Hub integration.
"""

from unittest.mock import AsyncMock, MagicMock, patch
import pytest

from bugwhisper.inference.hf_provider import HuggingFaceProvider
from bugwhisper.inference.manager import get_default_inference_manager


@pytest.mark.asyncio
async def test_hf_provider_init():
    provider = HuggingFaceProvider(
        model_name="pernavjain/bug-whisper-qwen25-coder-3b",
        token="hf_test_token",
    )
    assert provider.model_name == "pernavjain/bug-whisper-qwen25-coder-3b"
    assert provider.token == "hf_test_token"
    assert provider.use_local is False


@pytest.mark.asyncio
async def test_hf_provider_generate_fix_success():
    provider = HuggingFaceProvider()

    mock_choice = MagicMock()
    mock_choice.message.content = "```python\ndef add(a, b):\n    return a + b\n```"
    mock_response = MagicMock(choices=[mock_choice])

    with patch("huggingface_hub.AsyncInferenceClient") as MockClient:
        instance = MockClient.return_value
        instance.chat_completion = AsyncMock(return_value=mock_response)

        res = await provider.generate_fix(
            code="def add(a, b):\n    return a - b\n",
            stderr="AssertionError: expected 5",
        )

        assert res.success is True
        assert res.provider_name == "huggingface"
        assert res.fixed_code.strip() == "def add(a, b):\n    return a + b"
        assert res.latency_ms > 0


@pytest.mark.asyncio
async def test_hf_provider_generate_fix_api_error():
    provider = HuggingFaceProvider()

    with patch("huggingface_hub.AsyncInferenceClient") as MockClient:
        instance = MockClient.return_value
        instance.chat_completion = AsyncMock(side_effect=Exception("HF Rate Limit Exceeded"))
        instance.text_generation = AsyncMock(side_effect=Exception("HF Rate Limit Exceeded"))

        res = await provider.generate_fix(
            code="def broken(): pass",
            stderr="Exception",
        )

        assert res.success is False
        assert "Rate Limit" in str(res.error)


@pytest.mark.asyncio
async def test_hf_provider_manager_routing(monkeypatch):
    monkeypatch.setenv("BUGWHISPER_PROVIDER", "hf")
    manager = get_default_inference_manager()
    assert isinstance(manager.primary, HuggingFaceProvider)


@pytest.mark.asyncio
async def test_hf_provider_stream_fix():
    provider = HuggingFaceProvider()

    mock_chunk = MagicMock()
    mock_chunk.choices = [MagicMock(delta=MagicMock(content="print('fixed')"))]

    async def async_iter():
        yield mock_chunk

    with patch("huggingface_hub.AsyncInferenceClient") as MockClient:
        instance = MockClient.return_value
        instance.chat_completion = AsyncMock(return_value=async_iter())

        tokens = []
        async for token in provider.stream_fix("code", "stderr"):
            tokens.append(token)

        assert "print('fixed')" in tokens
