# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-10-08

### Added
- **PyPI Release (`bugwhisper`)**: Standard PEP 517 / PEP 621 packaging with `pip install bugwhisper` and optional extras (`kaggle`, `hf`, `all`, `test`).
- **Developer CLI (`bugwhisper`)**: Terminal interface supporting `check`, `run`, `env`, `model`, and `serve` commands.
- **Kaggle Hub Integration**: `KaggleProvider` utilizing `kagglehub.model_download()` for fine-tuned weights (`pernavjain/bug-whisper-qwen25-coder-3b`).
- **Interactive Web Studio**: React 19 web playground with dual Monaco editors and side-by-side diff comparison.
- **Pyodide WebWorker Sandbox**: Client-side CPython 3.12 WebAssembly execution running in dedicated web workers with strict 3-second timeout watchdog.
- **Dual-Mode Traceback Parser**: High-precision stack frame extractor handling both standard runtime exceptions and compile-time syntax errors.
- **Zero-Config Auto-Hook**: `bugwhisper.auto` interceptor that displays interactive terminal diff proposals on unhandled exceptions.
- **Two-Stage Verification**: Static AST parsing (`compile()`) followed by isolated runtime re-execution to prevent regressions.
- **FastAPI REST Service**: Endpoints for sandbox execution (`/api/execute`), synthesis (`/api/synthesize`), repair (`/api/repair`), and token streaming (`/api/stream`).
- **CI/CD Workflows**: Automated GitHub Actions testing across Python 3.9–3.12 and automated PyPI publication on release tags.

### Fixed
- **Monaco Wheel Scroll Trapping**: Configured `scrollbar.alwaysConsumeMouseWheel: false` in Monaco editor to restore smooth full-page browser scrolling.
- **Playground Responsive Layout**: Replaced fixed height constraints with responsive min-heights (`min-h-[560px] lg:h-[560px]`) preventing overflow clipping in stacked views.
- **Upstream Deprecations**: Suppressed Click 8.5+ `get_binary_stream` deprecation warnings in Typer CLI and pytest test runs.
- **Setuptools License Format**: Upgraded `pyproject.toml` to PEP 639 SPDX license expression (`license = "Apache-2.0"`).
- **Vite Native Config Loader**: Updated `vite.config.ts` to `import.meta.dirname`.
