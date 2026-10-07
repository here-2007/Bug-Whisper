"""
Unit and integration tests for FastAPI endpoints.
"""

from fastapi.testclient import TestClient
from bugwhisper.server.app import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "heuristic" in data["available_providers"]


def test_execute_endpoint_success():
    payload = {"code": "print('hello from sandbox')", "timeout_seconds": 2.0}
    response = client.post("/api/execute", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "hello from sandbox" in data["stdout"]
    assert not data["analysis"]["has_error"]


def test_execute_endpoint_syntax_error():
    payload = {"code": "def bad_func(\n", "timeout_seconds": 2.0}
    response = client.post("/api/execute", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert data["analysis"]["has_error"] is True
    assert data["analysis"]["is_syntax_error"] is True


def test_synthesize_endpoint():
    payload = {
        "code": "def div(a, b):\n    return a / b\n",
        "stderr": 'File "main.py", line 2, in div\nZeroDivisionError: division by zero',
        "provider": "heuristic",
    }
    response = client.post("/api/synthesize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "b != 0" in data["fixed_code"]


def test_repair_endpoint_end_to_end():
    payload = {
        "code": "def div(a, b):\n    return a / b\n\nprint(div(10, 0))\n",
        "provider": "heuristic",
        "dynamic_verify": True,
    }
    response = client.post("/api/repair", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["diff"]["has_changes"] is True
    assert data["verification"]["status"] == "VERIFIED"
    assert data["provider_name"] == "heuristic"


def test_presets_endpoints():
    res = client.get("/api/presets")
    assert res.status_code == 200
    presets = res.json()
    assert len(presets) >= 4
    first_id = presets[0]["id"]

    res_single = client.get(f"/api/presets/{first_id}")
    assert res_single.status_code == 200
    assert res_single.json()["id"] == first_id

    res_missing = client.get("/api/presets/non-existent-preset")
    assert res_missing.status_code == 404


def test_stream_repair_endpoint():
    payload = {
        "code": "def func(): pass\n",
        "stderr": "",
        "provider": "heuristic",
    }
    response = client.post("/api/repair/stream", json=payload)
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
    content = response.text
    assert "event: token" in content
    assert "event: done" in content
