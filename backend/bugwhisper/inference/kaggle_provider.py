"""
Kaggle Hub Inference Provider.
Loads fine-tuned weights directly via kagglehub and executes neural remediation
using the local transformers/PyTorch pipeline.
Model handle: pernavjain/bug-whisper-qwen25-coder-3b
"""

from __future__ import annotations

import logging
import os
import time
from typing import AsyncIterator, Optional

from .base import InferenceProvider, InferenceResult
from ..core.prompt_builder import build_chatml_prompt
from ..core.code_extractor import extract_python_code

logger = logging.getLogger(__name__)

DEFAULT_KAGGLE_HANDLE = "pernavjain/bug-whisper-qwen25-coder-3b"


class KaggleProvider(InferenceProvider):
    """Inference provider using kagglehub to download and run the Qwen 2.5 Coder 3B model."""

    def __init__(
        self,
        model_handle: Optional[str] = None,
        use_gpu: bool = False,
        timeout_seconds: float = 60.0,
    ):
        self.model_handle = model_handle or os.getenv("KAGGLE_MODEL_HANDLE", DEFAULT_KAGGLE_HANDLE)
        self.use_gpu = use_gpu or (os.getenv("KAGGLE_USE_GPU", "").lower() in ("true", "1", "yes"))
        self.timeout = timeout_seconds
        self._cached_path: Optional[str] = None
        self._pipeline = None

    def get_model_path(self, force_download: bool = False) -> str:
        """Resolves local model directory, downloading via kagglehub if not already cached."""
        if self._cached_path and not force_download and os.path.exists(self._cached_path):
            return self._cached_path

        import kagglehub

        logger.info("Downloading Kaggle model weights for %s...", self.model_handle)
        path = kagglehub.model_download(self.model_handle, force_download=force_download)
        self._cached_path = path
        return path

    def is_model_downloaded(self) -> bool:
        """Checks if the model directory already exists in the local kagglehub cache."""
        try:
            import kagglehub
            # kagglehub resolves from cache without downloading when cached
            path = kagglehub.model_download(self.model_handle)
            return bool(path and os.path.exists(path))
        except Exception:
            return False

    async def generate_fix(self, code: str, stderr: str) -> InferenceResult:
        """Generates a verified fix using the Kaggle model."""
        prompt_bundle = build_chatml_prompt(code, stderr)
        start_time = time.perf_counter()

        try:
            model_path = self.get_model_path()
            raw_text = self._run_pipeline(prompt_bundle.raw_chatml, model_path)
            fixed_code = extract_python_code(raw_text)
            latency_ms = (time.perf_counter() - start_time) * 1000.0

            return InferenceResult(
                fixed_code=fixed_code,
                raw_output=raw_text,
                latency_ms=round(latency_ms, 2),
                provider_name="kagglehub",
                model_name=self.model_handle,
                success=True,
            )
        except Exception as exc:
            latency_ms = (time.perf_counter() - start_time) * 1000.0
            logger.warning("Kaggle model generation failed: %s", exc)
            return InferenceResult(
                fixed_code="",
                raw_output="",
                latency_ms=round(latency_ms, 2),
                provider_name="kagglehub",
                model_name=self.model_handle,
                success=False,
                error=str(exc),
            )

    def _run_pipeline(self, prompt: str, model_path: str) -> str:
        """Runs generation using transformers pipeline."""
        from transformers import pipeline

        if self._pipeline is None:
            device = "cuda:0" if self.use_gpu else "cpu"
            self._pipeline = pipeline(
                "text-generation",
                model=model_path,
                device=device,
            )

        outputs = self._pipeline(
            prompt,
            max_new_tokens=768,
            temperature=0.01,
            do_sample=False,
        )
        raw_text = outputs[0]["generated_text"]
        if raw_text.startswith(prompt):
            raw_text = raw_text[len(prompt):]
        return raw_text

    async def stream_fix(self, code: str, stderr: str) -> AsyncIterator[str]:
        """Streams output from Kaggle model generation."""
        res = await self.generate_fix(code, stderr)
        if res.success:
            # Yield in chunks for streaming consumers
            chunk_size = 32
            for i in range(0, len(res.fixed_code), chunk_size):
                yield res.fixed_code[i:i + chunk_size]
        else:
            yield f"\n[Kaggle Generation Error: {res.error}]\n"
