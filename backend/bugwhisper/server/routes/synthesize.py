"""
Inference Synthesis Route.
Directly synthesizes code remediation from source code and error traceback.
"""

from __future__ import annotations

from fastapi import APIRouter
from bugwhisper.inference.heuristic_provider import HeuristicProvider
from bugwhisper.inference.manager import get_default_inference_manager
from bugwhisper.inference.ollama_provider import OllamaProvider
from bugwhisper.inference.openai_provider import OpenAIProvider
from bugwhisper.server.schemas import SynthesizeRequest, SynthesizeResponse

router = APIRouter(tags=["Synthesis"])


def _resolve_provider(provider_name: str | None):
    if provider_name == "heuristic":
        return HeuristicProvider()
    if provider_name == "ollama":
        return OllamaProvider()
    if provider_name == "openai":
        return OpenAIProvider()
    return get_default_inference_manager()


@router.post("/synthesize", response_model=SynthesizeResponse)
async def synthesize_fix(request: SynthesizeRequest) -> SynthesizeResponse:
    """Synthesizes code fix using the requested or default provider."""
    provider = _resolve_provider(request.provider)
    res = await provider.generate_fix(request.code, request.stderr)

    return SynthesizeResponse(
        fixed_code=res.fixed_code,
        latency_ms=res.latency_ms,
        provider_name=res.provider_name,
        model_name=res.model_name,
        success=res.success,
    )
