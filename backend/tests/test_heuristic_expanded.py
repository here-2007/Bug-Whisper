"""
Unit tests for expanded heuristic remediation rules.
"""

import pytest
from bugwhisper.inference.heuristic_provider import HeuristicProvider

provider = HeuristicProvider()


@pytest.mark.asyncio
async def test_heuristic_modulo_zero():
    code = "rem = 10 % 0\nprint(rem)\n"
    stderr = 'File "main.py", line 1, in <module>\nZeroDivisionError: integer modulo by zero'
    res = await provider.generate_fix(code, stderr)
    assert res.success
    assert "rem = (10 % 0) if 0 != 0 else 0" in res.fixed_code


@pytest.mark.asyncio
async def test_heuristic_unclosed_parenthesis():
    code = "print('hello'\n"
    stderr = 'File "main.py", line 1\nSyntaxError: \'(\' was never closed'
    res = await provider.generate_fix(code, stderr)
    assert res.success
    assert res.fixed_code.strip() == "print('hello')"


@pytest.mark.asyncio
async def test_heuristic_key_error():
    code = "config = {}\nval = config['database_url']\n"
    stderr = 'File "main.py", line 2, in <module>\nKeyError: \'database_url\''
    res = await provider.generate_fix(code, stderr)
    assert res.success
    assert "config.get('database_url')" in res.fixed_code


@pytest.mark.asyncio
async def test_heuristic_name_error_stdlib_import():
    code = "print(math.sqrt(16))\n"
    stderr = 'File "main.py", line 1, in <module>\nNameError: name \'math\' is not defined'
    res = await provider.generate_fix(code, stderr)
    assert res.success
    assert "import math" in res.fixed_code
    assert "print(math.sqrt(16))" in res.fixed_code


@pytest.mark.asyncio
async def test_heuristic_index_error():
    code = "items = []\nx = items[0]\n"
    stderr = 'File "main.py", line 2, in <module>\nIndexError: list index out of range'
    res = await provider.generate_fix(code, stderr)
    assert res.success
    assert "(items[0] if len(items) > 0 else None)" in res.fixed_code


@pytest.mark.asyncio
async def test_heuristic_type_error_concat():
    code = "msg = 'Count: ' + total\n"
    stderr = 'File "main.py", line 1, in <module>\nTypeError: can only concatenate str (not "int") to str'
    res = await provider.generate_fix(code, stderr)
    assert res.success
    assert "str(total)" in res.fixed_code
