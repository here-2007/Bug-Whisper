"""
Server Configuration and Environment Settings.
"""

from __future__ import annotations

import os
from typing import List
from pydantic import BaseModel, Field


class Settings(BaseModel):
    """Bug Whisper server runtime configuration."""
    host: str = Field(default_factory=lambda: os.getenv("BUGWHISPER_HOST", "127.0.0.1"))
    port: int = Field(default_factory=lambda: int(os.getenv("BUGWHISPER_PORT", "8000")))
    cors_origins: List[str] = Field(
        default_factory=lambda: os.getenv(
            "BUGWHISPER_CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000",
        ).split(",")
    )
    ollama_url: str = Field(
        default_factory=lambda: os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    )
    ollama_model: str = Field(
        default_factory=lambda: os.getenv("OLLAMA_MODEL", "qwen2.5-coder:3b")
    )
    openai_base_url: str = Field(
        default_factory=lambda: os.getenv("OPENAI_BASE_URL", "http://localhost:8000/v1")
    )
    openai_api_key: str = Field(
        default_factory=lambda: os.getenv("OPENAI_API_KEY", "")
    )
    openai_model: str = Field(
        default_factory=lambda: os.getenv("OPENAI_MODEL", "bug-whisper-qwen25-coder-3b")
    )
    default_timeout: float = Field(
        default_factory=lambda: float(os.getenv("BUGWHISPER_TIMEOUT", "3.0"))
    )


settings = Settings()
