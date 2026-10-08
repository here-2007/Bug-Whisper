# ⚡ Bug Whisper

> **AI-powered Python error debugging studio & developer ecosystem**, combining deterministic runtime execution (CPython / Pyodide Wasm) with a fine-tuned **Qwen 2.5 Coder 3B** code-repair model (`bug-whisper-qwen25-coder-3b`).

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tests](https://img.shields.io/badge/Tests-93%20Passing%20(100%25)-success)](#test-suite--quality-assurance)
[![PyPI](https://img.shields.io/pypi/v/bugwhisper.svg?color=blue)](https://pypi.org/project/bugwhisper/)
[![Kaggle Model](https://img.shields.io/badge/Kaggle-bug--whisper--qwen25--coder--3b-20BEFF?logo=kaggle&logoColor=white)](https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## 🌟 Overview

Bug Whisper pairs deterministic execution with specialized neural code repair. Instead of forcing an LLM to simulate a Python interpreter mentally, Bug Whisper strictly separates concerns:

1. **Deterministic Execution (Pyodide Wasm / CPython)**: Executes code safely, capturing stdout, stderr, exception types, and exact offending stack frames in 0 ms.
2. **Specialized Code Synthesis (Qwen 2.5 Coder 3B LoRA)**: A 3B-parameter model fine-tuned on real-world Git error commits and tracebacks to output clean, corrected Python code without conversational filler.
3. **Two-Stage Verification Loop**:
   - **Stage 1 (Static)**: Verifies AST syntax through `compile()` and `ast.parse()`.
   - **Stage 2 (Dynamic)**: Executes the synthesized fix in an isolated sandbox with identical inputs to guarantee 0 regressions.
4. **Visual Monaco Diff Inspection**: Highlights exact line additions and deletions (green/red) with 1-click patch application.
5. **Cream Paper Engineering Notebook Design**: Crafted with a warm cream-paper workspace (`#f6f6f6`), Ink Black dark code surfaces (`#141414`), hairline borders, and zero drop shadows.

---

## 📐 Architecture

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

## 🚀 Installation & Quickstart

### 1. Python Package (PyPI)
Install Bug Whisper directly from PyPI:

```bash
# Core CLI and runtime auto-hook (zero heavy dependencies)
pip install bugwhisper

# With native Kaggle Hub model loading (kagglehub, torch, transformers)
pip install "bugwhisper[kaggle]"

# With Hugging Face Hub inference client
pip install "bugwhisper[hf]"

# Complete developer & ML ecosystem
pip install "bugwhisper[all]"
```

### 2. Developer CLI (`bugwhisper`)
Once installed via pip, the `bugwhisper` binary is immediately available:

```bash
# Validate Python syntax and AST statically
bugwhisper check script.py

# Inspect active Python virtual environment
bugwhisper env

# Inspect Kaggle / Hugging Face model status and cache
bugwhisper model
bugwhisper model --download-kaggle

# Run script, intercept crashes, synthesize fix via Kaggle & interactively apply patch
bugwhisper run script.py --provider kaggle --apply

# Start local FastAPI REST backend server
bugwhisper serve --port 8000
```

### 3. Python SDK & Zero-Config Auto-Hook

#### Zero-Config Exception Auto-Hook
Add one line to any script. Unhandled exceptions will automatically trigger interactive fix proposals with unified terminal diffs:
```python
import bugwhisper.auto

data = {"user": "Alice"}
print(data["missing_key"])  # Triggers automated fix proposal
```

#### Programmatic Sandboxing & Verification
Use Bug Whisper's deterministic core modules directly in your Python applications:
```python
from bugwhisper.core.runner import run_code_sandboxed
from bugwhisper.core.ast_validator import validate_syntax
from bugwhisper.core.diff_engine import generate_unified_diff

# 1. Execute untrusted or buggy code safely in an isolated sandbox
result = run_code_sandboxed("nums = [1, 2]\nprint(nums[10])")
if not result.success:
    print(f"Caught {result.error_type} at line {result.line_number}")
    print(result.traceback_str)

# 2. Inspect unified diff between buggy and remediated code
diff = generate_unified_diff(
    original_code="nums = [1, 2]\nprint(nums[10])",
    remediated_code="nums = [1, 2]\nif len(nums) > 10:\n    print(nums[10])",
)
print(diff)
```

### 4. Interactive Web Studio
Launch the browser-based development studio powered by Pyodide WebWorkers and Monaco DiffEditor:
```bash
git clone https://github.com/harshitthek/bug-whisper.git
cd bug-whisper
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The studio runs 100% offline using browser-based WebAssembly threads.

---

## 🧩 Modular Package Architecture

Bug Whisper is architected into focused, decoupled modules:

```
bugwhisper/
├── auto.py                 # Zero-config sys.excepthook runtime interceptor
├── cli/                    # Typer command-line interface with Rich formatting
│   ├── main.py             # CLI commands: check, run, env, model, serve
│   └── auto_hook.py        # Terminal diff interactive prompter
├── core/                   # Deterministic runtime engine & verification
│   ├── runner.py           # Subprocess isolation with 3.0s timeout watchdog
│   ├── ast_validator.py    # Static AST compilation & syntax checks
│   ├── traceback_parser.py # Dual-mode exception & stack frame extractor
│   ├── diff_engine.py      # Standard unified diff generator
│   ├── verifier.py         # Two-stage static & dynamic patch verification
│   ├── focal_window.py     # AST focal windowing for large codebases
│   └── venv.py             # Automatic virtual environment resolver
├── inference/              # Multi-tier code synthesis providers
│   ├── kaggle_provider.py  # Kaggle Hub fine-tuned weights (kagglehub)
│   ├── hf_provider.py      # Hugging Face serverless inference API
│   ├── ollama_provider.py  # Local Ollama streaming client (:11434)
│   ├── heuristic_provider.py # Instant AST deterministic fallback (0 MB)
│   └── manager.py          # Unified multi-provider router
└── server/                 # Production FastAPI REST application
    ├── app.py              # Application factory with CORS & lifecycle hooks
    ├── schemas.py          # Pydantic v2 validation contracts
    └── routes/             # REST endpoints (/execute, /synthesize, /kaggle, etc.)
```

---

## 🧪 Quality Assurance & Test Suites

The repository enforces 100% test pass rates across both Python and TypeScript:

```bash
# Run 93 backend unit and integration tests (0 warnings)
pytest backend/tests/ -v

# Run 82 frontend tier tests & verify zero drop-shadow constraints
npm test

# Verify production Vite bundle and TypeScript types
npm run build
```

| Component | Test Suite | Tests Passing | Success Rate |
|---|---|---|---|
| **Python Backend** | `pytest backend/tests/` | **93 / 93** | 100% |
| **Frontend Studio** | `tsx tests/run-tests.ts` | **82 / 82** | 100% |
| **Linter (`oxlint`)** | `oxlint` | **0 errors, 0 warnings** | 100% |
| **Vite Bundle** | `tsc -b && vite build` | **Clean build (0 errors)** | 100% |

---

## 📚 Documentation & Ecosystem

* **[CONTRIBUTING.md](CONTRIBUTING.md)**: Developer setup, code standards, and PR guidelines.
* **[CHANGELOG.md](CHANGELOG.md)**: Release history and version migration notes.
* **[MODEL_GUIDE.md](MODEL_GUIDE.md)**: Kaggle weights, LoRA hyperparameters, and serving options.
* **[ARCHITECTURE.md](ARCHITECTURE.md)**: End-to-end technical architecture and sandbox security.
* **[DESIGN.md](DESIGN.md)**: Design system specifications (cream paper notebook, zero drop shadows).
* **[context.md](context.md)**: Model specification and 3-turn ChatML prompt contract.

---

## 👥 Authors & Contributors

* **Pernav Jain** ([@pernavjain](https://github.com/pernavjain) / Kaggle: [`pernavjain`](https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b))
* **Harshit Sharma** ([@harshitxdev](https://github.com/harshitxdev) / Kaggle: `harshitxdev`)

---

## 📄 License

Apache License 2.0. See [LICENSE](LICENSE) for details.
