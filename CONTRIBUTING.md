# Contributing to Bug Whisper

Thank you for contributing to Bug Whisper! This document provides instructions for setting up your development environment, testing code changes, and adhering to architectural and design standards.

---

## 1. Development Environment Setup

### Prerequisites
- Python 3.9+ (Python 3.11 recommended)
- Node.js 18+ (Node 20+ recommended)
- Git

### Backend Setup (Python)
```bash
# Clone the repository
git clone https://github.com/harshitthek/bug-whisper.git
cd bug-whisper

# Create and activate a virtual environment
python -m venv .venv
# Linux/macOS:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

# Install Bug Whisper in editable mode with development & testing dependencies
pip install -e ".[all]"
```

### Frontend Studio Setup (TypeScript / React)
```bash
# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 2. Architecture & Design Principles

All contributions must respect Bug Whisper's core engineering constraints:

1. **Deterministic First, Heuristic Second**:
   - Never use an LLM for operations that can be performed deterministically.
   - Syntax validation, traceback line extraction, exception categorization, and patch diff generation must execute via standard CPython/Pyodide libraries.
2. **Strict 3-Turn ChatML Prompt Alignment**:
   - Model synthesis prompts must adhere strictly to the format defined in `context.md`.
   - Never request conversational explanations or markdown filler from the model.
3. **Cream Paper Engineering Notebook Design (Frontend)**:
   - **Zero Drop Shadows**: Never add `box-shadow` or Tailwind `shadow-*` utility classes. Visual depth is achieved strictly through surface contrast and hairline 1px borders (`#38383a` / `#e5e5e5`).
   - **Component Sizing**: Keep presentational and stateful components under 150 lines of code (<150 LOC) with clean separation of concerns.
   - **Maximum Radius**: Border radii are strictly capped at 16px (`rounded-xl` for cards, `rounded-lg` for buttons, `rounded` for inputs/chips).

---

## 3. Testing & Verification

Before submitting any Pull Request, ensure all test suites pass with zero warnings:

### Run Backend Tests (Pytest)
```bash
pytest backend/tests/ -v
```
All 93 backend unit and integration tests must pass.

### Run Frontend Linter & Tests
```bash
# Run oxlint linter
npm run lint

# Run 4-Tier test suite
npm test

# Verify production bundle
npm run build
```
All 82 frontend test cases must pass, and the Vite production bundle must build with zero errors.

---

## 4. Git & Code Hygiene

- **Conventional Commits**: Commit messages must follow conventional commits with past-tense declarative statements:
  - `feat: implement kaggle model loader with automatic cache resolution`
  - `fix: prevent monaco editor from consuming browser wheel scroll`
  - `docs: update pypi installation commands in readme`
- **POSIX Trailing Newlines**: Every file must end with a single trailing newline (`\n`).
- **Clean Diffs**: Avoid committing generated directories (`dist/`, `dist_pypi/`, `build/`, `*.egg-info/`, `.pytest_cache/`).

---

## 5. Submitting a Pull Request

1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Commit your changes following the conventions described above.
3. Push to your branch and open a Pull Request against `master`.
4. GitHub Actions CI will automatically test your changes across Python 3.9 through 3.12 and run the frontend test suite.
