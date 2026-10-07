# Project Memory & Decision Log: Bug Whisper

A persistent log of core architectural decisions, model constraints, and technical lessons learned during the development of Bug Whisper.

---

## 1. Key Architectural Decisions

### Decision 1: Client-Side Python Sandbox (Pyodide Wasm) vs. Backend Docker
* **Decision**: Run Python execution inside the user's browser using Pyodide (CPython 3.12 compiled to WebAssembly) in a dedicated WebWorker.
* **Rationale**:
  - **Security**: Prevents arbitrary code execution (`os.system("rm -rf /")`) from threatening servers.
  - **Latency**: Code executes immediately on client hardware with 0 network latency.
  - **Infrastructure Cost**: Zero backend compute bills; the frontend can be deployed statically (Vercel, Netlify, Cloudflare).
  - **No Docker Daemon Dependency**: Eliminates container startup delays (500ms–2s) and server maintenance.

### Decision 2: Division of Labor (CPython Runtime vs. LLM)
* **Decision**: Do not ask the LLM to detect bugs or simulate Python execution. Use the Python runtime to detect crashes deterministically and let Qwen 2.5 Coder 3B synthesize the fix.
* **Rationale**:
  - LLMs hallucinate syntax and runtime errors when asked to execute complex code mentally.
  - CPython natively provides exact line numbers, exception classes, and full tracebacks for free in 0 ms.

### Decision 3: Strict Alignment with SFT Distribution
* **Decision**: Do not prompt the fine-tuned model for long multi-paragraph explanations or bulleted lists.
* **Rationale**:
  - `bug-whisper-qwen25-coder-3b` was fine-tuned with `train_on_responses_only: true` strictly on ````python\n{new_code}\n````.
  - Asking the model for explanations forces it away from its fine-tuned weights and back to generic pretraining behavior.
  - Visual line-by-line diffs (green/red) communicate fixes faster and more clearly than wordy explanations.

### Decision 4: Multi-Provider Inference Architecture
* **Decision**: Support 4 inference providers: Interactive Mock (default), Local Ollama, Hugging Face Inference API, and custom OpenAI/vLLM.
* **Rationale**:
  - First-time visitors and evaluators need to test the website immediately without configuring API tokens or spinning up local GPU servers.
  - Power users and team members can switch to their local Ollama instance (`localhost:11434`) or hosted endpoints with 1 click.

### Decision 5: Convex Design System (Cream Paper Engineering Notebook)
* **Decision**: Adopt the Convex technical style reference ([design.md](file:///e:/projects/Bug%20whisper/design.md)) featuring a warm cream canvas (`#f6f6f6`), dark code editor blocks (`#141414`), charcoal frames (`#292929`), zero drop shadows, and hairline borders (`#e5e5e5` on light, `#38383a` on dark).
* **Rationale**:
  - Moves away from generic SaaS dark mode into a distinctive, editorial developer-first notebook feel (similar to Linear and Convex).
  - Maximizes contrast: code blocks stand out sharply in `#141414` against the `#f6f6f6` cream backdrop.
  - Semantic syntax colors (hot pink `#fc618d`, iris violet `#948ae3`, mint green `#7bd88f`, canary yellow `#f8e67a`) remain strictly scoped inside code blocks.

### Decision 6: Sandbox Subprocess Isolation & Windows Tree Termination
* **Decision**: Isolate execution via `subprocess.Popen` with `stdin=subprocess.DEVNULL`, Windows process group creation (`CREATE_NEW_PROCESS_GROUP`), and cleanup via `taskkill /F /T /PID`.
* **Rationale**:
  - Prevents interactive `input()` calls in user scripts from hanging the backend until timeout.
  - Eliminates orphaned child processes on Windows when timeouts occur.

### Decision 7: AST Focal Windowing & Multi-Tier Inference Strategy
* **Decision**: Implement AST focal window extraction for scripts $> 1,200$ characters and structure inference into a multi-tier hierarchy (Ollama local / vLLM remote / deterministic heuristic fallback).
* **Rationale**:
  - The model's strict 768-token budget must never be breached by large monolithic scripts.
  - Running 4-bit bitsandbytes directly on Windows CPU is unsupported; Ollama GGUF and remote OpenAI-compatible endpoints guarantee crash-free cross-platform execution.

### Decision 8: Two-Stage Verification & Unified Diff Generation
* **Decision**: Before presenting or applying any synthesized remediation, execute two-stage verification: Stage 1 static AST check (`compile()` + `ast.parse()`), Stage 2 dynamic execution in the sandboxed runner. Emit status (`VERIFIED`, `SYNTAX_PASSED`, `FAILED`, `REGRESSED`, `SYNTAX_ERROR`).
* **Rationale**:
  - Eliminates AI hallucinations and ensures proposed patches never introduce syntax regressions or runtime breakage.
  - Generates line-level change statistics (`+N -M`) for developer inspection.

### Decision 9: Multi-Candidate Model Discovery in Ollama Provider
* **Decision**: Search across candidate model names (`["bug-whisper-qwen25-coder-3b", "pernavjain/bug-whisper-qwen25-coder-3b", "qwen2.5-coder:3b"]`) during inference.
* **Rationale**:
  - Developers pulling the base model via `ollama run qwen2.5-coder:3b` can immediately use neural inference without manual model-name remapping.
  - Automatically upgrades to fine-tuned adapters when available.

### Decision 10: Offline Fallback to Deterministic Heuristics
* **Decision**: When backend or local Ollama is offline or encounters connection failures, smoothly fall back to the deterministic heuristic engine in both CLI and Web Studio.
* **Rationale**:
  - Eliminates blocking error states; users receive an instant, working fix without needing a GPU server running.

### Decision 11: Root Modelfile for 1-Command Ollama Profile Setup
* **Decision**: Provide a root `Modelfile` pinning `temperature=0.0`, `num_predict=768`, and the exact 3-turn ChatML contract.
* **Rationale**:
  - Empowers developers to create `bug-whisper-qwen25-coder-3b` locally in Ollama via `ollama create bug-whisper -f Modelfile` in $< 2\text{ seconds}$ without downloading separate GGUF files.

---

## 2. Technical Discoveries & Model Constraints

1. **Context Window Ceiling (768 Tokens)**:
   - The current fine-tuned model (v1) was trained with `max_length: 768` and pre-filtered to $\le 1800$ characters.
   - *Impact*: Bug Whisper is optimized for focused snippets and functions ($\le 45$ lines of code). For larger files, the system should guide users to test failing functions rather than entire monolithic scripts.
2. **LoRA Attention Target Modules**:
   - `adapter_config.json` targets `q_proj, k_proj, v_proj, o_proj`. MLP projections (`gate_proj, up_proj, down_proj`) were frozen during v1 training.
   - *Note for v2*: Adding MLP projections will further expand deep algorithmic reasoning.
3. **Kaggle T4 Multi-GPU PCIe NCCL Collisions**:
   - On Kaggle dual-T4 instances, bitsandbytes 4-bit DDP over non-NVLink PCIe causes deadlocks. Single-GPU execution via `CUDA_VISIBLE_DEVICES="0"` with Unsloth Triton kernels was 2–3x faster and stable.

---

## 3. Team & Ownership

* **Project**: Bug Whisper
* **Contributors**:
  - Harshit Sharma ([@harshitxdev](https://github.com/harshitxdev) / Kaggle: `harshitxdev`)
  - Pernav Jain ([@pernavjain](https://github.com/pernavjain) / Kaggle: `pernavjain`)
* **Primary Repositories**:
  - Model Hub: `pernavjain/bug-whisper-qwen25-coder-3b`
  - Datasets: `pernavjain/python-errors` & `pernavjain/python-bugs`
