"""Bug Whisper Web Server & Gradio Bridge.

Serves the existing React/TypeScript frontend (Vite compiled dist) while bridging
Python execution error diagnostics to inference.py powered by the 4-bit
Qwen 2.5 Coder 3B model under @spaces.GPU.
"""

from __future__ import annotations

# Hugging Face Spaces ZeroGPU decorator support (must precede CUDA/torch imports)
try:
    import spaces  # type: ignore

    SPACES_AVAILABLE = True
except ImportError:
    SPACES_AVAILABLE = False

    class _MockSpaces:
        @staticmethod
        def GPU(func=None, duration=None):  # noqa: N802
            if func is None:

                def decorator(f):
                    return f

                return decorator
            return func

    spaces = _MockSpaces()  # type: ignore

import logging
import os
import subprocess
import mimetypes

# Disable Gradio Node.js SSR proxy so Python binds directly to port 7860
os.environ["GRADIO_SSR_MODE"] = "False"
from pathlib import Path
from typing import Any, Dict, Optional

import gradio as gr
from fastapi import HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from starlette.routing import Mount, Route

import inference

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("bugwhisper.app")

BASE_DIR = Path(__file__).parent.resolve()
DIST_DIR = BASE_DIR / "dist"


# ---------------------------------------------------------------------------
# ZeroGPU Scanner Probe Function
# ---------------------------------------------------------------------------
@spaces.GPU
def _zerogpu_probe() -> bool:
    """Startup probe function detected by Hugging Face ZeroGPU platform scanner."""
    return True


# ---------------------------------------------------------------------------
# Frontend Build Verification
# ---------------------------------------------------------------------------
def ensure_frontend_built() -> bool:
    """Ensure that the Vite React frontend is compiled to dist/."""
    index_html = DIST_DIR / "index.html"
    if index_html.is_file():
        logger.info("Found compiled React frontend at: %s", DIST_DIR)
        return True

    logger.warning("Compiled frontend not found at %s. Attempting build...", DIST_DIR)
    try:
        cmd = ["npm", "run", "build"]
        result = subprocess.run(cmd, cwd=str(BASE_DIR), capture_output=True, text=True, timeout=120)
        if result.returncode == 0 and index_html.is_file():
            logger.info("Frontend build succeeded: %s", DIST_DIR)
            return True
        logger.error("Frontend build failed: %s\n%s", result.stdout, result.stderr)
    except Exception as exc:
        logger.error("Unable to execute 'npm run build': %s", exc)

    return False


# ---------------------------------------------------------------------------
# Pydantic Schemas for Structured Contracts
# ---------------------------------------------------------------------------
class DiagnosisRequest(BaseModel):
    code: str = Field(..., max_length=inference.MAX_CODE_LENGTH)
    error_type: Optional[str] = Field("RuntimeError", max_length=100)
    error_message: Optional[str] = Field("", max_length=inference.MAX_ERROR_MSG_LENGTH)
    traceback: Optional[str] = Field("", max_length=inference.MAX_TRACEBACK_LENGTH)
    file: Optional[str] = Field("main.py", max_length=255)
    line: Optional[int] = None
    column: Optional[int] = None
    function_name: Optional[str] = None
    surrounding_code: Optional[str] = None
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    execution_time: Optional[float] = None


class LegacyExplainRequest(BaseModel):
    code: str = Field(..., max_length=inference.MAX_CODE_LENGTH)
    stderr: Optional[str] = Field("", max_length=inference.MAX_TRACEBACK_LENGTH)
    error_type: Optional[str] = Field(None, max_length=100)
    line_number: Optional[int] = None
    traceback: Optional[str] = Field(None, max_length=inference.MAX_TRACEBACK_LENGTH)


class DiagnosisResponse(BaseModel):
    error_type: str
    what_happened: str
    why_it_happened: str
    suggested_fix: str
    repaired_code: Optional[str] = None
    confidence: float
    explanation: str
    latency_ms: int
    provider: str
    what: str
    why: str
    warning: Optional[str] = None


# ---------------------------------------------------------------------------
# ZeroGPU Model Inference Handler
# ---------------------------------------------------------------------------
@spaces.GPU(duration=60)
def gradio_diagnose(
    code: str,
    error_type: str,
    error_message: str,
    traceback: str,
    line: float,
) -> Dict[str, Any]:
    """ZeroGPU handler exposing structured diagnosis via Gradio & REST contracts."""
    resolved_line = int(line) if line and line > 0 else None
    return inference.explain_error(
        code=code,
        error_type=error_type or "RuntimeError",
        error_message=error_message or "",
        traceback=traceback or "",
        line=resolved_line,
    )


# ---------------------------------------------------------------------------
# Gradio Blocks Interface (The Model Bridge)
# ---------------------------------------------------------------------------
with gr.Blocks(title="Bug Whisper Bridge") as demo:
    gr.Markdown("# Bug Whisper: Model Inference Bridge")
    gr.Markdown("ZeroGPU bridge hosting Qwen 2.5 Coder 3B 4-bit weights behind the React workbench.")

    with gr.Row():
        gr_code = gr.Textbox(label="Python Source Code", lines=6, placeholder="print(1 / 0)")
        with gr.Column():
            gr_type = gr.Textbox(label="Error Type", value="ZeroDivisionError")
            gr_msg = gr.Textbox(label="Error Message", value="division by zero")
            gr_line = gr.Number(label="Line Number", value=1)
            gr_tb = gr.Textbox(label="Traceback", lines=3, placeholder="Traceback...")

    gr_btn = gr.Button("Diagnose Error", variant="primary")
    gr_out = gr.JSON(label="Structured Diagnosis Result")

    gr_btn.click(
        fn=gradio_diagnose,
        inputs=[gr_code, gr_type, gr_msg, gr_tb, gr_line],
        outputs=gr_out,
        api_name="diagnose",
    )


# Add CORS Middleware to demo.app
demo.app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Resilient Fallback Helper
# ---------------------------------------------------------------------------
def make_fallback_diagnosis(
    error_type: str,
    error_message: str,
    traceback: str,
    reason: str,
    warning: Optional[str] = None,
) -> Dict[str, Any]:
    """Construct a strictly-typed fallback diagnosis adhering to DiagnosisResponse contract."""
    safe_type = (error_type or "RuntimeError").strip()[:100]
    safe_msg = (error_message or "An unhandled exception occurred").strip()[:inference.MAX_ERROR_MSG_LENGTH]
    safe_tb = (traceback or "").strip()[:inference.MAX_TRACEBACK_LENGTH]

    fallback_explanation = (
        f"{safe_type}: {safe_msg}.\n\n"
        f"{reason}\n\n"
        f"Execution Traceback:\n{safe_tb[:400]}"
    )
    return {
        "error_type": safe_type,
        "what_happened": f"{safe_type}: {safe_msg}",
        "why_it_happened": reason,
        "suggested_fix": "Inspect the offending line in the editor or wait a moment for GPU quota to refresh.",
        "repaired_code": None,
        "confidence": 0.5,
        "explanation": fallback_explanation,
        "latency_ms": 60,
        "provider": "Bug Whisper (ZeroGPU Fallback)",
        "what": f"{safe_type}: {safe_msg}",
        "why": reason,
        "warning": warning or reason,
    }


# ---------------------------------------------------------------------------
# REST Endpoints Attached to demo.app
# ---------------------------------------------------------------------------
@demo.app.post("/api/diagnose", response_model=DiagnosisResponse)
def diagnose_error(req: DiagnosisRequest) -> Dict[str, Any]:
    """Structured error diagnosis endpoint called by the React Playground."""
    logger.info("Received /api/diagnose request for error_type=%s, line=%s", req.error_type, req.line)

    raw_traceback = req.traceback or req.stderr or ""
    raw_message = req.error_message or ""
    if not raw_message and raw_traceback:
        lines = [line.strip() for line in raw_traceback.splitlines() if line.strip()]
        if lines:
            raw_message = lines[-1]

    try:
        return gradio_diagnose(
            code=req.code,
            error_type=req.error_type or "RuntimeError",
            error_message=raw_message,
            traceback=raw_traceback,
            line=float(req.line or 1),
        )
    except Exception as exc:
        logger.warning("ZeroGPU diagnosis invocation raised: %s", exc)
        return make_fallback_diagnosis(
            error_type=req.error_type or "RuntimeError",
            error_message=raw_message,
            traceback=raw_traceback,
            reason="ZeroGPU quota temporarily exhausted or allocation unavailable.",
            warning=str(exc),
        )


@demo.app.post("/api/explain", response_model=DiagnosisResponse)
def explain_legacy(req: LegacyExplainRequest) -> Dict[str, Any]:
    """Backward-compatible endpoint matching existing frontend probe signature."""
    logger.info("Received /api/explain request for error_type=%s", req.error_type)
    raw_tb = req.traceback or req.stderr or ""
    raw_type = req.error_type or "RuntimeError"
    raw_msg = raw_tb.splitlines()[-1] if raw_tb else ""

    try:
        return gradio_diagnose(
            code=req.code,
            error_type=raw_type,
            error_message=raw_msg,
            traceback=raw_tb,
            line=float(req.line_number or 1),
        )
    except Exception as exc:
        logger.warning("ZeroGPU legacy explain invocation raised: %s", exc)
        return make_fallback_diagnosis(
            error_type=raw_type,
            error_message=raw_msg,
            traceback=raw_tb,
            reason="ZeroGPU quota temporarily exhausted or allocation unavailable.",
            warning=str(exc),
        )


@demo.app.get("/api/status")
@demo.app.get("/api/health")
def api_status() -> Dict[str, Any]:
    """Health and model status endpoint."""
    status = inference.model_status()
    status["frontend_available"] = (DIST_DIR / "index.html").is_file()
    status["status"] = "ready"
    return status


@demo.app.post("/gradio/api/diagnose", response_model=DiagnosisResponse)
def gradio_api_diagnose(req: DiagnosisRequest) -> Dict[str, Any]:
    """Mirror endpoint under /gradio/api/diagnose for Gradio-scoped clients."""
    return diagnose_error(req)


# Mount Gradio onto demo.app at /gradio so Gradio UI & API are fully initialized
app = gr.mount_gradio_app(demo.app, demo, path="/gradio")


# ---------------------------------------------------------------------------
# Static React Frontend Serving & Route Precedence
# ---------------------------------------------------------------------------
mimetypes.add_type("text/javascript", ".mjs")
mimetypes.add_type("text/javascript", ".js")
mimetypes.add_type("application/wasm", ".wasm")
mimetypes.add_type("application/zip", ".zip")
mimetypes.add_type("application/json", ".json")

frontend_ready = ensure_frontend_built()

if frontend_ready:
    assets_dir = DIST_DIR / "assets"
    if assets_dir.is_dir():
        app.router.routes.insert(0, Mount("/assets", StaticFiles(directory=str(assets_dir)), name="dist_assets"))

    pyodide_dir = DIST_DIR / "pyodide"
    if pyodide_dir.is_dir():
        app.router.routes.insert(0, Mount("/pyodide", StaticFiles(directory=str(pyodide_dir)), name="dist_pyodide"))

    app.router.routes.insert(0, Route("/", lambda req: FileResponse(DIST_DIR / "index.html"), methods=["GET", "HEAD"]))

    @app.get("/gradio")
    def redirect_to_gradio():
        """Redirect /gradio to trailing slash /gradio/ for Starlette mount."""
        return RedirectResponse(url="/gradio/", status_code=307)

    @app.get("/{filename:path}")
    def serve_static_or_spa(filename: str, request: Request):
        if filename.startswith(("api", "gradio", "gradio_api", "assets", "pyodide", "queue", "openapi", "docs")):
            raise HTTPException(status_code=404, detail="Not found")

        file_path = DIST_DIR / filename
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(DIST_DIR / "index.html")

else:
    logger.warning("Compiled frontend not available; serving placeholder on /.")

    @app.get("/", response_class=HTMLResponse)
    def serve_placeholder():
        return HTMLResponse(
            "<html><body style='font-family: monospace; padding: 2rem; background: #141414; color: #f6f6f6;'>"
            "<h1>Bug Whisper Backend Ready</h1>"
            "<p>Please build the frontend using <code>npm run build</code> to serve the React UI at root.</p>"
            "<p><a href='/gradio' style='color: #7bd88f;'>Open Gradio Bridge Interface</a></p>"
            "</body></html>"
        )


# ---------------------------------------------------------------------------
# ZeroGPU Supervisor Readiness Notification Helper
# ---------------------------------------------------------------------------
def notify_zerogpu_startup() -> None:
    """Explicitly execute ZeroGPU startup sequence and notify supervisor."""
    try:
        from spaces.zero import client as zero_client  # type: ignore
        from spaces.zero import decorator as zero_decorator  # type: ignore
        from spaces.zero import torch as zero_torch  # type: ignore

        zero_torch.pack()
        if len(zero_decorator.decorated_cache) > 0:
            zero_client.startup_report()
            logger.info("ZeroGPU supervisor successfully acknowledged startup_report.")
        else:
            logger.warning("ZeroGPU decorator cache was empty during startup report.")
    except Exception as exc:
        logger.debug("ZeroGPU startup notification: %s", exc)


# ---------------------------------------------------------------------------
# Direct Entrypoint: Launch Gradio App with Full Bridge
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    port_env = os.environ.get("PORT") or os.environ.get("GRADIO_SERVER_PORT")
    port = int(port_env) if port_env else 7860
    host = os.environ.get("HOST", "0.0.0.0")

    logger.info("Starting Bug Whisper server on http://%s:%d ...", host, port)
    logger.info("Serving React frontend from: %s", DIST_DIR)
    logger.info("Gradio bridge available at: http://%s:%d/gradio", host, port)
    logger.info("API diagnosis endpoint: http://%s:%d/api/diagnose", host, port)

    notify_zerogpu_startup()

    demo.launch(
        _app=app,
        server_name=host,
        server_port=port,
        prevent_thread_lock=False,
        ssr_mode=False,
    )
