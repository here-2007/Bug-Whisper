# Project Phases & Roadmap: Bug Whisper

This document defines the development phases and technical milestones for **Bug Whisper**, an AI-powered Python code remediation engine combining deterministic CPython runtime execution with fine-tuned code repair intelligence (**Qwen 2.5 Coder 3B**, `bug-whisper-qwen25-coder-3b`).

---

## Roadmap Overview

```text
Phase 1: Hardened Deterministic Sandbox & Traceback Parser  [COMPLETED]
Phase 2: AST Focal Windowing & Strict ChatML Contract      [COMPLETED]
Phase 3: Resilient Multi-Tier Inference Engine             [COMPLETED]
Phase 4: Two-Stage Verification & Diff Engine              [COMPLETED]
Phase 5: FastAPI Production Service & SSE Streaming        [COMPLETED]
Phase 6: Developer CLI (bugwhisper) & Auto-Hook            [COMPLETED]
Phase 7: Frontend Studio Video-Match Re-alignment          [COMPLETED]
Phase 8: Model Ecosystem, Modelfile & Auto-Fallback        [COMPLETED]
```

---

## Phase 1: Hardened Deterministic Sandbox & Traceback Parser [COMPLETED]
*Objective: Build an isolated, leak-free CPython execution harness and dual-mode stack frame parser.*

- [x] **`core/runner.py`**:
  - Sandboxed execution via `subprocess.Popen` with `stdin=subprocess.DEVNULL` to prevent interactive `input()` deadlocks.
  - Windows process group handling (`creationflags=subprocess.CREATE_NEW_PROCESS_GROUP`).
  - Timeout tree termination using `taskkill /F /T /PID <pid>` to eliminate orphaned child processes.
  - Temporary scratch directory execution with filtered environment variables.
- [x] **`core/traceback_parser.py`**:
  - Dual-mode parser separating compile-time vs runtime errors.
  - Compile-time handler for `SyntaxError` and `IndentationError` (`lineno`, `offset`, `text`, caret).
  - Runtime handler with **reverse frame filtering**: walks call stacks backwards to isolate user script frames and eliminate standard library contamination (e.g. `json`, `urllib`).

---

## Phase 2: AST Focal Windowing & Strict ChatML Contract [COMPLETED]
*Objective: Enforce the model's 768-token training distribution and extract pure Python code.*

- [x] **`core/focal_window.py`**:
  - AST-guided scope extractor for scripts $> 1,200$ characters.
  - Isolates the enclosing function/class or $\pm 15$ lines surrounding the error line to guarantee adherence to the 768-token limit without mid-token truncation.
- [x] **`core/prompt_builder.py`**:
  - Exact 3-turn ChatML prompt generator matching context.md.
  - Strict `stderr[:300]` slicing.
  - Token length budgeting ensuring `(len(old) + len(new) + len(err[:300])) <= 1800` characters.
- [x] **`core/code_extractor.py`**:
  - Strips markdown code fences (```python ... ```) and eliminates conversational commentary.

---

## Phase 3: Resilient Multi-Tier Inference Engine [COMPLETED]
*Objective: Enable dependable inference on Windows CPU/GPU without bnb compile failures.*

- [x] **`inference/base.py`**:
  - Abstract `InferenceProvider` interface defining synchronous `generate_fix()` and asynchronous streaming generator `stream_fix()`.
- [x] **`inference/ollama_provider.py`**:
  - Client for local Ollama (`http://localhost:11434`) using `qwen2.5-coder:3b` with streaming support.
- [x] **`inference/openai_provider.py`**:
  - Client for vLLM or OpenAI-compatible hosted endpoints hosting the fine-tuned Kaggle adapter.
- [x] **`inference/heuristic_provider.py`**:
  - High-speed deterministic fallback engine for preset error benchmarks.
- [x] **`inference/manager.py`**:
  - Fallback orchestrator with failover between primary (Ollama/OpenAI) and deterministic heuristic rule engine.

---

## Phase 4: Two-Stage Verification & Diff Engine [COMPLETED]
*Objective: Guarantee zero regressions before presenting or applying fixes.*

- [x] **`core/ast_validator.py`**:
  - Static syntax compile check with `compile()` and `ast.parse()`.
- [x] **`core/verifier.py`**:
  - Two-stage verification loop:
    1. Static AST compile check.
    2. Dynamic re-execution of the patched code in the sandbox with identical test inputs.
  - Emits structured status: `VERIFIED`, `SYNTAX_PASSED`, `REGRESSED`, `FAILED`, `SYNTAX_ERROR`.
- [x] **`core/diff_engine.py`**:
  - Computes standard unified diffs (`difflib.unified_diff`) and structured patch hunk metadata.

---

## Phase 5: FastAPI Production Service & SSE Streaming [COMPLETED]
*Objective: Expose high-performance async REST and streaming endpoints.*

- [x] **`server/app.py` & `routes/`**:
  - `POST /api/execute`: Run code in sandbox and return structured execution result.
  - `POST /api/repair`: Full synchronous repair pipeline with two-stage verification.
  - `POST /api/repair/stream`: Server-Sent Events (SSE) streaming endpoint for live token emission.
  - `POST /api/synthesize`: Direct `{ code, stderr }` repair endpoint.
  - `GET /api/health`: Uptime, active provider, device information (CPU/CUDA).
  - `GET /api/presets`: Benchmark bug presets.
  - CORS enabled for Vite frontend (`http://localhost:5173`).

---

## Phase 6: Developer CLI & Auto-Hook [COMPLETED]
*Objective: Provide a terminal developer tool and exception interceptor.*

- [x] **`cli/main.py`**: Typer-powered CLI entrypoint (`bugwhisper run`, `bugwhisper check`, `bugwhisper serve`, `bugwhisper model`).
- [x] **`cli/auto_hook.py`**: Global `sys.excepthook` interceptor with Rich diff panel.
- [x] **`auto.py`**: Zero-config import hook (`import bugwhisper.auto`).
- [x] **Pytest Test Suite**: Expanded to 74 unit, integration, and CLI tests passing with 100% success rate.

---

## Phase 7: Frontend Studio Video-Match Re-alignment [COMPLETED]
*Objective: Build dedicated Python Debugging Studio matching reference layout.*

- [x] **Landing Page Design**: Built full page as Python Debugging Studio preserving warm cream-paper notebook aesthetic (`#f6f6f6`), Ink Black code cards (`#141414`), hairline borders, and strict zero drop shadows.
- [x] **Section 3 Interactive Playground**:
  - Replaced top layer with embedded `BugWhisperPlayground.tsx` inside the dark container card.
  - Split view: Monaco Python editor (`PlaygroundEditor.tsx`), Pyodide WebWorker terminal (`PlaygroundTerminal.tsx`), side-by-side Monaco diff (`PlaygroundDiff.tsx`), and verification metrics panel (`PlaygroundVerifierPanel.tsx`).
- [x] **Micro-Component Refactoring**: All 20 UI components strictly $< 150\text{ LOC}$.
- [x] **Client-Side Sandbox**: CPython 3.12 executed via Pyodide in dedicated WebWorker (`pyodide-worker.ts`) preventing browser thread lockups.

---

## Phase 8: Model Ecosystem, Modelfile & Auto-Fallback [COMPLETED]
*Objective: Streamline local model serving and zero-dependency execution.*

- [x] **Root `Modelfile`**: Ready-to-use Ollama Modelfile enforcing the exact ChatML contract, `temperature=0.0`, and `num_predict=768`.
- [x] **Multi-Candidate Model Discovery**: Automatic fallback across candidate model names (`bug-whisper-qwen25-coder-3b`, `pernavjain/bug-whisper-qwen25-coder-3b`, `qwen2.5-coder:3b`).
- [x] **CLI Model Management**: `bugwhisper model` command for inspecting local Ollama status, listing pulled models, and displaying Modelfile definitions.
- [x] **Documentation Suite**: `README.md`, `ARCHITECTURE.md`, `MODEL_GUIDE.md`, `DESIGN.md`, `context.md`, `memory.md`.

