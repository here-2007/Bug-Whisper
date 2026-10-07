"""
Ollama Inference Provider for local CPU/GPU execution.
Connects to http://localhost:11434 with qwen2.5-coder:3b or fine-tuned Modelfiles.
"""

from __future__ import annotations

import json
import time
from typing import AsyncIterator

import httpx

from .base import InferenceProvider, InferenceResult
from ..core.prompt_builder import build_chatml_prompt
from ..core.code_extractor import extract_python_code


class OllamaProvider(InferenceProvider):
    """Client for local Ollama instances."""

    def __init__(
        self,
        base_url: str = "http://localhost:11434",
        model_name: str = "qwen2.5-coder:3b",
        timeout_seconds: float = 45.0,
    ):
        self.base_url = base_url.rstrip("/")
        self.model_name = model_name
        self.timeout = timeout_seconds

    async def generate_fix(self, code: str, stderr: str) -> InferenceResult:
        prompt_bundle = build_chatml_prompt(code, stderr)
        url = f"{self.base_url}/api/chat"

        payload = {
            "model": self.model_name,
            "messages": prompt_bundle.messages,
            "stream": False,
            "options": {
                "temperature": 0.0,
                "num_predict": 768,
            },
        }

        start_time = time.perf_counter()
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.post(url, json=payload)
                res.raise_for_status()
                data = res.json()

            raw_text = data.get("message", {}).get("content", "")
            fixed_code = extract_python_code(raw_text)
            latency_ms = (time.perf_counter() - start_time) * 1000.0

            return InferenceResult(
                fixed_code=fixed_code,
                raw_output=raw_text,
                latency_ms=round(latency_ms, 2),
                provider_name="ollama",
                model_name=self.model_name,
                success=True,
            )

        except Exception as exc:
            latency_ms = (time.perf_counter() - start_time) * 1000.0
            return InferenceResult(
                fixed_code="",
                raw_output="",
                latency_ms=round(latency_ms, 2),
                provider_name="ollama",
                model_name=self.model_name,
                success=False,
                error=str(exc),
            )

    async def stream_fix(self, code: str, stderr: str) -> AsyncIterator[str]:
        prompt_bundle = build_chatml_prompt(code, stderr)
        url = f"{self.base_url}/api/chat"

        payload = {
            "model": self.model_name,
            "messages": prompt_bundle.messages,
            "stream": True,
            "options": {
                "temperature": 0.0,
                "num_predict": 768,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                async with client.stream("POST", url, json=payload) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if not line.strip():
                            continue
                        chunk = json.loads(line)
                        content = chunk.get("message", {}).get("content", "")
                        if content:
                            yield content
        except Exception as exc:
            yield f"\n# Inference Error: {exc}\n"
