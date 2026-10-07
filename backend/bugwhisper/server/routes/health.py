"""
Health and Diagnostic Route.
"""

from __future__ import annotations

import sys
from fastapi import APIRouter
from bugwhisper.server.schemas import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def check_health() -> HealthResponse:
    """Returns runtime health status and active capabilities."""
    return HealthResponse(
        status="healthy",
        version="0.1.0",
        python_version=sys.version.split()[0],
        available_providers=["heuristic", "ollama", "openai"],
    )
