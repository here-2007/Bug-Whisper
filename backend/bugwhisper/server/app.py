"""
FastAPI Application Entry Point.
Configures CORS, registers API routers, and sets up lifecycle hooks.
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bugwhisper.server.config import settings
from bugwhisper.server.routes.execute import router as execute_router
from bugwhisper.server.routes.health import router as health_router
from bugwhisper.server.routes.kaggle import router as kaggle_router
from bugwhisper.server.routes.presets import router as presets_router
from bugwhisper.server.routes.repair import router as repair_router
from bugwhisper.server.routes.stream import router as stream_router
from bugwhisper.server.routes.synthesize import router as synthesize_router


def create_app() -> FastAPI:
    """Creates and configures the FastAPI application instance."""
    application = FastAPI(
        title="Bug Whisper Core API",
        description=(
            "Deterministic runtime execution, dual-mode traceback parsing, "
            "multi-tier inference, and two-stage verification."
        ),
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Allow CORS from configured origins
    cors_origins = [o.strip() for o in settings.cors_origins if o.strip()]
    application.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins if cors_origins else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API routers under /api
    application.include_router(health_router, prefix="/api")
    application.include_router(execute_router, prefix="/api")
    application.include_router(synthesize_router, prefix="/api")
    application.include_router(repair_router, prefix="/api")
    application.include_router(stream_router, prefix="/api")
    application.include_router(presets_router, prefix="/api")
    application.include_router(kaggle_router, prefix="/api")

    @application.get("/")
    async def root():
        return {
            "name": "Bug Whisper Core API",
            "version": "0.1.0",
            "docs": "/docs",
            "status": "online",
        }

    return application


app = create_app()
