"""
Hugging Face Inference Provider.
Connects via huggingface_hub InferenceClient or local transformers pipeline.
Supports fine-tuned pernavjain/bug-whisper-qwen25-coder-3b and base Qwen/Qwen2.5-Coder-3B-Instruct.
"""

from __future__ import annotations

import os
import time
from typing import AsyncIterator, Optional

from .base import InferenceProvider, InferenceResult
from ..core.prompt_builder import build_chatml_prompt
from ..core.code_extractor import extract_python_code


class HuggingFaceProvider(InferenceProvider):
    """Client for Hugging Face Hub Inference API and local transformers models."""

    def __init__(
        self,
        model_name: Optional[str] = None,
        token: Optional[str] = None,
        use_local: bool = False,
        timeout_seconds: float = 45.0,
    ):
        self.model_name = model_name or os.getenv(
            "HF_MODEL", "pernavjain/bug-whisper-qwen25-coder-3b"
        )
        self.token = token or os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_HUB_TOKEN") or None
        self.use_local = use_local or os.getenv("HF_LOCAL", "").lower() in ("true", "1", "yes")
        self.timeout = timeout_seconds
        self._local_pipeline = None

    async def generate_fix(self, code: str, stderr: str) -> InferenceResult:
        prompt_bundle = build_chatml_prompt(code, stderr)
        start_time = time.perf_counter()

        if self.use_local:
            return await self._generate_local(prompt_bundle.raw_chatml, start_time)

        return await self._generate_api(prompt_bundle.messages, prompt_bundle.raw_chatml, start_time)

    async def _generate_api(self, messages: list, raw_chatml: str, start_time: float) -> InferenceResult:
        try:
            from huggingface_hub import AsyncInferenceClient

            client = AsyncInferenceClient(token=self.token, timeout=self.timeout)

            # Attempt chat completion on the model
            try:
                response = await client.chat_completion(
                    messages=messages,
                    model=self.model_name,
                    max_tokens=768,
                    temperature=0.01,
                )
                raw_text = response.choices[0].message.content or ""
            except Exception:
                # Fallback to direct text generation with raw ChatML
                raw_text = await client.text_generation(
                    prompt=raw_chatml,
                    model=self.model_name,
                    max_new_tokens=768,
                    temperature=0.01,
                )

            fixed_code = extract_python_code(raw_text)
            latency_ms = (time.perf_counter() - start_time) * 1000.0

            return InferenceResult(
                fixed_code=fixed_code,
                raw_output=raw_text,
                latency_ms=round(latency_ms, 2),
                provider_name="huggingface",
                model_name=self.model_name,
                success=True,
            )

        except Exception as exc:
            latency_ms = (time.perf_counter() - start_time) * 1000.0
            return InferenceResult(
                fixed_code="",
                raw_output="",
                latency_ms=round(latency_ms, 2),
                provider_name="huggingface",
                model_name=self.model_name,
                success=False,
                error=str(exc),
            )

    async def _generate_local(self, raw_prompt: str, start_time: float) -> InferenceResult:
        try:
            from transformers import pipeline

            if self._local_pipeline is None:
                self._local_pipeline = pipeline(
                    "text-generation",
                    model=self.model_name,
                    device="cpu",
                )

            outputs = self._local_pipeline(
                raw_prompt,
                max_new_tokens=768,
                temperature=0.0,
                do_sample=False,
            )
            raw_text = outputs[0]["generated_text"]
            if raw_text.startswith(raw_prompt):
                raw_text = raw_text[len(raw_prompt):]
            fixed_code = extract_python_code(raw_text)
            latency_ms = (time.perf_counter() - start_time) * 1000.0

            return InferenceResult(
                fixed_code=fixed_code,
                raw_output=raw_text,
                latency_ms=round(latency_ms, 2),
                provider_name="transformers_local",
                model_name=self.model_name,
                success=True,
            )
        except Exception as exc:
            latency_ms = (time.perf_counter() - start_time) * 1000.0
            return InferenceResult(
                fixed_code="",
                raw_output="",
                latency_ms=round(latency_ms, 2),
                provider_name="transformers_local",
                model_name=self.model_name,
                success=False,
                error=str(exc),
            )

    async def stream_fix(self, code: str, stderr: str) -> AsyncIterator[str]:
        prompt_bundle = build_chatml_prompt(code, stderr)
        try:
            from huggingface_hub import AsyncInferenceClient

            client = AsyncInferenceClient(token=self.token, timeout=self.timeout)
            stream_resp = await client.chat_completion(
                messages=prompt_bundle.messages,
                model=self.model_name,
                max_tokens=768,
                temperature=0.01,
                stream=True,
            )
            async for chunk in stream_resp:
                content = chunk.choices[0].delta.content if chunk.choices else ""
                if content:
                    yield content
        except Exception as exc:
            yield f"\n[HF Stream error: {exc}]\n"
