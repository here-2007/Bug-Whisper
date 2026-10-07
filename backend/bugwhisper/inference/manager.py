"""
Inference Manager & Fallback Orchestrator.
Manages inference providers with seamless, deterministic fallback to the heuristic rule engine.
"""

from __future__ import annotations

import logging
from typing import AsyncIterator, Optional

from .base import InferenceProvider, InferenceResult
from .heuristic_provider import HeuristicProvider
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
            logger.warning("Primary inference provider %s failed: %s; falling back to heuristic engine", self.primary.provider_name, exc)

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
            logger.warning("Primary stream from %s failed: %s; falling back to heuristic engine", self.primary.provider_name, exc)

        async for chunk in self.fallback.stream_fix(code, stderr):
            yield chunk


def get_default_inference_manager() -> InferenceManager:
    """Factory creating an InferenceManager with standard configuration."""
    return InferenceManager(
        primary_provider=OllamaProvider(),
        fallback_provider=HeuristicProvider(),
    )
