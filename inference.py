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

# Global model state & singleton lock
_MODEL = None
_TOKENIZER = None
_RESOLVED_MODEL_DIR: Optional[Path] = None
_MODEL_LOCK = threading.Lock()

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

    # Check if target_dir is already valid
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
        torch_dtype=torch.bfloat16 if torch.cuda.is_available() else None,
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


def get_model() -> AutoModelForCausalLM:
    """Return the cached model instance."""
    model, _ = get_inference_engine()
    return model


@spaces.GPU(duration=60)
def _gpu_generate_tokens(
    prompt: Optional[str] = None,
    max_new_tokens: int = 384,
    temperature: float = 0.0,
    model: Optional[AutoModelForCausalLM] = None,
    input_ids: Optional[torch.Tensor] = None,
    attention_mask: Optional[torch.Tensor] = None,
) -> Union[str, torch.Tensor]:
    """Run model generation inside Hugging Face Spaces GPU allocation context.

    On Spaces ZeroGPU, the GPU is only dynamically attached within this function.
    Supports both direct prompt string inference and raw tensor inputs.
    """
    if prompt is not None:
        active_model, active_tokenizer = get_inference_engine()
        device = next(active_model.parameters()).device
        inputs = active_tokenizer(prompt, return_tensors="pt")
        active_input_ids = inputs["input_ids"].to(device)
        active_mask = inputs.get("attention_mask", torch.ones_like(active_input_ids)).to(device)

        with torch.no_grad():
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
        with torch.no_grad():
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
    error_type: str,
    error_message: str,
    traceback: str,
    line: Optional[int] = None,
) -> str:
    """Format prompt using the model's own ChatML chat template."""
    clean_code = code[:MAX_CODE_LENGTH]
    clean_tb = traceback[:MAX_TRACEBACK_LENGTH]
    clean_msg = error_message[:MAX_ERROR_MSG_LENGTH]
    line_str = str(line) if line is not None else "Unknown"

    system_content = (
        "You are Bug Whisper, an expert Python debugging assistant.\n"
        "Analyze the Python runtime or syntax execution error.\n"
        "Respond in strictly valid JSON format with three concise fields:\n"
        '- "what_happened": a 1-2 sentence description of what failed and where\n'
        '- "why_it_happened": a 1-2 sentence explanation of the root cause in Python\n'
        '- "suggested_fix": a concise description of how to resolve the error'
    )

    user_content = (
        f"Analyze this Python execution error:\n\n"
        f"SOURCE CODE:\n```python\n{clean_code}\n```\n\n"
        f"ERROR TYPE:\n{error_type}\n\n"
        f"ERROR MESSAGE:\n{clean_msg}\n\n"
        f"TRACEBACK:\n```\n{clean_tb}\n```\n\n"
        f"LINE: {line_str}\n"
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
    """Robustly parse structured diagnosis from model response text.

    Tries:
    1. Direct json.loads or extracted ```json markdown block
    2. Regex pattern extraction for what_happened / why_it_happened / suggested_fix
    3. Markdown heading extraction (### What Happened, etc.)
    4. Deterministic fallback to ensure valid output
    """
    cleaned = raw_text.strip()

    # Attempt 1: Extract JSON from markdown fence or raw text
    json_candidates = []

    # Check for ```json ... ``` or ``` ... ```
    fence_match = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", cleaned)
    if fence_match:
        json_candidates.append(fence_match.group(1).strip())

    # Check for direct top-level JSON object
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

    # Attempt 2: Heading-based extraction (### What Happened / ### Why It Happened)
    what_match = re.search(
        r"(?:###\s*What Happened|What Happened:?)\s*\n*([\s\S]*?)(?=(?:###\s*Why It Happened|Why It Happened:?|$))",
        cleaned,
        re.IGNORECASE,
    )
    why_match = re.search(
        r"(?:###\s*Why It Happened|Why It Happened:?)\s*\n*([\s\S]*?)(?=(?:###\s*Suggested Fix|How to Fix:?|Suggested Fix:?|$))",
        cleaned,
        re.IGNORECASE,
    )
    fix_match = re.search(
        r"(?:###\s*Suggested Fix|How to Fix:?|Suggested Fix:?)\s*\n*([\s\S]*?)$",
        cleaned,
        re.IGNORECASE,
    )

    what_text = what_match.group(1).strip() if what_match else ""
    why_text = why_match.group(1).strip() if why_match else ""
    fix_text = fix_match.group(1).strip() if fix_match else ""

    if what_text or why_text:
        return {
            "what_happened": what_text or f"{error_type}: {error_message}",
            "why_it_happened": why_text or "The Python interpreter encountered an unhandled exception.",
            "suggested_fix": fix_text,
        }

    # Attempt 3: If non-empty conversational text, use first paragraphs
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

    # Fallback: Deterministic semantic explanation
    line_suffix = f" on line {line}" if line else ""
    return {
        "what_happened": f"{error_type}{line_suffix}: {error_message}",
        "why_it_happened": f"Python raised a {error_type} during bytecode execution.",
        "suggested_fix": "Inspect the offending line and verify variables and types.",
    }


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
        raw_text = _gpu_generate_tokens(
            prompt=prompt,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
        )

        parsed = parse_model_output(
            raw_text=raw_text,
            error_type=safe_error_type,
            error_message=safe_error_msg,
            line=line,
        )

        latency_ms = int((time.perf_counter() - start_time) * 1000)

        what_happened = parsed["what_happened"]
        why_it_happened = parsed["why_it_happened"]
        suggested_fix = parsed.get("suggested_fix", "")

        # Format unified explanation markdown string
        explanation_md = f"### What Happened\n{what_happened}\n\n### Why It Happened\n{why_it_happened}"
        if suggested_fix:
            explanation_md += f"\n\n### How to Fix\n{suggested_fix}"

        return {
            "error_type": safe_error_type,
            "what_happened": what_happened,
            "why_it_happened": why_it_happened,
            "suggested_fix": suggested_fix,
            "confidence": 1.0,
            "explanation": explanation_md,
            "latency_ms": latency_ms,
            "provider": "Bug Whisper Qwen 2.5 Coder 3B (4-bit)",
            # Aliases for frontend backward compatibility
            "what": what_happened,
            "why": why_it_happened,
        }

    except Exception as exc:
        logger.exception("Inference failed: %s", exc)
        latency_ms = int((time.perf_counter() - start_time) * 1000)

        fallback_what = f"{safe_error_type}: {safe_error_msg}"
        fallback_why = "Execution failed. The Python runtime halted due to an unhandled exception."
        return {
            "error_type": safe_error_type,
            "what_happened": fallback_what,
            "why_it_happened": fallback_why,
            "suggested_fix": "Check the traceback and verify variable initialization and syntax.",
            "confidence": 0.5,
            "explanation": f"### What Happened\n{fallback_what}\n\n### Why It Happened\n{fallback_why}",
            "latency_ms": latency_ms,
            "provider": "Bug Whisper (Fallback)",
            "what": fallback_what,
            "why": fallback_why,
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
