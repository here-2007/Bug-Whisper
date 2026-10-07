"""
OpenAI-Compatible Inference Provider (vLLM / HuggingFace TGI / Hosted Endpoints).
"""

from __future__ import annotations

import json
import time
from typing import AsyncIterator, Optional

import httpx

from .base import InferenceProvider, InferenceResult
from ..core.prompt_builder import build_chatml_prompt
from ..core.code_extractor import extract_python_code


class OpenAIProvider(InferenceProvider):
    """Client for vLLM or OpenAI-compatible inference servers."""

    def __init__(
        self,
        base_url: str = "http://localhost:8000/v1",
        model_name: str = "bug-whisper-qwen25-coder-3b",
        api_key: Optional[str] = None,
        timeout_seconds: float = 45.0,
    ):
        self.base_url = base_url.rstrip("/")
        self.model_name = model_name
        self.api_key = api_key or "EMPTY"
        self.timeout = timeout_seconds

    async def generate_fix(self, code: str, stderr: str) -> InferenceResult:
        prompt_bundle = build_chatml_prompt(code, stderr)
        url = f"{self.base_url}/chat/completions"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model_name,
            "messages": prompt_bundle.messages,
            "temperature": 0.0,
            "max_tokens": 768,
            "stream": False,
        }

        start_time = time.perf_counter()
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.post(url, json=payload, headers=headers)
                res.raise_for_status()
                data = res.json()

            raw_text = data["choices"][0]["message"]["content"]
            fixed_code = extract_python_code(raw_text)
            latency_ms = (time.perf_counter() - start_time) * 1000.0

            return InferenceResult(
                fixed_code=fixed_code,
                raw_output=raw_text,
                latency_ms=round(latency_ms, 2),
                provider_name="openai_compat",
                model_name=self.model_name,
                success=True,
            )

        except Exception as exc:
            latency_ms = (time.perf_counter() - start_time) * 1000.0
            return InferenceResult(
                fixed_code="",
                raw_output="",
                latency_ms=round(latency_ms, 2),
                provider_name="openai_compat",
                model_name=self.model_name,
                success=False,
                error=str(exc),
            )

    async def stream_fix(self, code: str, stderr: str) -> AsyncIterator[str]:
        prompt_bundle = build_chatml_prompt(code, stderr)
        url = f"{self.base_url}/chat/completions"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model_name,
            "messages": prompt_bundle.messages,
            "temperature": 0.0,
            "max_tokens": 768,
            "stream": True,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                async with client.stream("POST", url, json=payload, headers=headers) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if not line.startswith("data: "):
                            continue
                        data_str = line[6:].strip()
                        if data_str == "[DONE]":
                            break
                        chunk = json.loads(data_str)
                        delta = chunk["choices"][0].get("delta", {}).get("content", "")
                        if delta:
                            yield delta
        except Exception as exc:
            yield f"\n# Inference Error: {exc}\n"
