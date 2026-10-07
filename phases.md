# Project Phases & Roadmap: Bug Whisper

This document tracks the phased development milestones for the Bug Whisper project, outlining concrete deliverables, technical tasks, and acceptance criteria based on the Convex engineering notebook design system ([design.md](file:///e:/projects/Bug%20whisper/design.md)).

---

## Roadmap Overview

```text
Phase 1: Project Foundation & Architecture Docs       [COMPLETE]
Phase 2: Project Scaffolding & Convex Design Setup    [NEXT]
Phase 3: Monaco Editor & Terminal HUD (Convex Tokens)
Phase 4: Traceback Extractor & Side-by-Side Diff Engine
Phase 5: Multi-Provider Inference & Bug Preset Library
Phase 6: Top Navigation, Polish & Production Build
Phase 7: Future Expansion (VS Code CLI & MCP Agent Tools)
```

---

## Phase 1: Foundational Architecture & Memory
*Objective: Lock in domain context, training distribution rules, and design specifications.*

- [x] Create [context.md](file:///e:/projects/Bug%20whisper/context.md) (Model specifications, LoRA hyperparams, dataset provenance, ChatML prompt contract).
- [x] Create [memory.md](file:///e:/projects/Bug%20whisper/memory.md) (Persistent decision log, trade-offs, Convex style adoption).
- [x] Create [agents.md](file:///e:/projects/Bug%20whisper/agents.md) (Operational guidelines for AI agents, Convex design system directives, zero-shadow rules).
- [x] Create [phases.md](file:///e:/projects/Bug%20whisper/phases.md) (Phased execution milestones aligned with design tokens).
- [x] Create [README.md](file:///e:/projects/Bug%20whisper/README.md) (Project overview and quick-start guide).

---

## Phase 2: Project Scaffolding & Convex Design System Setup
*Objective: Configure Tailwind CSS with the Convex palette, typography scale, and initialize Pyodide.*

- [ ] Install styling dependencies: Tailwind CSS, Lucide Icons, clsx, tailwind-merge.
- [ ] Configure Convex tokens in `tailwind.config.ts` / CSS `@theme`:
  - Canvas: Cream Surface (`#f6f6f6`), Lilac Wash (`#f7f1ff`).
  - Cards: Paper White (`#ffffff`), Ink Black (`#141414`), Charcoal (`#292929`).
  - Dividers: Mist Divider (`#e5e5e5`), Graphite Border (`#38383a`).
  - Accents: Signal Blue (`#69bee2`), Ember Orange (`#de5d33`).
  - Strict zero-shadow enforcement (`box-shadow: none`).
- [ ] Configure typography: Inter (GT America alternative) with tight optical tracking (`-0.05em` on display, `-0.025em` on headings) and JetBrains Mono for code.
- [ ] Implement `pyodide-worker.ts`:
  - Load Pyodide 0.26+ in a dedicated WebWorker.
  - Redirect `sys.stdout` and `sys.stderr` to string buffers.
  - Intercept uncaught exceptions with execution timeout (3s).
- [ ] Create `pyodide-client.ts` React hook for async worker communication.

---

## Phase 3: Monaco Editor & Terminal HUD (Convex Styled)
*Objective: Build the code input card strictly matching the Convex Code Editor Card specification.*

- [ ] Integrate `@monaco-editor/react` with custom theme definitions:
  - Editor background: Ink Black `#141414`.
  - Syntax colors: Pink `#fc618d` keywords, Violet `#948ae3` types, Mint `#7bd88f` booleans, Yellow `#f8e67a` constants, Lavender `#e3d0df` strings, Fog `#6d6d70` comments.
- [ ] Implement the Code Editor Card frame:
  - 12px radius, 1px `#38383a` graphite border.
  - Three macOS traffic-light dots (`#fc618d`, `#f8e67a`, `#7bd88f`) top-left.
  - 32px height tab header in Charcoal `#292929` showing active file name (`main.py`).
  - Keyboard shortcut handler (`Ctrl+Enter` / `Cmd+Enter` to run).
- [ ] Implement `TerminalPanel.tsx`:
  - Terminal card matching the code editor dark frame (`#141414`).
  - Clean green output on success (`#7bd88f`).
  - High-contrast red/amber traceback formatting on crash with clickable line jump.

---

## Phase 4: Traceback Extractor & Side-by-Side Diff Engine
*Objective: Deterministically extract error metadata and render code remediations.*

- [ ] Implement `traceback.ts`:
  - Extract exception class (`IndexError`, `TypeError`, `KeyError`, `SyntaxError`).
  - Extract line number, file name, and error message.
- [ ] Implement `DiffPanel.tsx`:
  - Monaco Diff Editor wrapped in the Convex dark code card frame.
  - Red strikethrough for deleted lines, green highlight for added lines.
  - "Accept Fix" button (White filled button `#ffffff` with `#141414` text, 8px radius, on light canvas).
  - "Copy Fixed Code" and "Copy Diff" buttons.

---

## Phase 5: Multi-Provider Inference & Bug Preset Library
*Objective: Connect the SFT prompt builder to multiple inference endpoints.*

- [ ] Implement `prompt.ts`:
  - Formats user code and captured stderr into the exact 3-turn ChatML prompt required by `bug-whisper-qwen25-coder-3b`.
- [ ] Implement `inference.ts` supporting 4 modes:
  1. **Interactive Mock Engine (Default)**: Instant, zero-latency fixes for presets and standard error heuristics.
  2. **Local Ollama**: Streaming endpoint for `http://localhost:11434`.
  3. **Hugging Face Hub**: Hosted API calling model repo with user token.
  4. **Custom OpenAI/vLLM Endpoint**: Generic OpenAI-compatible chat completion caller.
- [ ] Implement `presets.ts` and `BugPresets.tsx`:
  - 1-click test cards for 7 classic Python bugs styled as Convex feature chips (4px radius tags).

---

## Phase 6: Top Navigation, Polish & Production Build
*Objective: Deliver the persistent Convex header and verify the full application.*

- [ ] Implement `Navbar.tsx` conforming to Convex Top Navigation Bar:
  - Height 64px, White `#ffffff` background, 1px hairline `#e5e5e5` bottom border.
  - Bug Whisper wordmark in GT America / Inter bold with tight tracking.
  - GitHub Stars Pill (`#292929` dark fill, 8px radius, white star count).
  - Kaggle model badge link to `pernavjain/bug-whisper-qwen25-coder-3b`.
  - Settings drawer toggle.
- [ ] Implement `SettingsDrawer.tsx` for backend provider switching.
- [ ] Verify production build (`npm run build`) with zero TypeScript or linting errors.

---

## Phase 7: Future Expansion (CLI & AI Agent Integration)
*Objective: Extend Bug Whisper into the terminal and agent ecosystems.*

- [ ] Build `packages/bugwhisper-core`:
  - `bugwhisper run script.py` CLI runner with automatic crash interception.
  - Interactive terminal diff prompt (`[a]ccept / [d]iff / [r]e-run`).
  - Global `sys.excepthook` auto-interceptor for zero-command debugging.
- [ ] Build standard Model Context Protocol (MCP) server:
  - Expose `bug_whisper_fix` tool for Antigravity, Codex, and Cursor.
