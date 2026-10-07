"""
Bug Whisper Zero-Config Auto-Hook.
Importing this module immediately activates the exception hook.
Usage:
    import bugwhisper.auto
"""

from bugwhisper.cli.auto_hook import install_auto_hook

install_auto_hook()
