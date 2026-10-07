# Bug Whisper: Architecture & Technical Design

Bug Whisper is an end-to-end Python debugging studio and automated code remediation ecosystem. It pairs deterministic runtime execution (CPython / Pyodide Wasm) with a fine-tuned **Qwen 2.5 Coder 3B** code-repair model and two-stage patch verification.

---

## 1. System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Frontend Studio (Browser)                       │
│                                                                        │
│   ┌────────────────────┐     postMessage     ┌─────────────────────┐  │
│   │   Monaco Editor    │ ──────────────────► │ Pyodide WebWorker   │  │
│   │   (Python Code)    │                     │ (CPython 3.12 Wasm) │  │
│   └─────────┬──────────┘                     └──────────┬──────────┘  │
│             │                                           │             │
│             │                                stdout / stderr / frames │
│             ▼                                           ▼             │
│   ┌──────────────────────────────────────────────────────────────┐    │
│   │               Inference & Remediation Engine                 │    │
│   │       FastAPI Backend (:8000)  /  Local Ollama (:11434)      │    │
│   └──────────────────────────────┬───────────────────────────────┘    │
│                                  │                                    │
│             ┌────────────────────┴───────────────────┐                │
│             ▼                                        ▼                │
│   ┌───────────────────┐                    ┌─────────────────────┐    │
│   │ Monaco DiffEditor │                    │  Verifier Health    │    │
│   │ (Green/Red Diffs) │                    │  (Stage 1 & Stage 2)│    │
│   └───────────────────┘                    └─────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Principles

1. **Deterministic First, Heuristic Second**:
   - Never use an LLM for tasks that can be performed deterministically.
   - Syntax checking, line number identification, stack frame filtering, and diff generation are handled exclusively by CPython standard libraries (`ast`, `traceback`, `difflib`).
2. **Preserve Model Distribution Alignment**:
   - The fine-tuned model (`bug-whisper-qwen25-coder-3b`) adheres to a strict 3-turn ChatML prompt contract.
   - No conversational explanations or filler text are requested from the model.
3. **Zero AI-Signaling**:
   - The UI communicates fixes through visual line additions/deletions and verification badges rather than wordy chat responses.
4. **Isolated Execution**:
   - Web execution runs in a sandboxed WebWorker with zero backend exposure.
   - CLI/Backend execution runs in temporary scratch directories with Windows process tree termination (`CREATE_NEW_PROCESS_GROUP`, `taskkill /F /T /PID`).

---

## 3. Frontend Architecture (Cream Paper Engineering Notebook)

* **Stack**: React 19, TypeScript, Tailwind CSS, Vite.
* **Aesthetic**: Cream paper engineering notebook (`#f6f6f6`), Ink Black dark code frames (`#141414`), hairline 1px dividers (`#e5e5e5` on light, `#38383a` on dark), zero drop shadows (`box-shadow: none !important;`).
* **Micro-Component Constraint**: Every UI component is strictly $< 150\text{ LOC}$ with separation between presentational views and stateful coordinators.
* **Component Map**:
  - `BugWhisperPlayground.tsx` (148 lines): Master workbench coordinator.
  - `PlaygroundHeader.tsx` (109 lines): Preset chips, status indicator, action buttons (`Run`, `Heal with 3B`, `Reset`).
  - `PlaygroundEditor.tsx` (100 lines): Monaco Python editor with custom dark syntax theme.
  - `PlaygroundTerminal.tsx` (99 lines): Terminal output with parsed traceback jumps and instant heal trigger.
  - `PlaygroundDiff.tsx` (99 lines): Monaco side-by-side / inline diff editor with "Accept Fix" action.
  - `PlaygroundVerifierPanel.tsx` (88 lines): Stage 1 AST and Stage 2 dynamic execution health metrics.
* **WebWorker Threading (`pyodide-worker.ts`)**:
  - Pyodide runs strictly inside a dedicated WebWorker to prevent main UI thread lockups during heavy Python execution.
  - Communicates via typed `postMessage` protocol with stdout/stderr stream interception.

---

## 4. Backend Engine (`backend/bugwhisper`)

### 4.1 CPython Sandboxed Runner (`core/runner.py`)
- Executes scripts via `subprocess.Popen` with `stdin=subprocess.DEVNULL` to prevent interactive `input()` calls from blocking execution.
- Configured with `CREATE_NEW_PROCESS_GROUP` on Windows.
- On timeout, terminates the entire process tree using `taskkill /F /T /PID` to eliminate orphaned child processes.

### 4.2 Reverse Frame Traceback Parser (`core/traceback_parser.py`)
- Dual-mode parser handling both compile-time (`SyntaxError`, `IndentationError`) and runtime exceptions.
- **Reverse frame filtering**: Walks the stack trace backwards to locate the offending line in the user's script, filtering out internal standard library frames (`json`, `urllib`, `threading`).

### 4.3 AST Focal Windowing (`core/focal_window.py`)
- For scripts $> 1,200$ characters, extracts the enclosing function/class or $\pm 15$ lines surrounding the error line.
- Enforces the model's 768-token budget and prevents mid-token truncation.

### 4.4 Two-Stage Verifier (`core/verifier.py`)
- **Stage 1 (Static)**: Validates AST compilation via `compile()` and `ast.parse()`.
- **Stage 2 (Dynamic)**: Executes the synthesized fix in the isolated runner with identical inputs to confirm the original error is resolved and no new exceptions are introduced.
- Status values: `VERIFIED`, `SYNTAX_PASSED`, `REGRESSED`, `FAILED`, `SYNTAX_ERROR`.

### 4.5 Unified Diff Engine (`core/diff_engine.py`)
- Computes standard unified diffs via `difflib.unified_diff`.
- Generates line additions (`+N`), deletions (`-M`), and hunk metadata.

### 4.6 Multi-Tier Inference Manager (`inference/manager.py`)
- Hierarchy:
  1. Primary Provider: Local Ollama (`http://localhost:11434`) or hosted vLLM/OpenAI endpoint.
  2. Fallback Provider: High-speed deterministic heuristic rule engine.
- Auto-discovery across candidate models: `["bug-whisper-qwen25-coder-3b", "pernavjain/bug-whisper-qwen25-coder-3b", "qwen2.5-coder:3b"]`.

### 4.7 FastAPI Production Service (`server/app.py`)
- `POST /api/execute`: Sandboxed code execution.
- `POST /api/repair`: Full repair pipeline with two-stage verification.
- `POST /api/repair/stream`: SSE streaming endpoint for live token generation.
- `POST /api/synthesize`: Direct code + stderr remediation.
- `GET /api/health`: Service health and provider status.
- `GET /api/presets`: Benchmark error presets.

### 4.8 Developer CLI & Auto-Hook (`cli/`)
- `bugwhisper check <file>`: Statically validates Python syntax and AST.
- `bugwhisper run <file> [--apply]`: Runs script, intercepts exceptions, synthesizes fix, and prompts to apply.
- `bugwhisper serve`: Starts FastAPI backend server.
- `bugwhisper model [--modelfile]`: Inspects local Ollama instance and displays configuration.
- `import bugwhisper.auto`: Zero-config `sys.excepthook` interceptor with Rich diff panel.

---

## 5. Security & Isolation Model

| Component | Security Mechanism | Threat Mitigated |
|---|---|---|
| **Web Studio** | Pyodide in WebWorker sandbox | Arbitrary host OS code execution |
| **Backend Runner** | Subprocess with DEVNULL stdin | Input blocking / stdin hangs |
| **Process Tree** | Windows process group kill | Orphaned child processes |
| **Verifier** | Static AST compilation check | Unparseable or corrupt code synthesis |
| **Token Budget** | AST focal windowing ($\le 1,500$ chars) | Context window overflow & memory exhaustion |
