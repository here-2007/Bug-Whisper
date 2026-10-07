# ⚡ Bug Whisper

> **AI-powered Python error debugging studio & developer ecosystem**, powered by a fine-tuned **Qwen 2.5 Coder 3B** model (`bug-whisper-qwen25-coder-3b`).

---

## 🌟 Overview

Bug Whisper pairs deterministic CPython runtime execution with fine-tuned code repair intelligence. Instead of forcing an LLM to simulate a Python interpreter, Bug Whisper leverages:
1. **Deterministic Execution (Pyodide Wasm)**: Safely executes Python code directly inside the user's browser, capturing stdout, stderr, exception types, and exact failing line numbers in 0 ms.
2. **Specialized Code Synthesis (Qwen 2.5 Coder 3B LoRA)**: A 3B-parameter model fine-tuned on real-world Git error commits and tracebacks to output clean, corrected Python code without conversational filler.
3. **Visual Diff Inspection**: Highlights exact line additions and deletions (green/red) with 1-click patch application.
4. **Convex Engineering Aesthetic**: Crafted with a warm cream-paper workspace (`#f6f6f6`), Ink Black dark code frames (`#141414`), hairline borders, and zero drop shadows.

---

## 📖 Project Documentation

* **[design.md](file:///e:/projects/Bug%20whisper/design.md)**: Official design system specification (Convex cream-paper notebook, color tokens, typography scale, code editor card specs, do's & don'ts).
* **[context.md](file:///e:/projects/Bug%20whisper/context.md)**: Model specifications, Kaggle links, LoRA hyperparams, dataset breakdown, and the strict ChatML prompt contract.
* **[memory.md](file:///e:/projects/Bug%20whisper/memory.md)**: Architectural decisions (Pyodide Wasm vs Docker, division of labor, Convex style adoption), technical constraints, and team ownership.
* **[agents.md](file:///e:/projects/Bug%20whisper/agents.md)**: Operating guidelines, code hygiene, and Convex design rules for AI coding assistants.
* **[phases.md](file:///e:/projects/Bug%20whisper/phases.md)**: Milestone roadmap from foundational documentation to the web studio and future CLI/MCP tools.

---

## 🚀 Model Details

* **Base Model**: `unsloth/Qwen2.5-Coder-3B-Instruct-bnb-4bit`
* **Fine-Tuning**: LoRA ($r=16, \alpha=32$, dropout $0.0$, response-only loss)
* **Kaggle Hub**: [`pernavjain/bug-whisper-qwen25-coder-3b`](https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b/)
* **Format**: 4-bit NormalFloat (NF4) BitsAndBytes safetensors (~2.06 GB)
* **Dataset**: [`pernavjain/python-errors`](https://www.kaggle.com/datasets/pernavjain/python-errors) (CommitPack Python diffs + tracebacks)
