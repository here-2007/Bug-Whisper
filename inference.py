"""Bug Whisper Model Inference Engine.

Integrates the standalone merged 4-bit Qwen 2.5 Coder 3B model (pernavjain/bug-whisper-qwen25-coder-3b)
with Hugging Face Spaces GPU acceleration (@spaces.GPU), automatic KaggleHub fallback download,
and robust structured diagnosis parsing.
"""

from __future__ import annotations

import json
import logging
import os
import re
import shutil
import threading
import time
from pathlib import Path
from typing import Any, Dict, Optional, Tuple, Union

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("bugwhisper.inference")

# Hugging Face Spaces GPU decorator support
try:
    import spaces  # type: ignore

    SPACES_AVAILABLE = True
    logger.info("Hugging Face Spaces ZeroGPU package detected.")
except ImportError:
    SPACES_AVAILABLE = False
    logger.info("spaces package not found; using local mock GPU decorator.")

    class _MockSpaces:
        @staticmethod
        def GPU(func=None, duration=None):  # noqa: N802
            if func is None:

                def decorator(f):
                    return f

                return decorator
            return func

    spaces = _MockSpaces()  # type: ignore

# Lazy PyTorch / Transformers imports will happen on demand or globally
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# Global model state & singleton locks
_MODEL = None
_TOKENIZER = None
_RESOLVED_MODEL_DIR: Optional[Path] = None
_MODEL_LOCK = threading.Lock()
_INFERENCE_LOCK = threading.Lock()

DEFAULT_KAGGLE_HANDLE = "pernavjain/bug-whisper-qwen25-coder-3b/pyTorch/4bit-bnb"
DEFAULT_MODEL_DIR = os.environ.get("MODEL_DIR", "./model")
MAX_CODE_LENGTH = 50000
MAX_TRACEBACK_LENGTH = 10000
MAX_ERROR_MSG_LENGTH = 2000

REQUIRED_MODEL_FILES = (
    "config.json",
    "model.safetensors.index.json",
    "tokenizer.json",
    "tokenizer_config.json",
)


def get_candidate_paths() -> list[Path]:
    """Return ordered list of candidate model directories to check."""
    candidates: list[Path] = []

    # 1. Environment variable if explicitly specified
    if "MODEL_DIR" in os.environ:
        candidates.append(Path(os.environ["MODEL_DIR"]).resolve())

    # 2. Local repository directory ./model
    repo_model = Path(__file__).parent / "model"
    candidates.append(repo_model.resolve())

    # 3. Current working directory ./model
    cwd_model = Path("./model").resolve()
    if cwd_model not in candidates:
        candidates.append(cwd_model)

    # 4. Standard container/Spaces root /model
    candidates.append(Path("/model"))

    return candidates


def validate_model(model_dir: Union[str, Path]) -> Tuple[bool, str]:
    """Validate that the given directory contains all required model and tokenizer artifacts.

    Checks:
    - config.json
    - model.safetensors.index.json
    - tokenizer.json
    - tokenizer_config.json
    - All .safetensors shards referenced in model.safetensors.index.json
    """
    path = Path(model_dir).resolve()
    if not path.is_dir():
        return False, f"Directory does not exist: {path}"

    for req_file in REQUIRED_MODEL_FILES:
        file_path = path / req_file
        if not file_path.is_file() or file_path.stat().st_size == 0:
            return False, f"Missing or empty required artifact: {req_file} at {path}"

    # Validate all referenced shards in model.safetensors.index.json
    index_file = path / "model.safetensors.index.json"
    try:
        with open(index_file, "r", encoding="utf-8") as f:
            index_data = json.load(f)
        weight_map = index_data.get("weight_map", {})
        shards = set(weight_map.values())
        if not shards:
            return False, "Index file contains empty weight_map"

        for shard_name in shards:
            shard_path = path / shard_name
            if not shard_path.is_file() or shard_path.stat().st_size == 0:
                return False, f"Missing or empty model shard: {shard_name} at {path}"
    except Exception as exc:
        return False, f"Failed to parse model.safetensors.index.json: {exc}"

    return True, "Model directory is complete and valid"


def get_model_path() -> Optional[Path]:
    """Check candidate paths and return the first valid model directory, or None if absent."""
    for candidate in get_candidate_paths():
        is_valid, reason = validate_model(candidate)
        if is_valid:
            logger.info("Found valid model at: %s", candidate)
            return candidate
        else:
            logger.debug("Candidate path invalid (%s): %s", candidate, reason)
    return None


def download_model(
    target_dir: Optional[Union[str, Path]] = None,
    handle: Optional[str] = None,
) -> Path:
    """Download the 4-bit model from Kaggle via kagglehub and place under target_dir.

    Does not download if the model is already present and valid.
    """
    if target_dir is None:
        target_dir = Path(os.environ.get("MODEL_DIR", "./model")).resolve()
    else:
        target_dir = Path(target_dir).resolve()

    # Fast path check outside lock
    is_valid, _ = validate_model(target_dir)
    if is_valid:
        logger.info("Model already exists and validated at: %s", target_dir)
        return target_dir

    with _MODEL_LOCK:
        # Re-check under lock in case another thread already materialized it
        is_valid, _ = validate_model(target_dir)
        if is_valid:
            logger.info("Model already exists and validated at: %s", target_dir)
            return target_dir

        model_handle = handle or os.environ.get("KAGGLE_MODEL_HANDLE", DEFAULT_KAGGLE_HANDLE)
        logger.info("Downloading model from KaggleHub handle: %s ...", model_handle)

        try:
            import kagglehub  # type: ignore

            downloaded_path = Path(kagglehub.model_download(model_handle))
            logger.info("kagglehub downloaded model to cache: %s", downloaded_path)
        except Exception as exc:
            logger.error("Failed to download model via kagglehub: %s", exc)
            raise RuntimeError(
                f"Kaggle download failed for handle '{model_handle}'. Ensure network access or valid Kaggle credentials: {exc}"
            ) from exc

        # Target directory setup
        target_dir.mkdir(parents=True, exist_ok=True)

        # Materialize files from kagglehub cache into target_dir
        for item in downloaded_path.iterdir():
            dest = target_dir / item.name
            if item.is_file():
                if not dest.exists() or dest.stat().st_size != item.stat().st_size:
                    shutil.copy2(item, dest)
            elif item.is_dir() and item.name not in (".git", "__pycache__"):
                if not dest.exists():
                    shutil.copytree(item, dest)

        is_valid, reason = validate_model(target_dir)
        if not is_valid:
            raise RuntimeError(f"Materialized model at {target_dir} failed validation: {reason}")

    logger.info("Model successfully materialized and validated at: %s", target_dir)
    return target_dir


def load_tokenizer(model_path: Union[str, Path]) -> AutoTokenizer:
    """Load the model's native AutoTokenizer and verify chat template presence."""
    path_str = str(Path(model_path).resolve())
    logger.info("Loading tokenizer from: %s", path_str)
    tokenizer = AutoTokenizer.from_pretrained(path_str, fix_markdown=False)

    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token or "<|PAD_TOKEN|>"

    logger.info(
        "Tokenizer loaded successfully. Vocab size: %d, Chat template available: %s",
        tokenizer.vocab_size,
        bool(tokenizer.chat_template),
    )
    return tokenizer


def load_model(model_path: Union[str, Path]) -> AutoModelForCausalLM:
    """Load the standalone merged 4-bit BitsAndBytes Qwen2.5-Coder-3B model.

    Preserves 4-bit NormalFloat (NF4) quantization.
    Never converts to FP16, never merges LoRA, never uses PeftModel.
    """
    path_str = str(Path(model_path).resolve())
    logger.info("Loading 4-bit BitsAndBytes model with device_map='auto' from: %s", path_str)

    start_time = time.perf_counter()
    model = AutoModelForCausalLM.from_pretrained(
        path_str,
        device_map="auto",
        dtype=torch.bfloat16 if torch.cuda.is_available() else None,
        low_cpu_mem_usage=True,
    )
    model.eval()
    duration = time.perf_counter() - start_time

    device = next(model.parameters()).device
    logger.info("Model loaded successfully in %.2fs. Primary device: %s", duration, device)
    return model


def get_inference_engine() -> Tuple[AutoModelForCausalLM, AutoTokenizer]:
    """Thread-safe singleton accessor for the model and tokenizer.

    Initializes on first call and caches for all subsequent requests.
    """
    global _MODEL, _TOKENIZER, _RESOLVED_MODEL_DIR

    if _MODEL is not None and _TOKENIZER is not None:
        return _MODEL, _TOKENIZER

    with _MODEL_LOCK:
        if _MODEL is not None and _TOKENIZER is not None:
            return _MODEL, _TOKENIZER

        # 1. Discover local model
        model_path = get_model_path()

        # 2. Fall back to downloading from Kaggle if absent
        if model_path is None:
            logger.warning("No local model found in candidate paths. Initiating Kaggle download...")
            model_path = download_model()

        # 3. Validate
        is_valid, reason = validate_model(model_path)
        if not is_valid:
            raise RuntimeError(f"Model validation error at {model_path}: {reason}")

        # 4. Load tokenizer and model
        _TOKENIZER = load_tokenizer(model_path)
        _MODEL = load_model(model_path)
        _RESOLVED_MODEL_DIR = model_path

        return _MODEL, _TOKENIZER


def load_model_at_startup() -> Tuple[AutoModelForCausalLM, AutoTokenizer]:
    """Eagerly load model and tokenizer at application startup and keep resident in memory."""
    logger.info("Initializing Bug Whisper model eagerly at startup...")
    model, tokenizer = get_inference_engine()
    logger.info("Model preloaded successfully and resident in memory.")
    return model, tokenizer


def get_tokenizer() -> AutoTokenizer:
    """Return the cached tokenizer or load it from the resolved model directory."""
    global _TOKENIZER
    if _TOKENIZER is not None:
        return _TOKENIZER

    with _MODEL_LOCK:
        if _TOKENIZER is not None:
            return _TOKENIZER

        model_path = get_model_path()
        if model_path is None:
            model_path = download_model()

        _TOKENIZER = load_tokenizer(model_path)
        return _TOKENIZER


def _gpu_generate_tokens(
    prompt: Optional[str] = None,
    max_new_tokens: int = 384,
    temperature: float = 0.0,
    model: Optional[AutoModelForCausalLM] = None,
    input_ids: Optional[torch.Tensor] = None,
    attention_mask: Optional[torch.Tensor] = None,
) -> Union[str, torch.Tensor]:
    """Run model generation inside Hugging Face Spaces GPU allocation context.

    On Spaces ZeroGPU, the GPU allocation is held by the top-level @spaces.GPU handler.
    Guarded by _INFERENCE_LOCK to serialize access across threads on macOS MPS and CUDA.
    """
    with _INFERENCE_LOCK:
        if prompt is not None:
            active_model, active_tokenizer = get_inference_engine()
            device = next(active_model.parameters()).device
            inputs = active_tokenizer(prompt, return_tensors="pt")
            active_input_ids = inputs["input_ids"].to(device)
            active_mask = inputs.get("attention_mask", torch.ones_like(active_input_ids)).to(device)

            with torch.inference_mode():
                outputs = active_model.generate(
                    input_ids=active_input_ids,
                    attention_mask=active_mask,
                    max_new_tokens=max_new_tokens,
                    do_sample=temperature > 0.0,
                    temperature=temperature if temperature > 0.0 else None,
                    pad_token_id=active_model.config.pad_token_id or active_model.config.eos_token_id,
                    eos_token_id=active_model.config.eos_token_id,
                )

            input_len = active_input_ids.shape[1]
            generated_tokens = outputs[0][input_len:]
            return active_tokenizer.decode(generated_tokens, skip_special_tokens=True)

        if model is not None and input_ids is not None:
            mask = attention_mask if attention_mask is not None else torch.ones_like(input_ids)
            with torch.inference_mode():
                outputs = model.generate(
                    input_ids=input_ids,
                    attention_mask=mask,
                    max_new_tokens=max_new_tokens,
                    do_sample=temperature > 0.0,
                    temperature=temperature if temperature > 0.0 else None,
                    pad_token_id=model.config.pad_token_id or model.config.eos_token_id,
                    eos_token_id=model.config.eos_token_id,
                )
            return outputs

        raise ValueError("Either prompt or (model and input_ids) must be provided to _gpu_generate_tokens.")


def build_prompt(
    tokenizer: AutoTokenizer,
    code: str,
    error_type: Optional[str] = None,
    error_message: Optional[str] = None,
    traceback: Optional[str] = None,
    line: Optional[int] = None,
) -> str:
    """Format prompt using the exact ChatML contract defined in Modelfile and context.md."""
    clean_code = (code or "").strip()[:MAX_CODE_LENGTH]
    clean_tb = (traceback or error_message or "").strip()
    truncated_stderr = clean_tb[:300] if clean_tb else f"{error_type or 'RuntimeError'}: {error_message or 'Error'}"

    system_content = (
        "You are an expert Python bug-fixing assistant. Fix all errors in the provided code and return only the corrected Python code."
    )

    user_content = (
        f"Fix the bug in this Python code:\n\n"
        f"```python\n{clean_code}\n```\n\n"
        f"Error output:\n```\n{truncated_stderr}\n```"
    )

    messages = [
        {"role": "system", "content": system_content},
        {"role": "user", "content": user_content},
    ]

    return tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)


def parse_model_output(
    raw_text: str,
    error_type: str,
    error_message: str,
    line: Optional[int] = None,
) -> Dict[str, str]:
    """Robustly parse structured diagnosis fields from raw model output.

    Handles valid JSON, markdown blocks, paragraph prose, and malformed/empty text.
    Ensures safe fallback values are always populated for what_happened and why_it_happened.
    """
    cleaned = (raw_text or "").strip()
    line_suffix = f" on line {line}" if line else ""

    if not cleaned:
        return {
            "what_happened": f"{error_type}{line_suffix}: {error_message}",
            "why_it_happened": f"Python raised a {error_type} during bytecode execution.",
            "suggested_fix": "Inspect the offending line and verify variables and types.",
        }

    # Attempt JSON extraction
    json_candidates = []
    fence_match = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", cleaned)
    if fence_match:
        json_candidates.append(fence_match.group(1).strip())
    obj_match = re.search(r"\{[\s\S]*\}", cleaned)
    if obj_match:
        json_candidates.append(obj_match.group(0).strip())

    for candidate in json_candidates:
        try:
            data = json.loads(candidate)
            if isinstance(data, dict):
                what = str(data.get("what_happened", data.get("what", ""))).strip()
                why = str(data.get("why_it_happened", data.get("why", ""))).strip()
                fix = str(data.get("suggested_fix", data.get("fix", data.get("how_to_fix", "")))).strip()
                if what or why:
                    return {
                        "what_happened": what or f"{error_type}: {error_message}",
                        "why_it_happened": why or "The Python interpreter encountered an unhandled exception.",
                        "suggested_fix": fix,
                    }
        except Exception:
            pass

    # Paragraph-based extraction
    paragraphs = [p.strip() for p in cleaned.split("\n\n") if p.strip()]
    if paragraphs:
        what = paragraphs[0]
        why = paragraphs[1] if len(paragraphs) > 1 else "The code violated Python runtime constraints."
        fix = "\n\n".join(paragraphs[2:]) if len(paragraphs) > 2 else ""
        return {
            "what_happened": what,
            "why_it_happened": why,
            "suggested_fix": fix,
        }

    return {
        "what_happened": f"{error_type}{line_suffix}: {error_message}",
        "why_it_happened": f"Python raised a {error_type} during bytecode execution.",
        "suggested_fix": "Inspect the offending line and verify variables and types.",
    }


def extract_repaired_code(raw_text: str, original_code: str) -> Optional[str]:
    """Extract clean repaired Python code from model output."""
    cleaned = (raw_text or "").strip()
    if not cleaned:
        return None

    # Check for markdown code fences: ```python ... ``` or ``` ... ```
    fence_matches = re.findall(r"```(?:python)?\s*([\s\S]*?)```", cleaned)
    if fence_matches:
        for match in fence_matches:
            cand = match.strip()
            if cand and cand != original_code.strip():
                return cand
        longest = max(fence_matches, key=len).strip()
        if longest and longest != original_code.strip():
            return longest

    # If raw_text is itself Python code
    lines = cleaned.splitlines()
    pythonic_indicators = ("def ", "class ", "import ", "from ", "print(", "return ", "=", "if ", "for ", "while ")
    has_python = any(any(line.strip().startswith(ind) for ind in pythonic_indicators) for line in lines)
    if has_python and not cleaned.startswith("{") and not cleaned.startswith("Error:"):
        if cleaned != original_code.strip():
            return cleaned

    return None


def explain_error(
    code: str,
    error_type: str,
    error_message: str,
    traceback: str,
    line: Optional[int] = None,
    file: Optional[str] = "main.py",
    temperature: float = 0.0,
    max_new_tokens: int = 384,
) -> Dict[str, Any]:
    """Synthesize a structured error diagnosis using the Bug Whisper 4-bit model.

    Returns a structured dictionary matching the frontend Explanation block contract.
    """
    start_time = time.perf_counter()

    # Input sanitization and boundary defense
    safe_code = (code or "")[:MAX_CODE_LENGTH]
    safe_error_type = (error_type or "RuntimeError").strip()[:100]
    safe_error_msg = (error_message or "An unhandled exception occurred").strip()[:MAX_ERROR_MSG_LENGTH]
    safe_traceback = (traceback or "").strip()[:MAX_TRACEBACK_LENGTH]

    try:
        tokenizer = get_tokenizer()

        # Build prompt using native ChatML template
        prompt = build_prompt(
            tokenizer=tokenizer,
            code=safe_code,
            error_type=safe_error_type,
            error_message=safe_error_msg,
            traceback=safe_traceback,
            line=line,
        )

        # Run inference via @spaces.GPU
        raw_text = str(
            _gpu_generate_tokens(
                prompt=prompt,
                max_new_tokens=max_new_tokens,
                temperature=temperature,
            )
        ).strip()

        latency_ms = int((time.perf_counter() - start_time) * 1000)

        # Direct model output as explanation, without artificial headings
        cleaned_explanation = raw_text

        # Extract synthesized repaired code from model output
        repaired_code = extract_repaired_code(raw_text, safe_code)

        # Use robust parser for structured fallback fields
        parsed = parse_model_output(
            raw_text=raw_text,
            error_type=safe_error_type,
            error_message=safe_error_msg,
            line=line,
        )
        what_happened = parsed["what_happened"]
        why_it_happened = parsed["why_it_happened"]
        suggested_fix = parsed.get("suggested_fix", "")

        return {
            "error_type": safe_error_type,
            "what_happened": what_happened,
            "why_it_happened": why_it_happened,
            "suggested_fix": suggested_fix,
            "repaired_code": repaired_code,
            "confidence": 1.0,
            "explanation": cleaned_explanation,
            "latency_ms": latency_ms,
            "provider": "Bug Whisper Qwen 2.5 Coder 3B (4-bit)",
            # Aliases for frontend backward compatibility
            "what": what_happened,
            "why": why_it_happened,
        }

    except Exception as exc:
        logger.exception("Inference failed: %s", exc)
        latency_ms = int((time.perf_counter() - start_time) * 1000)

        fallback_explanation = (
            f"{safe_error_type}: {safe_error_msg}.\n\n"
            "The Python interpreter encountered an unhandled exception during execution."
        )
        return {
            "error_type": safe_error_type,
            "what_happened": f"{safe_error_type}: {safe_error_msg}",
            "why_it_happened": "Execution failed due to an unhandled exception.",
            "suggested_fix": "Inspect the offending line and verify variables and types.",
            "repaired_code": None,
            "confidence": 0.5,
            "explanation": fallback_explanation,
            "latency_ms": latency_ms,
            "provider": "Bug Whisper (Fallback)",
            "what": f"{safe_error_type}: {safe_error_msg}",
            "why": "Execution failed due to an unhandled exception.",
            "warning": str(exc),
        }


def predict(
    code: str,
    error_type: str = "RuntimeError",
    error_message: str = "",
    traceback: str = "",
    line: Optional[int] = None,
    file: Optional[str] = "main.py",
    temperature: float = 0.0,
    max_new_tokens: int = 384,
) -> Dict[str, Any]:
    """Diagnose a Python execution failure and return structured diagnosis.

    Top-level prediction entrypoint satisfying Section 5 requirements.
    """
    return explain_error(
        code=code,
        error_type=error_type,
        error_message=error_message,
        traceback=traceback,
        line=line,
        file=file,
        temperature=temperature,
        max_new_tokens=max_new_tokens,
    )


def model_status() -> Dict[str, Any]:
    """Return model runtime and deployment status information."""
    is_loaded = _MODEL is not None and _TOKENIZER is not None
    device_name = str(next(_MODEL.parameters()).device) if is_loaded else "unloaded"

    return {
        "model_name": "bug-whisper-qwen25-coder-3b",
        "quantization": "4-bit NF4 (BitsAndBytes)",
        "loaded": is_loaded,
        "device": device_name,
        "spaces_available": SPACES_AVAILABLE,
        "cuda_available": torch.cuda.is_available(),
        "mps_available": torch.backends.mps.is_available() if hasattr(torch.backends, "mps") else False,
        "resolved_model_dir": str(_RESOLVED_MODEL_DIR) if _RESOLVED_MODEL_DIR else None,
    }


def unload_model() -> None:
    """Unload model from memory and release GPU/MPS caches if necessary."""
    global _MODEL, _TOKENIZER, _RESOLVED_MODEL_DIR

    with _MODEL_LOCK:
        _MODEL = None
        _TOKENIZER = None
        _RESOLVED_MODEL_DIR = None

        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        elif hasattr(torch, "mps") and hasattr(torch.mps, "empty_cache"):
            torch.mps.empty_cache()
        logger.info("Model unloaded from memory.")
