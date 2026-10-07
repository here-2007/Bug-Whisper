"""
Inference Manager & Fallback Orchestrator.
Manages inference providers with seamless, deterministic fallback to the heuristic rule engine.
"""

from __future__ import annotations

import logging
import os
from typing import AsyncIterator, Optional

from .base import InferenceProvider, InferenceResult
from .heuristic_provider import HeuristicProvider
from .hf_provider import HuggingFaceProvider
from .ollama_provider import OllamaProvider
from .openai_provider import OpenAIProvider

logger = logging.getLogger(__name__)


class InferenceManager:
    """Orchestrates multi-tier inference with automatic deterministic failover."""

    def __init__(
        self,
        primary_provider: Optional[InferenceProvider] = None,
        fallback_provider: Optional[InferenceProvider] = None,
    ):
        self.primary = primary_provider or OllamaProvider()
        self.fallback = fallback_provider or HeuristicProvider()

    async def generate_fix(self, code: str, stderr: str) -> InferenceResult:
        """Attempts primary provider inference; falls back to heuristic engine on error."""
        try:
            res = await self.primary.generate_fix(code, stderr)
            if res.success and res.fixed_code.strip():
                return res
        except Exception as exc:
            provider_label = getattr(self.primary, "provider_name", "primary")
            logger.warning("Primary inference provider %s failed: %s; falling back to heuristic engine", provider_label, exc)

        return await self.fallback.generate_fix(code, stderr)

    async def stream_fix(self, code: str, stderr: str) -> AsyncIterator[str]:
        """Streams tokens from primary provider; falls back to heuristic engine on error."""
        try:
            chunks = []
            async for chunk in self.primary.stream_fix(code, stderr):
                chunks.append(chunk)
                yield chunk
            if chunks:
                return
        except Exception as exc:
            provider_label = getattr(self.primary, "provider_name", "primary")
            logger.warning("Primary stream from %s failed: %s; falling back to heuristic engine", provider_label, exc)

        async for chunk in self.fallback.stream_fix(code, stderr):
            yield chunk


def get_default_inference_manager() -> InferenceManager:
    """Factory creating an InferenceManager with environment-aware configuration."""
    provider_type = os.getenv("BUGWHISPER_PROVIDER", "ollama").lower()

    if provider_type in ("openai", "vllm", "hosted"):
        primary: InferenceProvider = OpenAIProvider(
            base_url=os.getenv("OPENAI_BASE_URL", "http://localhost:8000/v1"),
            model_name=os.getenv("OPENAI_MODEL", "bug-whisper-qwen25-coder-3b"),
            api_key=os.getenv("OPENAI_API_KEY") or None,
        )
    elif provider_type in ("huggingface", "hf", "transformers"):
        primary = HuggingFaceProvider(
            model_name=os.getenv("HF_MODEL", "pernavjain/bug-whisper-qwen25-coder-3b"),
            token=os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_HUB_TOKEN") or None,
            use_local=os.getenv("HF_LOCAL", "").lower() in ("true", "1", "yes"),
        )
    elif provider_type == "heuristic":
        primary = HeuristicProvider()
    else:
        primary = OllamaProvider(
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
            model_name=os.getenv("OLLAMA_MODEL", "bug-whisper-qwen25-coder-3b"),
        )

    return InferenceManager(
        primary_provider=primary,
        fallback_provider=HeuristicProvider(),
    )

