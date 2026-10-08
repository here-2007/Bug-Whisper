"""
Unit and integration tests for Kaggle Hub Provider and endpoints.
"""

from __future__ import annotations

import os
from unittest.mock import MagicMock, patch
import pytest

from bugwhisper.inference.kaggle_provider import KaggleProvider, DEFAULT_KAGGLE_HANDLE
from bugwhisper.inference.manager import InferenceManager, get_default_inference_manager


def test_kaggle_provider_initialization():
    provider = KaggleProvider()
    assert provider.model_handle == DEFAULT_KAGGLE_HANDLE
    assert provider.use_gpu is False

    custom_provider = KaggleProvider(model_handle="custom/qwen-3b", use_gpu=True)
    assert custom_provider.model_handle == "custom/qwen-3b"
    assert custom_provider.use_gpu is True


@patch("kagglehub.model_download")
def test_kaggle_provider_get_model_path_download(mock_download):
    mock_download.return_value = "/cache/models/pernavjain/bug-whisper"
    provider = KaggleProvider()

    path = provider.get_model_path()
    assert path == "/cache/models/pernavjain/bug-whisper"
    mock_download.assert_called_once_with(DEFAULT_KAGGLE_HANDLE, force_download=False)

    # Calling again uses cached path if exists on disk
    with patch("os.path.exists", return_value=True):
        cached = provider.get_model_path()
        assert cached == path
        assert mock_download.call_count == 1


@patch("kagglehub.model_download")
def test_kaggle_provider_is_model_downloaded(mock_download):
    mock_download.return_value = "/cache/models/pernavjain/bug-whisper"
    provider = KaggleProvider()

    with patch("os.path.exists", return_value=True):
        assert provider.is_model_downloaded() is True

    with patch("os.path.exists", return_value=False):
        assert provider.is_model_downloaded() is False


@pytest.mark.asyncio
async def test_kaggle_provider_generate_fix_success():
    provider = KaggleProvider()

    mock_generated_text = (
        "<|im_start|>assistant\n```python\n"
        "def get_user(users, index):\n"
        "    if index < len(users):\n"
        "        return users[index]\n"
        "    return None\n"
        "```<|im_end|>"
    )

    with patch.object(provider, "get_model_path", return_value="/tmp/model"), \
         patch.object(provider, "_run_pipeline", return_value=mock_generated_text):
        res = await provider.generate_fix(
            code="def get_user(users, index):\n    return users[index]",
            stderr="IndexError: list index out of range",
        )

        assert res.success is True
        assert res.provider_name == "kagglehub"
        assert res.model_name == DEFAULT_KAGGLE_HANDLE
        assert "if index < len(users):" in res.fixed_code
        assert res.latency_ms >= 0


@pytest.mark.asyncio
async def test_kaggle_provider_generate_fix_failure():
    provider = KaggleProvider()

    with patch.object(provider, "get_model_path", side_effect=RuntimeError("Kaggle auth missing")):
        res = await provider.generate_fix(
            code="a = 1",
            stderr="Exception",
        )

        assert res.success is False
        assert res.error is not None
        assert "Kaggle auth missing" in res.error
        assert res.fixed_code == ""


@pytest.mark.asyncio
async def test_kaggle_provider_stream_fix():
    provider = KaggleProvider()

    with patch.object(provider, "generate_fix") as mock_gen:
        from bugwhisper.inference.base import InferenceResult
        mock_gen.return_value = InferenceResult(
            fixed_code="def clean(): pass",
            raw_output="def clean(): pass",
            latency_ms=10.0,
            provider_name="kagglehub",
            model_name=DEFAULT_KAGGLE_HANDLE,
            success=True,
        )

        chunks = []
        async for chunk in provider.stream_fix("broken()", "Error"):
            chunks.append(chunk)

        assert "".join(chunks) == "def clean(): pass"


def test_inference_manager_factory_with_kaggle(monkeypatch):
    monkeypatch.setenv("BUGWHISPER_PROVIDER", "kaggle")
    manager = get_default_inference_manager()
    assert isinstance(manager.primary, KaggleProvider)


@pytest.mark.asyncio
async def test_kaggle_server_routes():
    from httpx import ASGITransport, AsyncClient
    from bugwhisper.server.app import app

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Status route
        status_resp = await client.get("/api/kaggle/status")
        assert status_resp.status_code == 200
        data = status_resp.json()
        assert "library_installed" in data
        assert data["default_handle"] == DEFAULT_KAGGLE_HANDLE

        # 2. Infer route with mock
        with patch("bugwhisper.inference.kaggle_provider.KaggleProvider.generate_fix") as mock_fix:
            from bugwhisper.inference.base import InferenceResult
            mock_fix.return_value = InferenceResult(
                fixed_code="def healed(): pass",
                raw_output="def healed(): pass",
                latency_ms=12.5,
                provider_name="kagglehub",
                model_name=DEFAULT_KAGGLE_HANDLE,
                success=True,
            )

            infer_resp = await client.post(
                "/api/kaggle/infer",
                json={"code": "def broken(): pass", "stderr": "SyntaxError"},
            )
            assert infer_resp.status_code == 200
            infer_data = infer_resp.json()
            assert infer_data["success"] is True
            assert infer_data["fixed_code"] == "def healed(): pass"
