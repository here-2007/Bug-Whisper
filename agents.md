# AI Agents Guidelines: Bug Whisper

This document defines the operational directives, architectural constraints, and code hygiene rules for any AI agent (Antigravity, Codex, Cursor, Claude) reading or modifying this repository.

---

## 1. Core Operating Principles

1. **Deterministic First, Heuristic Second**:
   - Never use an LLM for tasks that can be performed deterministically.
   - Python syntax checking, line number extraction, error classifications, and diff generation must always be executed by CPython/Pyodide and standard libraries (`traceback`, `difflib`).
   - Reserve LLM inference exclusively for code synthesis and bug resolution.
2. **Preserve Model Distribution Alignment**:
   - When constructing prompts for `bug-whisper-qwen25-coder-3b`, strictly uphold the 3-turn ChatML template defined in [context.md](file:///e:/projects/Bug%20whisper/context.md).
   - Do NOT modify the system prompt or request conversational explanations from the model.
3. **Zero AI-Signaling & Anti-Slop**:
   - Avoid conversational filler in generated artifacts and commits.
   - Do not add gratuitous emojis, generic marketing prose, or apologetic commentary.
   - Keep comments concise, technical, and focused on non-obvious engineering decisions.

---

## 2. Frontend & Design System Directives (Convex Engineering Notebook)

All frontend components must strictly adhere to the design system defined in [design.md](file:///e:/projects/Bug%20whisper/design.md):

* **Aesthetic**: Cream paper engineering notebook — flat, high-density, blueprint-like aesthetic.
* **Canvas & Surfaces**:
  - Page Canvas: Cream Surface (`#f6f6f6`) — default background.
  - Elevated Cards / Light Surfaces: Paper White (`#ffffff`) with hairline 1px Mist Divider (`#e5e5e5`).
  - Dark Code Surfaces: Ink Black (`#141414`) with 1px Graphite Border (`#38383a`).
  - Secondary Dark / Frames: Charcoal Surface (`#292929`).
  - Full-Bleed Dark Sections: Dusk Gradient (`linear-gradient(135deg, rgb(34, 31, 29), rgb(49, 43, 43) 28%, rgba(41, 57, 105, 0.9) 50%)`).
* **Zero Drop Shadows**:
  - **CRITICAL**: Never add drop shadows (`box-shadow`, `shadow-md`, `shadow-lg`) to cards, buttons, or inputs. All separation must come strictly from surface color contrast and 1px hairline borders.
* **Radii Constraints**:
  - Buttons: `8px` (`rounded-lg`).
  - Cards & Navigation Pills: `12px` (`rounded-xl`).
  - Tags, chips, input fields: `4px` (`rounded`).
  - Maximum allowed radius anywhere: `16px`.
* **Typography**:
  - UI & Headings: Inter / GT America grotesque with tight optical tracking (`-0.05em` on display, `-0.025em` on headings, `+0.05em` on uppercase eyebrows).
  - Code & Monospace: JetBrains Mono / IBM Plex Mono at `13px`, line-height `1.4`.
* **Code Editor Framing**:
  - Code cards must feature three macOS-style traffic-light dots (`#fc618d`, `#f8e67a`, `#7bd88f`) top-left.
  - Tab header bar at `32px` height with `#292929` fill.
  - Editor interior at `#141414`.
* **Pyodide WebWorker Threading**:
  - **CRITICAL**: Never load or execute Pyodide directly on the main UI thread.
  - Pyodide must run inside a dedicated WebWorker (`pyodide-worker.ts`) communicating via postMessage to prevent browser tab freezes during Python execution.
* **Component Size & Modularity**:
  - Favor focused micro-components (<150 LOC) with clear separation between stateful containers and presentational views.

---

## 3. Git & Hygiene Standards

* **Short status check**: Always run `git status --short` before and after operations.
* **Trailing Newlines**: All files must end with a POSIX trailing newline (`\n`).
* **Clean Commits**: Commit messages must follow conventional commits with past-tense declarative statements (e.g., `feat: implement pyodide web worker with traceback interceptor`).
