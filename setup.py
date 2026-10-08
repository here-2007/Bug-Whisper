"""
Setup script for Bug Whisper package distribution.
Configured via pyproject.toml and setuptools.
"""

from setuptools import setup, find_packages

setup(
    packages=find_packages(exclude=["tests*"]),
)
