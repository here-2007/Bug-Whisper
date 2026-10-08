"""
Kaggle Model & Inference API Routes.
Provides status, download trigger, and inference using fine-tuned weights via kagglehub.
"""

from __future__ import annotations

import logging
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from bugwhisper.inference.kaggle_provider import KaggleProvider, DEFAULT_KAGGLE_HANDLE

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/kaggle", tags=["Kaggle Models"])


class KaggleDownloadRequest(BaseModel):
    handle: Optional[str] = DEFAULT_KAGGLE_HANDLE
    force: bool = False


class KaggleInferRequest(BaseModel):
    code: str
    stderr: str = ""
    handle: Optional[str] = DEFAULT_KAGGLE_HANDLE


@router.get("/status")
async def get_kaggle_status():
    """Checks whether kagglehub is installed and whether the model is cached locally."""
    try:
        import kagglehub  # noqa: F401
        has_library = True
    except ImportError:
        has_library = False

    provider = KaggleProvider()
    downloaded = provider.is_model_downloaded() if has_library else False

    return {
        "library_installed": has_library,
        "default_handle": DEFAULT_KAGGLE_HANDLE,
        "is_cached": downloaded,
        "cached_path": provider._cached_path if downloaded else None,
        "status": "ready" if downloaded else ("library_available" if has_library else "library_missing"),
    }


@router.post("/download")
async def download_kaggle_model(req: KaggleDownloadRequest):
    """Downloads fine-tuned weights from Kaggle Hub to local machine cache."""
    try:
        provider = KaggleProvider(model_handle=req.handle)
        path = provider.get_model_path(force_download=req.force)
        return {
            "success": True,
            "handle": req.handle,
            "local_path": path,
            "message": "Model weights downloaded and cached successfully.",
        }
    except Exception as exc:
        logger.error("Failed to download Kaggle model: %s", exc)
        raise HTTPException(status_code=500, detail=f"Kaggle download failed: {exc}")


@router.post("/infer")
async def infer_with_kaggle(req: KaggleInferRequest):
    """Generates remediation using the Kaggle model."""
    provider = KaggleProvider(model_handle=req.handle)
    res = await provider.generate_fix(req.code, req.stderr)
    return {
        "fixed_code": res.fixed_code,
        "latency_ms": res.latency_ms,
        "provider_name": res.provider_name,
        "model_name": res.model_name,
        "success": res.success,
        "error": res.error,
    }
