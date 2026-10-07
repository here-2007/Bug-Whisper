# Project Phases & Roadmap: Bug Whisper

This document defines the development phases and technical milestones for **Bug Whisper**, an AI-powered Python code remediation engine combining deterministic CPython runtime execution with fine-tuned code repair intelligence (**Qwen 2.5 Coder 3B**, `bug-whisper-qwen25-coder-3b`).

---

## Roadmap Overview

```text
Phase 1: Hardened Deterministic Sandbox & Traceback Parser  [NEXT]
Phase 2: AST Focal Windowing & Strict ChatML Contract
Phase 3: Resilient Multi-Tier Inference Engine
Phase 4: Two-Stage Verification & Diff Engine
Phase 5: FastAPI Production Service & SSE Streaming
Phase 6: Developer CLI (bugwhisper) & Full-Stack Integration
```

---

## Phase 1: Hardened Deterministic Sandbox & Traceback Parser
*Objective: Build an isolated, leak-free CPython execution harness and dual-mode stack frame parser.*

- [ ] **`core/runner.py`**:
  - Sandboxed execution via `subprocess.Popen` with `stdin=subprocess.DEVNULL` to prevent interactive `input()` deadlocks.
  - Windows process group handling (`creationflags=subprocess.CREATE_NEW_PROCESS_GROUP`).
  - Timeout tree termination using `taskkill /F /T /PID <pid>` to eliminate orphaned child processes.
  - Temporary scratch directory execution with filtered environment variables.
- [ ] **`core/traceback_parser.py`**:
  - Dual-mode parser separating compile-time vs runtime errors.
  - Compile-time handler for `SyntaxError` and `IndentationError` (`lineno`, `offset`, `text`, caret).
  - Runtime handler with **reverse frame filtering**: walks call stacks backwards to isolate user script frames and eliminate standard library contamination (e.g. `json`, `urllib`).

---

## Phase 2: AST Focal Windowing & Strict ChatML Contract
*Objective: Enforce the model's 768-token training distribution and extract pure Python code.*

- [ ] **`core/focal_window.py`**:
  - AST-guided scope extractor for scripts $> 1,200$ characters.
  - Isolates the enclosing function/class or $\pm 15$ lines surrounding the error line to guarantee adherence to the 768-token limit without mid-token truncation.
- [ ] **`core/prompt_builder.py`**:
  - Exact 3-turn ChatML prompt generator matching [context.md](file:///e:/projects/Bug%20whisper/context.md).
  - Strict `stderr[:300]` slicing.
  - Token length budgeting ensuring `(len(old) + len(new) + len(err[:300])) <= 1800` characters.
- [ ] **`core/code_extractor.py`**:
  - Strips markdown code fences (```python ... ```) and eliminates conversational commentary.

---

## Phase 3: Resilient Multi-Tier Inference Engine
*Objective: Enable dependable inference on Windows CPU/GPU without bnb compile failures.*

- [ ] **`inference/base.py`**:
  - Abstract `InferenceProvider` interface defining synchronous `generate_fix()` and asynchronous streaming generator `stream_fix()`.
- [ ] **`inference/ollama_provider.py`**:
  - Client for local Ollama (`http://localhost:11434`) using `qwen2.5-coder:3b` with streaming support.
- [ ] **`inference/openai_provider.py`**:
  - Client for vLLM or OpenAI-compatible hosted endpoints hosting the fine-tuned Kaggle adapter.
- [ ] **`inference/heuristic_provider.py`**:
  - High-speed deterministic fallback engine for preset error benchmarks.

---

## Phase 4: Two-Stage Verification & Diff Engine
*Objective: Guarantee zero regressions before presenting or applying fixes.*

- [ ] **`core/ast_validator.py`**:
  - Static syntax compile check with `compile()` and `ast.parse()`.
- [ ] **`core/verifier.py`**:
  - Two-stage verification loop:
    1. Static AST compile check.
    2. Dynamic re-execution of the patched code in the sandbox with identical test inputs.
  - Emits structured status: `VERIFIED`, `SYNTAX_PASSED`, `REGRESSED`, `FAILED`.
- [ ] **`core/diff_engine.py`**:
  - Computes standard unified diffs (`difflib.unified_diff`) and structured patch hunk metadata.

---

## Phase 5: FastAPI Production Service & SSE Streaming
*Objective: Expose high-performance async REST and streaming endpoints.*

- [ ] **`server/app.py` & `routes/`**:
  - `POST /api/execute`: Run code in sandbox and return structured execution result.
  - `POST /api/repair`: Full synchronous repair pipeline with two-stage verification.
  - `POST /api/repair/stream`: Server-Sent Events (SSE) streaming endpoint for live token emission.
  - `POST /api/synthesize`: Direct `{ code, stderr }` repair endpoint.
  - `GET /api/health`: Uptime, active provider, device information (CPU/CUDA).
  - `GET /api/presets`: Benchmark bug presets.
  - CORS enabled for Vite frontend (`http://localhost:5173`).

---

## Phase 6: Developer CLI & Full-Stack Integration
*Objective: Provide a terminal developer tool and reconnect the web studio.*

- [ ] **`cli/main.py`**: Typer-powered CLI entrypoint.
- [ ] **`cli/runner_cli.py`**: `bugwhisper run script.py` command with crash interception and interactive Rich terminal diff (`[a]ccept / [d]iff / [r]erun / [q]uit`).
- [ ] **`cli/auto_hook.py`**: Global `sys.excepthook` interceptor (`python -m bugwhisper.auto script.py`).
- [ ] **Frontend Re-Hookup**: Reconnect the React Web Studio (`src/lib/inference.ts`) directly to FastAPI endpoints (`http://localhost:8000`).
- [ ] **Pytest Test Suite**: Unit and integration test coverage across all modules.
