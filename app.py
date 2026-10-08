"""Bug Whisper Web Server & Gradio Bridge.

Serves the existing React/TypeScript frontend (Vite compiled dist) while bridging
Python execution error diagnostics to inference.py powered by the 4-bit
Qwen 2.5 Coder 3B model under @spaces.GPU.
"""

from __future__ import annotations

# Hugging Face Spaces ZeroGPU integration MUST be imported first before any framework
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
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Dict, Optional

import gradio as gr
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

import inference

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("bugwhisper.app")

BASE_DIR = Path(__file__).parent.resolve()
DIST_DIR = BASE_DIR / "dist"


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
    confidence: float
    explanation: str
    latency_ms: int
    provider: str
    what: str
    why: str
    warning: Optional[str] = None


# ---------------------------------------------------------------------------
# FastAPI Application & REST Endpoints
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan managing model pre-loading."""
    logger.info("Lifespan startup: Bug Whisper application initializing...")
    # On ZeroGPU Spaces, model loading MUST occur dynamically inside @spaces.GPU functions
    # For local/CPU/MPS dev environments, eager preloading runs safely
    if not SPACES_AVAILABLE:
        try:
            inference.load_model_at_startup()
        except Exception as exc:
            logger.warning("Local startup model preload deferred: %s", exc)
    yield
    logger.info("Application shutdown.")


fastapi_app = FastAPI(
    title="Bug Whisper API",
    description="Bridge connecting existing React UI with fine-tuned Qwen 2.5 Coder 3B model",
    version="1.0.0",
    lifespan=lifespan,
)

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@spaces.GPU(duration=60)
def run_model_diagnosis(
    code: str,
    error_type: str,
    error_message: str,
    traceback: str,
    line: Optional[int] = None,
    file: str = "main.py",
) -> Dict[str, Any]:
    """Execute model inference dynamically inside Hugging Face Spaces ZeroGPU allocation context."""
    return inference.explain_error(
        code=code,
        error_type=error_type,
        error_message=error_message,
        traceback=traceback,
        line=line,
        file=file,
    )


@fastapi_app.post("/api/diagnose", response_model=DiagnosisResponse)
def diagnose_error(req: DiagnosisRequest) -> Dict[str, Any]:
    """Structured error diagnosis endpoint called by the React Playground."""
    logger.info("Received /api/diagnose request for error_type=%s, line=%s", req.error_type, req.line)

    raw_traceback = req.traceback or req.stderr or ""
    raw_message = req.error_message or ""
    if not raw_message and raw_traceback:
        lines = [line.strip() for line in raw_traceback.splitlines() if line.strip()]
        if lines:
            raw_message = lines[-1]

    return run_model_diagnosis(
        code=req.code,
        error_type=req.error_type or "RuntimeError",
        error_message=raw_message,
        traceback=raw_traceback,
        line=req.line,
        file=req.file or "main.py",
    )


@fastapi_app.post("/api/explain", response_model=DiagnosisResponse)
def explain_legacy(req: LegacyExplainRequest) -> Dict[str, Any]:
    """Backward-compatible endpoint matching existing frontend probe signature."""
    logger.info("Received /api/explain request for error_type=%s", req.error_type)
    raw_tb = req.traceback or req.stderr or ""
    raw_type = req.error_type or "RuntimeError"

    return run_model_diagnosis(
        code=req.code,
        error_type=raw_type,
        error_message=raw_tb.splitlines()[-1] if raw_tb else "",
        traceback=raw_tb,
        line=req.line_number,
    )


@fastapi_app.get("/api/status")
@fastapi_app.get("/api/health")
def api_status() -> Dict[str, Any]:
    """Health and model status endpoint."""
    status = inference.model_status()
    status["frontend_available"] = (DIST_DIR / "index.html").is_file()
    status["status"] = "ready"
    return status


@fastapi_app.get("/gradio")
def redirect_to_gradio():
    """Redirect /gradio to trailing slash /gradio/ for Starlette mount."""
    return RedirectResponse(url="/gradio/", status_code=307)


@fastapi_app.post("/gradio/api/diagnose", response_model=DiagnosisResponse)
def gradio_api_diagnose(req: DiagnosisRequest) -> Dict[str, Any]:
    """Mirror endpoint under /gradio/api/diagnose for Gradio-scoped clients."""
    return diagnose_error(req)


# ---------------------------------------------------------------------------
# Gradio Blocks Interface (The Model Bridge)
# ---------------------------------------------------------------------------
@spaces.GPU(duration=60)
def gradio_diagnose(
    code: str,
    error_type: str,
    error_message: str,
    traceback: str,
    line: float,
) -> Dict[str, Any]:
    """Gradio handler exposing structured diagnosis via Gradio API contract under ZeroGPU."""
    resolved_line = int(line) if line and line > 0 else None
    return run_model_diagnosis(
        code=code,
        error_type=error_type or "RuntimeError",
        error_message=error_message or "",
        traceback=traceback or "",
        line=resolved_line,
    )


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


# ---------------------------------------------------------------------------
# Mount Gradio and Static React Frontend
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
        fastapi_app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    pyodide_dir = DIST_DIR / "pyodide"
    if pyodide_dir.is_dir():
        fastapi_app.mount("/pyodide", StaticFiles(directory=str(pyodide_dir)), name="pyodide")

    @fastapi_app.get("/", response_class=FileResponse)
    def serve_frontend_root():
        return FileResponse(DIST_DIR / "index.html")

# Mount Gradio onto /gradio so Gradio UI and API are accessible
app = gr.mount_gradio_app(fastapi_app, demo, path="/gradio")

# Serve remaining static assets or SPA routes (registered after Gradio mount)
if frontend_ready:

    @fastapi_app.get("/{filename:path}")
    def serve_static_or_spa(filename: str, request: Request):
        if filename.startswith(("api", "gradio", "gradio_api")):
            raise HTTPException(status_code=404, detail="Not found")

        file_path = DIST_DIR / filename
        if file_path.is_file():
            return FileResponse(file_path)
        # SPA fallback for frontend paths
        return FileResponse(DIST_DIR / "index.html")

else:
    logger.warning("Compiled frontend not available; serving placeholder on /.")

    @fastapi_app.get("/", response_class=HTMLResponse)
    def serve_placeholder():
        return HTMLResponse(
            "<html><body style='font-family: monospace; padding: 2rem; background: #141414; color: #f6f6f6;'>"
            "<h1>Bug Whisper Backend Ready</h1>"
            "<p>Please build the frontend using <code>npm run build</code> to serve the React UI at root.</p>"
            "<p><a href='/gradio' style='color: #7bd88f;'>Open Gradio Bridge Interface</a></p>"
            "</body></html>"
        )


# ---------------------------------------------------------------------------
# Direct CLI Entrypoint
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "7860"))

    if not SPACES_AVAILABLE:
        logger.info("Preloading Bug Whisper model before server start...")
        try:
            inference.load_model_at_startup()
        except Exception as exc:
            logger.warning("Could not preload model immediately at startup: %s", exc)

    logger.info("Starting Bug Whisper server on http://%s:%d ...", host, port)
    logger.info("Serving React frontend from: %s", DIST_DIR)
    logger.info("Gradio bridge available at: http://%s:%d/gradio", host, port)
    logger.info("API diagnosis endpoint: http://%s:%d/api/diagnose", host, port)

    uvicorn.run(app, host=host, port=port)
