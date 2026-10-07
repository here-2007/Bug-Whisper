"""
Unit tests for automatic sys.excepthook interceptor.
"""

import sys
from bugwhisper.cli.auto_hook import (
    exception_handler,
    install_auto_hook,
    uninstall_auto_hook,
)


def test_install_and_uninstall_auto_hook():
    orig_hook = sys.excepthook
    try:
        install_auto_hook()
        assert sys.excepthook == exception_handler
    finally:
        uninstall_auto_hook()
        assert sys.excepthook == orig_hook


def test_exception_handler_graceful_handling():
    # Calling exception_handler directly should not raise any uncaught exceptions
    try:
        raise ZeroDivisionError("division by zero")
    except ZeroDivisionError:
        exc_type, exc_val, exc_tb = sys.exc_info()
        # Should execute safely without raising
        exception_handler(exc_type, exc_val, exc_tb)
