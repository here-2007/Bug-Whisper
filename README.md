---
title: Bug Whisper
emoji: ⚡
colorFrom: yellow
colorTo: indigo
sdk: gradio
app_file: app.py
pinned: false
license: apache-2.0
short_description: Python error debugging studio powered by Qwen 2.5 Coder 3B
---

# ⚡ Bug Whisper

> **AI-powered Python error debugging studio & developer ecosystem**, combining deterministic runtime execution (CPython / Pyodide Wasm) with a fine-tuned **Qwen 2.5 Coder 3B** code-repair model (`bug-whisper-qwen25-coder-3b`).

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Gradio](https://img.shields.io/badge/Gradio-6.0+-FF7C00?logo=gradio&logoColor=white)](https://gradio.app/)
[![ZeroGPU](https://img.shields.io/badge/Hugging%20Face-ZeroGPU%20Ready-yellow)](https://huggingface.co/spaces)
[![Tests](https://img.shields.io/badge/Tests-90%20TS%20%2B%2016%20Py%20Passing-success)](#test-suite--quality-assurance)
[![Kaggle Model](https://img.shields.io/badge/Kaggle-bug--whisper--qwen25--coder--3b-20BEFF?logo=kaggle&logoColor=white)](https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## 🌟 Overview

Bug Whisper pairs deterministic browser execution with specialized neural code repair. Instead of forcing an LLM to simulate a Python interpreter, Bug Whisper strictly separates concerns:

1. **Deterministic Execution (Pyodide Wasm / CPython)**: Executes code safely in a dedicated WebWorker thread, capturing stdout, stderr, exception types, and exact offending stack frames in 0 ms without blocking the UI.
2. **Specialized Error Diagnosis & Synthesis (4-bit Qwen 2.5 Coder 3B)**: A standalone merged 4-bit BitsAndBytes model fine-tuned on real-world Git error commits and tracebacks to output structured What, Why, and fix diagnostics.
3. **Gradio Python Bridge (`app.py`)**: Seamlessly connects the existing React/TypeScript frontend with Python model inference (`inference.py`), hosting both the static production SPA and Gradio API on a single port.
4. **Hugging Face Spaces ZeroGPU Acceleration (`@spaces.GPU`)**: Dynamically allocates GPU slices during inference, caching model weights in memory and reusing them across requests.
5. **Cream Paper Engineering Notebook Design**: Warm cream-paper workspace (`#f6f6f6`), Ink Black dark code surfaces (`#141414`), 1px hairline dividers (`#2d3128`), and zero drop shadows.

---

## 📐 Architecture & Bridge Flow

```
                      EXISTING REACT / TSX FRONTEND
                                   │
                                   │ user writes code & clicks Run
                                   ▼
                       Playground Runner (Pyodide)
                                   │
                                   │ code executes in WebWorker
                        ┌──────────┴──────────┐
                        │                     │
                     success                error
                        │                     │
                   Terminal clean             ▼
                                     Traceback appears
                                              │
                                              ▼
                                   Frontend extracts:
                                   • error_type
                                   • error_message
                                   • traceback
                                   • line & file
                                   • source code
                                              │
                                              ▼  POST /api/diagnose
                                   Gradio Backend Bridge (app.py)
                                              │
                                              ▼
                                        inference.py
                                   [@spaces.GPU generation]
                                              │
                                              ▼
                                   Bug Whisper 4-bit Model
                                 (Qwen 2.5 Coder 3B NF4)
                                              │
                                              ▼
                                   Structured Diagnosis JSON:
                                   • what_happened
                                   • why_it_happened
                                   • suggested_fix
                                              │
                                              ▼  JSON response
                                   Existing Explanation Block
                                   (ErrorExplanationBlock.tsx)
```

---

## 🛠️ Interactive Studio Capabilities

Bug Whisper delivers a complete, friction-free developer experience directly inside the browser:

* **1-Click Preset Selector**: Instant loading and execution of 7 classic real-world Python bug patterns (`IndexError`, `TypeError`, mutable default argument, `KeyError`, `ZeroDivisionError`, `UnboundLocalError`, and missing colon `SyntaxError`).
* **Unified Git Diff Patch Viewer**: Toggle between clean semantic diagnosis (`[ Explanation ]`) and a git-native patch viewer (`[ Diff Patch ]`) with inline addition (`+`) and deletion (`-`) syntax highlighting.
* **"Apply Fix & Re-run"**: Automatically patches the Monaco editor buffer with the model's synthesized repair, clears error states, and re-executes cleanly in Pyodide Wasm with a single click.
* **Shareable URL Permalinks**: 1-click **Share** button encodes the editor buffer into a shareable URL hash (`#code=base64...`), allowing team members to reproduce bugs instantly.
* **1-Click Clipboard Actions**: Dedicated copy buttons for formatted tracebacks and model root-cause diagnoses with instant visual confirmation.

---

## 🚀 Running Locally

### 1. Prerequisites & Environment Setup
Clone the repository and install both Python and Node dependencies:

```bash
git clone https://github.com/here-2007/Bug-Whisper.git
cd Bug-Whisper

# Set up Python virtual environment
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Install frontend dependencies and build static assets
npm install
npm run build
```

### 2. Launch the Application
Run the unified server with a single command:

```bash
python app.py
```

The application will start on `http://localhost:7860`:
- **Main React Workbench**: [http://localhost:7860/](http://localhost:7860/) (The full, interactive cream-paper React studio)
- **Gradio Bridge Explorer**: [http://localhost:7860/gradio/](http://localhost:7860/gradio/) (Gradio Blocks interface & API documentation)
- **REST Diagnosis API**: `POST http://localhost:7860/api/diagnose`
- **Health & Status**: `GET http://localhost:7860/api/status`

### 3. Development Mode with Live Frontend Reload
If modifying frontend components, run the Vite dev server alongside the Python backend:

```bash
# Terminal 1: Python backend
python app.py

# Terminal 2: Vite dev server with /api proxy to :7860
npm run dev
```

---

## 📦 Model Location & KaggleHub Fallback

Bug Whisper loads a standalone merged 4-bit BitsAndBytes model with NF4 quantization.

### Resolution Logic:
1. **Local Model (`./model` or `/model`)**:
   `inference.py` checks candidate paths:
   - Path in `MODEL_DIR` environment variable
   - `./model` in repository root
   - `/model` in root directory
   Validates presence and integrity of:
   - `config.json`
   - `model.safetensors.index.json`
   - `tokenizer.json`
   - `tokenizer_config.json`
   - All referenced `.safetensors` shards (`model-00001-of-00002.safetensors`, `model-00002-of-00002.safetensors`)
2. **Automatic KaggleHub Download**:
   If required files are missing from candidate paths, `inference.py` automatically downloads the model from KaggleHub:
   ```text
   Kaggle Handle: pernavjain/bug-whisper-qwen25-coder-3b/pyTorch/4bit-bnb
   ```
   Materializes files into `./model`, validates checksums/sizes, and proceeds to load.
3. **Singleton In-Memory Cache**:
   The model and tokenizer are loaded **once** using a thread-safe singleton lock and cached in memory. Subsequent requests reuse the loaded weights with 0 ms re-initialization overhead.

---

## 🍲 Fine-Tuned with Soup (`soup-cli`)

Bug Whisper's model was fine-tuned using [Soup](https://github.com/trysoup/soup) (`soup-cli`), eliminating verbose PyTorch and Hugging Face TRL boilerplate through a single declarative YAML recipe.

### Training Profile & Specs:
- **Declarative Recipe**: 28-line [`soup.yaml`](soup.yaml)
- **Base Architecture**: `Qwen/Qwen2.5-Coder-3B-Instruct`
- **Dataset**: 9,340 real-world Git error commits paired with CPython execution tracebacks
- **Hardware & Speed**: Single Nvidia Tesla T4 GPU in **14.2 minutes** (~$0.08 compute cost)
- **LoRA Parameters**: Rank $r=16$, Alpha $\alpha=32$, targeting all projection modules (`q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`)
- **Loss Masking**: `train_on_responses_only: true` (gradients isolated to corrected code fences, preventing conversational degradation)
- **Artifact**: 29.5 MB lightweight LoRA adapter merged into 4-bit NF4 weights for instant edge/serverless serving

### Reproduce Training:
```bash
# Install soup-cli
pip install soup-cli

# Train with declarative recipe
soup train --config soup.yaml
```

---

## ☁️ Hugging Face Spaces Deployment

Bug Whisper is pre-configured for deployment on **Hugging Face Spaces (ZeroGPU or Dedicated GPU)**:

### Configuration:
- **SDK**: `gradio`
- **Port**: `7860` (or configured via `$PORT`)
- **GPU Acceleration**: Inference is protected by `@spaces.GPU(duration=60)` in `inference.py`. On Hugging Face ZeroGPU, an Nvidia GPU worker is dynamically allocated for the model generation call and released immediately after token generation.
- **Graceful Fallback**: In environments without `spaces` (such as local macOS / Apple Silicon MPS or CPU), a transparent mock decorator allows full local execution without crashes.

### Deploying to Spaces:
1. Create a new Space on Hugging Face with SDK set to **Gradio**.
2. Push repository files (`app.py`, `inference.py`, `requirements.txt`, `model/`, `dist/`).
3. Spaces automatically executes `python app.py`, serving the React frontend on the Space's public URL.

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `7860` | Server listening port |
| `HOST` | `0.0.0.0` | Server host binding |
| `MODEL_DIR` | `./model` | Local directory containing 4-bit model safetensors |
| `KAGGLE_MODEL_HANDLE` | `pernavjain/bug-whisper-qwen25-coder-3b/pyTorch/4bit-bnb` | Kaggle model handle for fallback download |
| `KAGGLE_USERNAME` | *(Optional)* | Kaggle authentication username for private models |
| `KAGGLE_KEY` | *(Optional)* | Kaggle API key for private models |

---

## 🔌 API & Contract Specifications

### 1. Error Diagnosis (`POST /api/diagnose`)

**Request Payload (`ErrorDiagnosisRequest`)**:
```json
{
  "code": "print(1 / 0)",
  "error_type": "ZeroDivisionError",
  "error_message": "division by zero",
  "traceback": "Traceback (most recent call last):\n  File \"main.py\", line 1, in <module>\n    print(1 / 0)\nZeroDivisionError: division by zero",
  "file": "main.py",
  "line": 1
}
```

**Response Payload (`ErrorDiagnosisResponse`)**:
```json
{
  "error_type": "ZeroDivisionError",
  "what_happened": "The program attempted to divide by zero.",
  "why_it_happened": "In Python, attempting to divide any number by zero results in a ZeroDivisionError.",
  "suggested_fix": "Replace the division operation with a non-zero value.",
  "confidence": 1.0,
  "explanation": "The program attempted to divide by zero. In Python, attempting to divide any number by zero results in a ZeroDivisionError. Replace the division operation with a non-zero value or add a guard check.",
  "latency_ms": 320,
  "provider": "Bug Whisper Qwen 2.5 Coder 3B (4-bit)",
  "what": "The program attempted to divide by zero.",
  "why": "In Python, attempting to divide any number by zero results in a ZeroDivisionError."
}
```

### 2. Gradio API Endpoint (`/gradio/gradio_api/call/diagnose`)
Accepts `data: [code, error_type, error_message, traceback, line]` and returns the structured JSON diagnosis.

---

## 🧪 Test Suite & Quality Assurance

The repository enforces 100% test pass rates across both Python backend and TypeScript frontend:

```bash
# 1. Run Python backend integration & acceptance suite (Tests 1-17)
python -m pytest tests/test_backend_integration.py -v

# 2. Run TypeScript test suite (Tiers 1-4, 90 tests)
npm test

# 3. Verify production Vite build
npm run build
```

| Component | Test Suite | Tests Passing | Success Rate |
|---|---|---|---|
| **Python Backend & Model Bridge** | `pytest tests/test_backend_integration.py` | **16 / 16** | 100% |
| **Frontend TypeScript Sandbox** | `tsx tests/run-tests.ts` | **90 / 90** | 100% |
| **Vite Bundle** | `tsc -b && vite build` | **Clean build** | 100% |

---

## 👥 Authors & Contributors

* **Pernav Jain** ([@here-2007](https://github.com/here-2007) · [LinkedIn](https://www.linkedin.com/in/pernav-jain/) · [Kaggle](https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b))
* **Harshit Sharma** ([@harshitthek](https://github.com/harshitthek) · [LinkedIn](https://www.linkedin.com/in/devharshitsharma/))

---

## 📄 License

Apache License 2.0. See [LICENSE](LICENSE) for details.
