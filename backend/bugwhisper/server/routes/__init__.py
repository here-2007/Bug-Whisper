"""
Bug Whisper API Route Handlers.
"""

from .execute import router as execute_router
from .health import router as health_router
from .presets import router as presets_router
from .repair import router as repair_router
from .stream import router as stream_router
from .synthesize import router as synthesize_router

__all__ = [
    "health_router",
    "execute_router",
    "synthesize_router",
    "repair_router",
    "stream_router",
    "presets_router",
]
