#!/usr/bin/env python3
"""
Bug Whisper PyPI Distribution & Upload Script.

Usage:
    python scripts/publish_to_pypi.py [--build-only] [--testpypi]

Prerequisites:
    1. Register at https://pypi.org/ (or https://test.pypi.org/)
    2. Create an API token at https://pypi.org/manage/account/token/
    3. Install twine: pip install twine
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path


def main():
    root = Path(__file__).resolve().parent.parent
    dist_dir = root / "dist_pypi"

    print("==================================================")
    print("  Bug Whisper PyPI Distribution Builder")
    print("==================================================")

    # 1. Clean previous build artifacts
    if dist_dir.exists():
        print(f"Cleaning previous build at {dist_dir}...")
        shutil.rmtree(dist_dir)
    dist_dir.mkdir(parents=True, exist_ok=True)

    # 2. Build sdist and wheel using setup.py
    print("\nBuilding source distribution (sdist) and binary wheel (bdist_wheel)...")
    cmd_build = [
        sys.executable,
        "setup.py",
        "bdist_wheel",
        "--dist-dir",
        str(dist_dir),
        "sdist",
        "--dist-dir",
        str(dist_dir),
    ]
    res = subprocess.run(cmd_build, cwd=root)
    if res.returncode != 0:
        print("ERROR: Package build failed.")
        sys.exit(1)

    print("\nBuilt distribution artifacts in dist_pypi/:")
    for f in dist_dir.iterdir():
        print(f"  • {f.name} ({f.stat().st_size:,} bytes)")

    if "--build-only" in sys.argv:
        print("\nBuild complete. Skipping upload (--build-only specified).")
        return

    # 3. Check distribution with twine if available
    try:
        import twine  # noqa: F401
    except ImportError:
        print("\nNote: 'twine' is not installed in the current environment.")
        print("To install twine: pip install twine")
        print("To upload artifacts manually to PyPI, run:")
        print(f"    twine upload {dist_dir}/*")
        print("\nCredentials:")
        print("    Username: __token__")
        print("    Password: <your_pypi_token_starting_with_pypi->")
        return

    # Check artifacts with twine check
    print("\nVerifying artifacts with twine check...")
    subprocess.run([sys.executable, "-m", "twine", "check", f"{dist_dir}/*"], cwd=root)

    use_testpypi = "--testpypi" in sys.argv
    repo_flag = ["--repository", "testpypi"] if use_testpypi else []
    target_name = "TestPyPI" if use_testpypi else "PyPI"

    print(f"\nReady to upload to {target_name}.")
    print("Run:")
    if use_testpypi:
        print(f"    python -m twine upload --repository testpypi dist_pypi/*")
    else:
        print("    python -m twine upload dist_pypi/*")
    print("\nWhen prompted:")
    print("    Username: __token__")
    print("    Password: your API token (starts with pypi-...)")


if __name__ == "__main__":
    main()
