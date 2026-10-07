"""
Server-Sent Events (SSE) Streaming Route.
Streams synthesized repair tokens asynchronously with low latency.
"""

from __future__ import annotations

import json
from typing import AsyncIterator
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from bugwhisper.server.routes.synthesize import _resolve_provider
from bugwhisper.server.schemas import SynthesizeRequest

router = APIRouter(tags=["Streaming"])


async def _sse_generator(request: SynthesizeRequest) -> AsyncIterator[str]:
    """Generates SSE token events from the inference provider."""
    provider = _resolve_provider(request.provider)
    try:
        async for chunk in provider.stream_fix(request.code, request.stderr):
            payload = json.dumps({"token": chunk})
            yield f"event: token\ndata: {payload}\n\n"
        yield "event: done\ndata: {}\n\n"
    except Exception as exc:
        err_payload = json.dumps({"error": str(exc)})
        yield f"event: error\ndata: {err_payload}\n\n"


@router.post("/repair/stream")
async def stream_repair(request: SynthesizeRequest) -> StreamingResponse:
    """Streams synthesized code repair tokens via Server-Sent Events."""
    return StreamingResponse(
        _sse_generator(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream",
        },
    )
