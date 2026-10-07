# Bug Whisper: Model Serving & Integration Guide

This guide details the fine-tuned **Qwen 2.5 Coder 3B** model (`bug-whisper-qwen25-coder-3b`), its training provenance, inference contracts, and deployment workflows across **Ollama**, **vLLM**, **Hugging Face**, and **Deterministic Heuristic Mode**.

---

## 1. Model Overview & Provenance

* **Model Hub**: [Kaggle Hub — `pernavjain/bug-whisper-qwen25-coder-3b`](https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b/)
* **Authors**: Pernav Jain ([@pernavjain](https://github.com/pernavjain)) & Harshit Sharma ([@harshitxdev](https://github.com/harshitxdev))
* **Base Architecture**: `unsloth/Qwen2.5-Coder-3B-Instruct-bnb-4bit` (derived from `Qwen/Qwen2.5-Coder-3B-Instruct`)
* **License**: Apache 2.0
* **Format**: 4-bit NormalFloat (NF4) BitsAndBytes safetensors (~2.06 GB)
* **LoRA Target Modules**: `["q_proj", "k_proj", "v_proj", "o_proj"]` ($r=16, \alpha=32$, dropout $0.0$, scaling factor $2.0$)
* **Training Dataset**: [`pernavjain/python-errors`](https://www.kaggle.com/datasets/pernavjain/python-errors) (real Git commits resolving Python errors paired with `stderr` tracebacks)
* **Loss Masking**: `train_on_responses_only: true` (loss evaluated strictly on assistant code completions)
* **Maximum Sequence Length**: 768 tokens ($\le 1,800$ characters old code + new code + error header)

---

## 2. Serving Strategies

Bug Whisper supports four serving strategies tailored for local development, production GPU clusters, and zero-dependency testing.

```
                    ┌──────────────────────────────────────────────┐
                    │               Inference Manager              │
                    └──────────────────────┬───────────────────────┘
                                           │
         ┌───────────────────┬─────────────┴───────┬────────────────────┐
         ▼                   ▼                     ▼                    ▼
┌──────────────────┐ ┌────────────────┐ ┌────────────────────┐ ┌──────────────────┐
│   Local Ollama   │ │   vLLM / TGI   │ │  Hugging Face Hub  │ │   Deterministic  │
│  (:11434/api)    │ │   (:8000/v1)   │ │  (Inference API)   │ │  Heuristics (0MB)│
└──────────────────┘ └────────────────┘ └────────────────────┘ └──────────────────┘
```

---

### Strategy A: Local Ollama (Recommended for Local Dev)

Ollama provides quantized, cross-platform GPU/CPU inference without Python package conflicts.

#### 1. Instant Run (Base Model)
Bug Whisper automatically discovers and routes to `qwen2.5-coder:3b`:
```bash
ollama run qwen2.5-coder:3b
```

#### 2. Fine-Tuned ChatML Profile (Using Root `Modelfile`)
To configure the exact 0.0 temperature, 768 token ceiling, and ChatML system prompt matching the fine-tuning contract:
```bash
# From repository root
ollama create bug-whisper-qwen25-coder-3b -f Modelfile
```

#### 3. Inspecting Ollama Status via CLI
```bash
bugwhisper model
```
Output:
```text
Local Ollama instance is active at http://localhost:11434
Available models:
  • bug-whisper-qwen25-coder-3b (compatible with Bug Whisper)
  • qwen2.5-coder:3b (compatible with Bug Whisper)
```

---

### Strategy B: vLLM / OpenAI-Compatible Server (High-Throughput GPU)

For Linux/CUDA environments with NVIDIA GPUs (Ampere / Ada / Hopper / T4):

```bash
# Serve base Qwen 2.5 Coder 3B with LoRA adapter
vllm serve Qwen/Qwen2.5-Coder-3B-Instruct \
  --enable-lora \
  --lora-modules bug-whisper=pernavjain/bug-whisper-qwen25-coder-3b \
  --max-model-len 2048 \
  --host 0.0.0.0 \
  --port 8000
```

Configure Bug Whisper backend:
```bash
export BUGWHISPER_PROVIDER=openai
export OPENAI_BASE_URL="http://localhost:8000/v1"
export OPENAI_MODEL="bug-whisper"
```

---

### Strategy C: Python Transformers / Unsloth Inference

To run direct inference with Python and PyTorch:

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

base_model_name = "Qwen/Qwen2.5-Coder-3B-Instruct"
adapter_name = "pernavjain/bug-whisper-qwen25-coder-3b"

tokenizer = AutoTokenizer.from_pretrained(base_model_name)
base_model = AutoModelForCausalLM.from_pretrained(
    base_model_name,
    torch_dtype=torch.float16,
    device_map="auto",
)
model = PeftModel.from_pretrained(base_model, adapter_name)
model.eval()

prompt = """<|im_start|>system
You are an expert Python bug-fixing assistant. Fix all errors in the provided code and return only the corrected Python code.<|im_end|>
<|im_start|>user
Fix the bug in this Python code:

```python
def get_user(users, index):
    return users[index]
```

Error output:
```
IndexError: list index out of range
```<|im_end|>
<|im_start|>assistant
"""

inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
with torch.no_grad():
    outputs = model.generate(
        **inputs,
        max_new_tokens=768,
        temperature=0.0,
        do_sample=False,
    )
print(tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True))
```

---

### Strategy D: Deterministic Heuristic Fallback (Zero Weights / 0 MB)

When Ollama or remote GPU servers are not running, Bug Whisper automatically activates the **Deterministic Heuristic Engine**:
* Employs AST static analysis and exception classification (`IndexError`, `KeyError`, `ZeroDivisionError`, `TypeError`, `AttributeError`, `UnboundLocalError`).
* Resolves standard error patterns deterministically in $< 1\text{ ms}$.
* Validates patches through two-stage AST compilation and dynamic execution.
* Requires zero GPU, zero disk download, and zero external network calls.

---

## 3. Strict ChatML Prompt Contract

To preserve alignment with the fine-tuned LoRA weights, prompts must strictly follow the 3-turn ChatML format:

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

### Critical Prompting Rules
1. **Never ask for conversational explanations**: The model was trained with `train_on_responses_only: true` strictly on corrected code blocks. Requesting prose degrades output quality.
2. **Slice `stderr` to 300 characters**: Preserves token budget for actual Python syntax.
3. **Focal Windowing for large scripts**: For files $> 1,200$ characters, the engine extracts $\pm 15$ lines surrounding the error frame to ensure the token budget stays under 768 tokens.
4. **Sampling parameters**: Always use `temperature=0.0` (greedy decoding) for deterministic, reproducible fixes.

---

## 4. Environment Variables Reference

| Variable | Default | Purpose |
|---|---|---|
| `BUGWHISPER_PROVIDER` | `ollama` | Active provider: `ollama`, `openai`, `vllm`, `heuristic` |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Endpoint for local Ollama service |
| `OLLAMA_MODEL` | `bug-whisper-qwen25-coder-3b` | Target Ollama model name |
| `OPENAI_BASE_URL` | `http://localhost:8000/v1` | Base URL for vLLM or OpenAI-compatible server |
| `OPENAI_MODEL` | `bug-whisper-qwen25-coder-3b` | Target model name on remote server |
| `OPENAI_API_KEY` | `""` | Optional authorization key for remote endpoint |
| `BUGWHISPER_TIMEOUT` | `3.0` | Execution timeout (seconds) for dynamic runner |
