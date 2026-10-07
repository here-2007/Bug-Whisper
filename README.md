# ⚡ Bug Whisper

> **AI-powered Python error debugging studio & developer ecosystem**, combining deterministic runtime execution (CPython / Pyodide Wasm) with a fine-tuned **Qwen 2.5 Coder 3B** code-repair model (`bug-whisper-qwen25-coder-3b`).

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tests](https://img.shields.io/badge/Tests-74%20Passing%20(100%25)-success)](#test-suite--quality-assurance)
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
5. **Convex Engineering Notebook Design**: Crafted with a warm cream-paper workspace (`#f6f6f6`), Ink Black dark code surfaces (`#141414`), hairline borders, and zero drop shadows.

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

## 🚀 Quickstart

### 1. Interactive Web Studio
Clone the repository and launch the frontend development server:
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The studio includes interactive presets (`IndexError`, `TypeError`, `Logic`, `ZeroDivision`, `MutableDefault`) and runs immediately using browser-based WebWorkers.

### 2. FastAPI Backend Service
Install Python dependencies and start the local API service:
```bash
pip install -r backend/requirements.txt
# or run directly with uvicorn
python -m uvicorn backend.bugwhisper.server.app:app --port 8000 --reload
```
Interactive API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Model Serving (Ollama or vLLM)
To activate local neural code synthesis:
```bash
# Option A: Quickstart with Ollama
ollama run qwen2.5-coder:3b

# Option B: Use the repository Modelfile for exact ChatML prompting
ollama create bug-whisper-qwen25-coder-3b -f Modelfile
```
*For detailed instructions on serving via vLLM, Hugging Face, or Kaggle Hub, see [MODEL_GUIDE.md](file:///e:/projects/Bug%20whisper/MODEL_GUIDE.md).*

### 4. Developer CLI (`bugwhisper`)
Bug Whisper provides a command-line interface for terminal workflows:
```bash
# Validate Python syntax statically
python -m bugwhisper.cli.main check script.py

# Execute, catch exceptions, synthesize & prompt to apply verified fix
python -m bugwhisper.cli.main run script.py --apply

# Inspect local Ollama model configuration
python -m bugwhisper.cli.main model
```

### 5. Zero-Config Exception Auto-Hook
Add one line to any Python project to automatically intercept unhandled exceptions and render interactive diffs in the terminal:
```python
import bugwhisper.auto

# Any unhandled exception will now trigger an automated fix proposal
data = {"user": "Alice"}
print(data["missing_key"])
```

---

## 🧪 Test Suite & Quality Assurance

The repository includes a comprehensive test suite covering the runner sandbox, AST validator, traceback parser, inference fallbacks, two-stage verifier, and FastAPI endpoints:

```bash
pytest backend/tests
```

```text
======================= 74 passed in 34.72s =======================
```

* All 74 unit, integration, and stress tests pass with 100% success rate.
* Frontend TypeScript build compiles with zero errors (`tsc -b && vite build`).

---

## 📚 Documentation Directory

* **[ARCHITECTURE.md](file:///e:/projects/Bug%20whisper/ARCHITECTURE.md)**: End-to-end technical architecture, sandbox security model, and component layout.
* **[MODEL_GUIDE.md](file:///e:/projects/Bug%20whisper/MODEL_GUIDE.md)**: Model card, Kaggle weights, LoRA hyperparameters, and serving instructions (Ollama, vLLM, HF).
* **[DESIGN.md](file:///e:/projects/Bug%20whisper/DESIGN.md)**: Design system specifications (Convex cream paper, typography tokens, zero drop shadows).
* **[context.md](file:///e:/projects/Bug%20whisper/context.md)**: Model specs, dataset details, and strict 3-turn ChatML prompt contract.
* **[memory.md](file:///e:/projects/Bug%20whisper/memory.md)**: Architectural decisions and technical lessons learned.
* **[phases.md](file:///e:/projects/Bug%20whisper/phases.md)**: Development roadmap from foundation to production.

---

## 👥 Contributors

* **Pernav Jain** ([@pernavjain](https://github.com/pernavjain) / Kaggle: [`pernavjain`](https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b))
* **Harshit Sharma** ([@harshitxdev](https://github.com/harshitxdev) / Kaggle: `harshitxdev`)

---

## 📄 License

Apache License 2.0. See [LICENSE](LICENSE) for details.
