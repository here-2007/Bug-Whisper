"""
Presets Route.
Provides curated Python bug snippets for interactive testing and demonstration.
"""

from __future__ import annotations

from typing import List
from fastapi import APIRouter, HTTPException
from bugwhisper.server.schemas import PresetItem

router = APIRouter(tags=["Presets"])

PRESETS: List[PresetItem] = [
    PresetItem(
        id="zero-division",
        title="ZeroDivisionError in Batch Metrics",
        category="Runtime Exception",
        code=(
            "def calculate_average(scores: list[int]) -> float:\n"
            "    total = sum(scores)\n"
            "    return total / len(scores)\n\n"
            "print(calculate_average([]))\n"
        ),
        description="Empty collection passed to division without empty-check guard.",
    ),
    PresetItem(
        id="syntax-missing-colon",
        title="SyntaxError: Missing Colon",
        category="Syntax Error",
        code=(
            "def validate_user(username: str, age: int)\n"
            "    if age < 18\n"
            "        return False\n"
            "    return True\n"
        ),
        description="Compile-time syntax errors preventing bytecode generation.",
    ),
    PresetItem(
        id="type-concatenation",
        title="TypeError: Str and Int Concatenation",
        category="Type Mismatch",
        code=(
            "def format_summary(item_name: str, count: int) -> str:\n"
            "    return \"Item: \" + item_name + \", Quantity: \" + count\n\n"
            "print(format_summary(\"Widget\", 42))\n"
        ),
        description="Implicit type conversion failure during string concatenation.",
    ),
    PresetItem(
        id="index-out-of-bounds",
        title="IndexError: Array Bounds Exceeded",
        category="Bounds Exception",
        code=(
            "def get_primary_tag(tags: list[str]) -> str:\n"
            "    return tags[0]\n\n"
            "print(get_primary_tag([]))\n"
        ),
        description="Direct list index access without boundary verification.",
    ),
]


@router.get("/presets", response_model=List[PresetItem])
async def list_presets() -> List[PresetItem]:
    """Returns list of curated bug presets."""
    return PRESETS


@router.get("/presets/{preset_id}", response_model=PresetItem)
async def get_preset(preset_id: str) -> PresetItem:
    """Returns a specific preset by ID."""
    for p in PRESETS:
        if p.id == preset_id:
            return p
    raise HTTPException(status_code=404, detail=f"Preset '{preset_id}' not found.")
