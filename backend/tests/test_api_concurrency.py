"""
API Concurrency and Load Stress Tests.
Tests parallel executions, clean-code short circuits, and input validation resilience.
"""

import asyncio
import pytest
from httpx import AsyncClient, ASGITransport
from bugwhisper.server.app import app


@pytest.mark.asyncio
async def test_clean_code_short_circuit():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        payload = {
            "code": "def greet():\n    return 'hello'\nprint(greet())\n",
            "provider": "heuristic",
        }
        res = await ac.post("/api/repair", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert not data["diff"]["has_changes"]
        assert data["verification"]["status"] == "VERIFIED"
        assert data["provider_name"] == "deterministic"


@pytest.mark.asyncio
async def test_concurrent_executions():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        async def run_single(idx: int):
            return await ac.post("/api/execute", json={"code": f"print('task {idx}')", "timeout_seconds": 2.0})

        # Run 5 tasks in parallel
        tasks = [run_single(i) for i in range(5)]
        responses = await asyncio.gather(*tasks)

        for i, res in enumerate(responses):
            assert res.status_code == 200
            data = res.json()
            assert data["success"]
            assert f"task {i}" in data["stdout"]


@pytest.mark.asyncio
async def test_concurrent_repairs():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        test_cases = [
            {"code": "def div(a, b): return a / b\nprint(div(1, 0))\n", "provider": "heuristic"},
            {"code": "def f(): pass\nprint('all good')\n", "provider": "heuristic"},
            {"code": "x = []\nprint(x[0])\n", "provider": "heuristic"},
        ]

        tasks = [ac.post("/api/repair", json=tc) for tc in test_cases]
        responses = await asyncio.gather(*tasks)

        for res in responses:
            assert res.status_code == 200
            data = res.json()
            assert "verification" in data
            assert data["verification"]["is_valid_syntax"]


@pytest.mark.asyncio
async def test_malformed_json_validation():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Missing required 'code' field
        res = await ac.post("/api/execute", json={"timeout_seconds": 2.0})
        assert res.status_code == 422
