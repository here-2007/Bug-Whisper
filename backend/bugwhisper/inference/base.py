"""
Abstract Base Inference Provider.
Defines common interface for synchronous synthesis and async token streaming.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import AsyncIterator, Optional


@dataclass(frozen=True)
class InferenceResult:
    """Represents the synthesized Python fix from an inference model."""
    fixed_code: str
    raw_output: str
    latency_ms: float
    provider_name: str
    model_name: str
    success: bool
    error: Optional[str] = None


class InferenceProvider(ABC):
    """Abstract interface implemented by all model providers."""

    @abstractmethod
    async def generate_fix(self, code: str, stderr: str) -> InferenceResult:
        """Synthesizes a Python fix for the provided code and error traceback."""
        raise NotImplementedError

    @abstractmethod
    async def stream_fix(self, code: str, stderr: str) -> AsyncIterator[str]:
        """Yields synthesized code tokens in real time."""
        raise NotImplementedError
