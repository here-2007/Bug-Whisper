# Project Context: Bug Whisper

Bug Whisper is an AI-powered Python code remediation studio and developer ecosystem powered by a fine-tuned **Qwen 2.5 Coder 3B** model (`bug-whisper-qwen25-coder-3b`).

---

## 1. Core Model & Artifact Provenance

* **Model Hub**: [kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b](https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b/)
* **Model ID**: `768372` | Author: Pernav Jain (`pernavjain`) & Harshit Sharma (`harshitxdev`)
* **Base Model**: `unsloth/Qwen2.5-Coder-3B-Instruct-bnb-4bit` (derived from `Qwen/Qwen2.5-Coder-3B-Instruct`)
* **Kaggle Variation**: `PyTorch/4bit-bnb` (Version 1, Apache 2.0 license)
  - `model-00001-of-00002.safetensors` (~1.99 GB)
  - `model-00002-of-00002.safetensors` (~63 MB)
  - `config.json`, `generation_config.json`, `chat_template.jinja`, `tokenizer.json`
* **LoRA Weights Dataset**: `pernavjain/python-bugs` on Kaggle
  - `adapter_model.safetensors` (~29.5 MB)
  - `adapter_config.json`
* **Training Dataset**: `pernavjain/python-errors` on Kaggle
  - Source: `commitspack.jsonl` (54.8 MB uncompressed)
  - Real Git commits resolving Python errors paired with `stderr` tracebacks.

---

## 2. LoRA Training Specifications

* **Task**: SFT (Supervised Fine-Tuning) via `soup-cli` with `unsloth` backend and Hugging Face `TRL`.
* **LoRA Hyperparameters**:
  - Rank ($r$): `16`
  - Alpha ($\alpha$): `32` (Scaling factor $\alpha / r = 2.0$)
  - Dropout: `0.0` (preserves 100% Unsloth fused Triton/CUDA kernels)
  - Target Modules: `["q_proj", "k_proj", "v_proj", "o_proj"]`
  - Trainable parameters: ~14.7M (0.48% of the 3B base model)
* **Training Profile**:
  - Batch size 8, gradient accumulation 2 (Effective batch size = 16)
  - Learning rate: $2 \times 10^{-4}$ with cosine decay schedule and 5% warmup
  - Epochs: 1 (584 total steps across 9,340 filtered samples; prevented catastrophic forgetting)
  - Loss Masking: `train_on_responses_only: true` (loss was calculated strictly on assistant code fixes).
* **Length Filtering**:
  - Filter rule: `(len(old) + len(new) + len(err[:300])) <= 1800` (~720 tokens).
  - Aligned strictly with `max_length: 768` to eliminate mid-token truncation.

---

## 3. Strict ChatML Prompt Contract

To achieve maximum accuracy from the fine-tuned LoRA weights, prompts must strictly follow the 3-turn ChatML format used during training:

```text
<|im_start|>system
You are an expert Python bug-fixing assistant. Fix all errors in the provided code and return only the corrected Python code.<|im_end|>
<|im_start|>user
Fix the bug in this Python code:

```python
{code}
```

Error output:
```
{stderr[:300]}
```<|im_end|>
<|im_start|>assistant
```python
{corrected_code}
```<|im_end|>
```

---

## 4. Architectural Division of Labor

The system is built on a strict separation of concerns:

1. **Python Interpreter (Pyodide Wasm / CPython)**:
   - Responsible for deterministic execution, output buffering, and exception detection.
   - Extracts traceback, offending file, line number, exception type (`IndexError`, `TypeError`), and message in 0 ms.
2. **Qwen 2.5 Coder 3B (`bug-whisper`)**:
   - Responsible strictly for code synthesis and bug resolution.
   - Takes `{ code, stderr }` and outputs the clean corrected Python code.
3. **Diff Engine (Monaco Diff / difflib)**:
   - Responsible for calculating and visually presenting side-by-side or unified additions and deletions.
