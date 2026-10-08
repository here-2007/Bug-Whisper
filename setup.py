"""
Setup script for Bug Whisper package distribution.
Configured via pyproject.toml and setuptools.
"""

from setuptools import setup, find_packages

setup(
    package_dir={"": "backend"},
    packages=find_packages(where="backend", include=["bugwhisper*"]),
)
