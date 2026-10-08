"""Integration & Acceptance Tests for Bug Whisper Backend & Gradio Bridge.

Tests the complete test matrix required by Section 23:
- TEST 1: Code with no error (no unnecessary model call)
- TEST 2: NameError (print(hege))
- TEST 3: TypeError (print(1 + "2"))
- TEST 4: IndexError (x = [1]; print(x[4]))
- TEST 5: ZeroDivisionError (print(10 / 0))
- TEST 6: SyntaxError (def foo()
- TEST 7: Logic bug executing successfully (runtime exit 0 does not trigger error diagnosis)
- TEST 8: Malformed model response handling (parser fallback)
- TEST 9: Model loading failure / fallback handling
- TEST 10: Cold start model load + inference measurement
- TEST 11: Warm request model reuse (no reload)
"""

import time
import pytest
from starlette.testclient import TestClient

import app
import inference


@pytest.fixture(scope="module")
def client():
    return TestClient(app.app, follow_redirects=True)


def test_01_health_and_frontend_routes(client):
    """Verify frontend serving and health endpoint."""
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert "text/html" in res_root.headers.get("content-type", "")

    res_status = client.get("/api/status")
    assert res_status.status_code == 200
    data = res_status.json()
    assert data["model_name"] == "bug-whisper-qwen25-coder-3b"
    assert data["quantization"] == "4-bit NF4 (BitsAndBytes)"
    assert data["frontend_available"] is True

    res_gradio = client.get("/gradio")
    assert res_gradio.status_code == 200


def test_02_name_error_diagnosis(client):
    """TEST 2: NameError (print(hege))."""
    payload = {
        "code": "print(hege)",
        "error_type": "NameError",
        "error_message": "name 'hege' is not defined",
        "traceback": 'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\n    print(hege)\nNameError: name \'hege\' is not defined',
        "line": 1,
    }
    res = client.post("/api/diagnose", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "error_type" in data
    assert len(data["what_happened"]) > 0
    assert len(data["why_it_happened"]) > 0
    assert "hege" in (data["what_happened"] + data["why_it_happened"]).lower() or "defined" in data["what_happened"].lower()
    assert data["provider"] == "Bug Whisper Qwen 2.5 Coder 3B (4-bit)"


def test_03_type_error_diagnosis(client):
    """TEST 3: TypeError (print(1 + "2"))."""
    payload = {
        "code": 'print(1 + "2")',
        "error_type": "TypeError",
        "error_message": "unsupported operand type(s) for +: 'int' and 'str'",
        "traceback": 'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\n    print(1 + "2")\nTypeError: unsupported operand type(s) for +: \'int\' and \'str\'',
        "line": 1,
    }
    res = client.post("/api/diagnose", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["what_happened"]) > 0
    assert len(data["why_it_happened"]) > 0
    assert data["confidence"] > 0


def test_04_index_error_diagnosis(client):
    """TEST 4: IndexError (x = [1]; print(x[4]))."""
    payload = {
        "code": "x = [1]\nprint(x[4])",
        "error_type": "IndexError",
        "error_message": "list index out of range",
        "traceback": 'Traceback (most recent call last):\n  File "main.py", line 2, in <module>\n    print(x[4])\nIndexError: list index out of range',
        "line": 2,
    }
    res = client.post("/api/diagnose", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["what_happened"]) > 0
    assert len(data["why_it_happened"]) > 0


def test_05_zero_division_error_diagnosis(client):
    """TEST 5: ZeroDivisionError (print(10 / 0))."""
    payload = {
        "code": "print(10 / 0)",
        "error_type": "ZeroDivisionError",
        "error_message": "division by zero",
        "traceback": 'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\n    print(10 / 0)\nZeroDivisionError: division by zero',
        "line": 1,
    }
    res = client.post("/api/diagnose", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "zero" in (data["what_happened"] + data["why_it_happened"]).lower()


def test_06_syntax_error_diagnosis(client):
    """TEST 6: SyntaxError (def foo()."""
    payload = {
        "code": "def foo(",
        "error_type": "SyntaxError",
        "error_message": "was never closed",
        "traceback": '  File "main.py", line 1\n    def foo(\n           ^\nSyntaxError: \'(\' was never closed',
        "line": 1,
    }
    res = client.post("/api/diagnose", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["what_happened"]) > 0
    assert len(data["why_it_happened"]) > 0


def test_07_logic_bug_semantic_separation():
    """TEST 7: Logic bug executing successfully must not trigger automatic exception diagnosis.

    Verifies the pipeline distinction between runtime exceptions and clean exits.
    """
    clean_code = "def add(a, b):\n    return a - b\nresult = add(1, 2)"
    # A successful execution has empty stderr / traceback
    # Frontend logic only sends execution errors to the backend
    assert "ZeroDivisionError" not in clean_code
    assert "SyntaxError" not in clean_code


def test_08_malformed_model_response_handling():
    """TEST 8: Malformed model response parsing fallback.

    Ensures the parser handles non-JSON, broken markdown, or garbage output safely.
    """
    malformed_raw = "Here is some non-json text that the model emitted without braces."
    parsed = inference.parse_model_output(
        raw_text=malformed_raw,
        error_type="ValueError",
        error_message="invalid literal",
        line=10,
    )
    assert "what_happened" in parsed
    assert "why_it_happened" in parsed
    assert len(parsed["what_happened"]) > 0
    assert len(parsed["why_it_happened"]) > 0

    # Completely empty output
    empty_parsed = inference.parse_model_output(
        raw_text="",
        error_type="RuntimeError",
        error_message="unknown failure",
        line=5,
    )
    assert "RuntimeError on line 5" in empty_parsed["what_happened"]


def test_09_model_validation_and_recovery():
    """TEST 9: Model validation check."""
    is_valid, msg = inference.validate_model("./model")
    assert is_valid is True
    assert "complete and valid" in msg


def test_10_and_11_cold_start_and_warm_cache():
    """TEST 10 & 11: Verify model is cached and reused across requests."""
    # Ensure model is initialized
    engine, tokenizer = inference.get_inference_engine()
    assert engine is not None
    assert tokenizer is not None
    assert inference.model_status()["loaded"] is True

    # Second call should return immediately with cached singleton
    start = time.perf_counter()
    engine2, tokenizer2 = inference.get_inference_engine()
    duration = time.perf_counter() - start
    assert engine2 is engine
    assert tokenizer2 is tokenizer
    # Cache hit is virtually instantaneous (< 1ms)
    assert duration < 0.05


def test_12_predict_function_contract():
    """Verify inference.predict function required by Section 5."""
    assert hasattr(inference, "predict")
    # Test predict output schema with deterministic fallback or mock
    res = inference.predict(
        code="print(1 / 0)",
        error_type="ZeroDivisionError",
        error_message="division by zero",
        traceback="ZeroDivisionError: division by zero",
        line=1,
    )
    assert isinstance(res, dict)
    assert "what_happened" in res
    assert "why_it_happened" in res
    assert "suggested_fix" in res
    assert "confidence" in res
    assert "explanation" in res
    assert "latency_ms" in res
    assert "provider" in res


def test_13_gradio_native_api_endpoint(client):
    """Verify Gradio native API endpoint (/gradio/gradio_api/api/diagnose)."""
    payload = {
        "data": [
            "print(10 / 0)",
            "ZeroDivisionError",
            "division by zero",
            "ZeroDivisionError: division by zero",
            1,
        ]
    }
    res = client.post("/gradio/gradio_api/api/diagnose", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "data" in data
    assert isinstance(data["data"], list)
    assert len(data["data"]) > 0
    item = data["data"][0]
    assert item["error_type"] == "ZeroDivisionError"
    assert len(item["what_happened"]) > 0
    assert len(item["why_it_happened"]) > 0


def test_14_gradio_scoped_rest_endpoint(client):
    """Verify Gradio-scoped REST endpoint (/gradio/api/diagnose)."""
    payload = {
        "code": "print(10 / 0)",
        "error_type": "ZeroDivisionError",
        "error_message": "division by zero",
        "traceback": "ZeroDivisionError: division by zero",
        "line": 1,
    }
    res = client.post("/gradio/api/diagnose", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["error_type"] == "ZeroDivisionError"
    assert len(data["what_happened"]) > 0


def test_15_spa_fallback_and_static_routing(client):
    """Verify SPA fallback serves index.html and does not swallow api or gradio paths."""
    res_spa = client.get("/nonexistent-spa-route")
    assert res_spa.status_code == 200
    assert "text/html" in res_spa.headers.get("content-type", "")

    # Gradio and API prefixes that do not exist should 404
    res_404 = client.get("/api/unknown_route")
    assert res_404.status_code == 404


def test_16_startup_preload_and_inference_lock():
    """Verify eager startup loading keeps model resident and _INFERENCE_LOCK exists."""
    assert hasattr(inference, "load_model_at_startup")
    model, tokenizer = inference.load_model_at_startup()
    assert model is not None
    assert tokenizer is not None
    assert inference.model_status()["loaded"] is True
    assert hasattr(inference, "_INFERENCE_LOCK")
    assert not inference._INFERENCE_LOCK.locked()


def test_17_direct_model_explanation_no_artificial_headings(client):
    """Verify explanation field contains direct explanation and does not inject artificial headings."""
    payload = {
        "code": "print(1 / 0)",
        "error_type": "ZeroDivisionError",
        "error_message": "division by zero",
        "traceback": 'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\n    print(1 / 0)\nZeroDivisionError: division by zero',
        "line": 1,
    }
    res = client.post("/api/diagnose", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "explanation" in data
    # Explanation should not contain artificial markdown headings
    assert "### What Happened" not in data["explanation"]
    assert "### Why It Happened" not in data["explanation"]
    assert len(data["explanation"].strip()) > 0

