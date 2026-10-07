"""
Unit tests for Python code extractor.
"""

from bugwhisper.core.code_extractor import extract_python_code


def test_extract_from_clean_markdown_fence():
    raw = """Here is the fix:
```python
def add(a, b):
    return a + b
```
Hope this helps!"""
    code = extract_python_code(raw)
    assert code == "def add(a, b):\n    return a + b\n"


def test_extract_with_chatml_tokens():
    raw = """```python
def multiply(x, y):
    return x * y
```<|im_end|>"""
    code = extract_python_code(raw)
    assert code == "def multiply(x, y):\n    return x * y\n"


def test_extract_unclosed_fence():
    raw = """```python
def greet(name):
    return f"Hello {name}"
"""
    code = extract_python_code(raw)
    assert code == "def greet(name):\n    return f\"Hello {name}\"\n"


def test_extract_raw_code_without_fences():
    raw = """def square(n):
    return n * n
"""
    code = extract_python_code(raw)
    assert code == "def square(n):\n    return n * n\n"
