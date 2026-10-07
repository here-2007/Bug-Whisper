"""
Bug Whisper CLI execution entrypoint.
Enables `python -m bugwhisper` execution.
"""

from bugwhisper.cli.main import app

if __name__ == "__main__":
    app()
