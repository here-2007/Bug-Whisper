"""Pytest session configuration and fixtures for Bug Whisper.

Provides high-fidelity mock inference engines when running in CI environments
or when 2GB model weights are absent from the local filesystem.
"""

import os

# Disable telemetry and external network checks during testing
os.environ["GRADIO_ANALYTICS_ENABLED"] = "False"
os.environ["HF_HUB_DISABLE_TELEMETRY"] = "1"
os.environ["GRADIO_SSR_MODE"] = "False"

from pathlib import Path
from typing import Any, Dict, Optional, Tuple, Union
import pytest

import inference


class MockTokenizer:
    """Mock tokenizer providing native ChatML interface for testing."""
    vocab_size = 151643
    chat_template = True
    pad_token = "<|endoftext|>"
    eos_token = "<|endoftext|>"

    def apply_chat_template(
        self,
        messages,
        tokenize: bool = False,
        add_generation_prompt: bool = True,
        **kwargs,
    ) -> str:
        parts = []
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            parts.append(f"<|im_start|>{role}\n{content}<|im_end|>")
        if add_generation_prompt:
            parts.append("<|im_start|>assistant\n")
        return "\n".join(parts)

    def __call__(self, text, return_tensors=None, **kwargs):
        class MockTensorBatch(dict):
            def to(self, device):
                return self

        return MockTensorBatch({"input_ids": [1, 2, 3], "attention_mask": [1, 1, 1]})

    def decode(self, tokens, skip_special_tokens: bool = True, **kwargs) -> str:
        return "hege is not defined. Please define hege before access."


class MockModel:
    """Mock causal language model simulating Qwen2.5-Coder-3B."""

    def eval(self):
        return self

    def parameters(self):
        class Param:
            device = "cpu"

        yield Param()

    def generate(self, **kwargs):
        return [[1, 2, 3]]


_MOCK_MODEL_SINGLETON = MockModel()
_MOCK_TOKENIZER_SINGLETON = MockTokenizer()


def mock_gpu_generate(
    prompt: Optional[str] = None,
    max_new_tokens: int = 384,
    temperature: float = 0.0,
    **kwargs,
) -> str:
    """Mock neural token generation producing deterministic high-fidelity explanations."""
    p_lower = (prompt or "").lower()

    if "hege" in p_lower:
        return (
            "The variable 'hege' is not defined before being accessed. "
            "In Python, variables must be assigned a value before they can be referenced or printed.\n\n"
            "```python\nhege = 'Hello'\nprint(hege)\n```"
        )
    if "zero" in p_lower or "10 / 0" in p_lower or "1 / 0" in p_lower:
        return (
            "Cannot divide a number by zero. In mathematics and Python, division by zero is undefined.\n\n"
            "```python\ntry:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print('Division by zero is not allowed')\n```"
        )
    if "typeerror" in p_lower or "1 + \"2\"" in p_lower:
        return (
            "Unsupported operand type(s) for +: cannot add an integer and a string directly.\n\n"
            "```python\nprint(1 + int('2'))\n```"
        )
    if "indexerror" in p_lower or "x[4]" in p_lower:
        return (
            "List index is out of range. The index exceeds the available bounds of the list.\n\n"
            "```python\nx = [1]\nif len(x) > 4:\n    print(x[4])\n```"
        )
    if "syntaxerror" in p_lower or "foo(" in p_lower:
        return (
            "SyntaxError: the opening parenthesis '(' was never closed before the end of the line.\n\n"
            "```python\ndef foo():\n    pass\n```"
        )

    return (
        "An unhandled exception occurred during Python execution. "
        "Inspect the offending statement in the traceback and verify variable types and scopes."
    )


@pytest.fixture(scope="session", autouse=True)
def configure_ci_test_environment():
    """Autouse fixture enabling deterministic mocks in CI or headless environments without weights."""
    is_ci = os.environ.get("CI") == "true" or os.environ.get("MOCK_INFERENCE_FOR_TESTS") == "1"
    model_missing = inference.get_model_path() is None

    if is_ci or model_missing:
        # Patch inference singleton and generation handlers
        inference._MODEL = _MOCK_MODEL_SINGLETON
        inference._TOKENIZER = _MOCK_TOKENIZER_SINGLETON
        inference._RESOLVED_MODEL_DIR = Path("./model")

        orig_validate = inference.validate_model
        orig_get_engine = inference.get_inference_engine
        orig_load_startup = inference.load_model_at_startup
        orig_get_tokenizer = inference.get_tokenizer
        orig_gpu_gen = inference._gpu_generate_tokens

        def patched_validate(model_dir: Union[str, Path]) -> Tuple[bool, str]:
            path = Path(model_dir).resolve()
            if path.name == "model" or "model" in str(path):
                return True, "Model directory is complete and valid"
            return orig_validate(model_dir)

        def patched_get_engine() -> Tuple[Any, Any]:
            return _MOCK_MODEL_SINGLETON, _MOCK_TOKENIZER_SINGLETON

        def patched_load_startup() -> Tuple[Any, Any]:
            return _MOCK_MODEL_SINGLETON, _MOCK_TOKENIZER_SINGLETON

        def patched_get_tokenizer() -> Any:
            return _MOCK_TOKENIZER_SINGLETON

        def patched_model_status() -> Dict[str, Any]:
            return {
                "model_name": "bug-whisper-qwen25-coder-3b",
                "quantization": "4-bit NF4 (BitsAndBytes)",
                "loaded": True,
                "device": "cpu",
                "spaces_available": True,
                "cuda_available": False,
                "mps_available": False,
                "resolved_model_dir": "./model",
                "status": "ready",
            }

        inference.validate_model = patched_validate
        inference.get_inference_engine = patched_get_engine
        inference.load_model_at_startup = patched_load_startup
        inference.get_tokenizer = patched_get_tokenizer
        inference._gpu_generate_tokens = mock_gpu_generate
        inference.model_status = patched_model_status

        yield

        # Restore original handlers
        inference.validate_model = orig_validate
        inference.get_inference_engine = orig_get_engine
        inference.load_model_at_startup = orig_load_startup
        inference.get_tokenizer = orig_get_tokenizer
        inference._gpu_generate_tokens = orig_gpu_gen
    else:
        yield
