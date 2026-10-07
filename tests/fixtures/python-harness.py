# -*- coding: utf-8 -*-
"""
Deterministic Python Execution Harness for Bug Whisper Studio.
Mirrors the embedded Python harness executing inside Pyodide WebWorker.
Takes user Python code from stdin, intercepts stdout/stderr, extracts
exceptions, line numbers, and tracebacks, and outputs structured JSON to stdout.
"""
import sys
import io
import json
import traceback

def execute_code(user_code_str: str) -> dict:
    stdout_buf = io.StringIO()
    stderr_buf = io.StringIO()
    old_stdout = sys.stdout
    old_stderr = sys.stderr

    sys.stdout = stdout_buf
    sys.stderr = stderr_buf

    result = {
        "success": False,
        "stdout": "",
        "stderr": "",
        "errorType": None,
        "errorMessage": None,
        "lineNumber": None,
        "traceback": ""
    }

    try:
        # Tier 1: Compile-time syntax verification
        try:
            compiled_code = compile(user_code_str, "main.py", "exec")
        except SyntaxError as syn_err:
            result["errorType"] = type(syn_err).__name__
            result["errorMessage"] = syn_err.msg or "syntax error"
            result["lineNumber"] = syn_err.lineno
            line_text = (syn_err.text or "").rstrip()
            offset = max(0, (syn_err.offset or 1) - 1)
            lines = [
                '  File "main.py", line %d' % (syn_err.lineno or 0),
                '    %s' % line_text,
                '    %s^' % (' ' * offset),
                '%s: %s' % (type(syn_err).__name__, syn_err.msg)
            ]
            full_tb = "Traceback (most recent call last):\n" + "\n".join(lines)
            result["traceback"] = full_tb
            result["stderr"] = full_tb
            return result

        # Tier 2: Runtime execution in isolated environment
        clean_globals = {
            "__name__": "__main__",
            "__file__": "main.py",
            "__doc__": None,
            "__package__": None,
        }
        exec(compiled_code, clean_globals)

        result["success"] = True
        result["stdout"] = stdout_buf.getvalue()[:50000]
        result["stderr"] = stderr_buf.getvalue()[:50000]

    except Exception as exc:
        result["errorType"] = type(exc).__name__
        result["errorMessage"] = str(exc)
        tb = exc.__traceback__
        frames = traceback.extract_tb(tb)

        # Filter for user script frames (main.py)
        user_frames = [f for f in frames if f.filename == "main.py"]
        target_frame = user_frames[-1] if user_frames else (frames[-1] if frames else None)
        result["lineNumber"] = target_frame.lineno if target_frame else None

        formatted_frames = user_frames if user_frames else frames
        tb_lines = ["Traceback (most recent call last):"]
        for f in formatted_frames:
            tb_lines.append(f'  File "{f.filename}", line {f.lineno}, in {f.name}')
            if f.line:
                tb_lines.append(f'    {f.line}')
        tb_lines.append(f"{type(exc).__name__}: {str(exc)}")
        clean_tb_str = "\n".join(tb_lines)

        captured_stderr = stderr_buf.getvalue()
        result["traceback"] = clean_tb_str
        result["stderr"] = (captured_stderr + "\n" + clean_tb_str).strip() if captured_stderr else clean_tb_str
        result["stdout"] = stdout_buf.getvalue()[:50000]

    finally:
        sys.stdout = old_stdout
        sys.stderr = old_stderr

    return result

if __name__ == "__main__":
    try:
        user_code = sys.stdin.read()
        res = execute_code(user_code)
        print(json.dumps(res, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "stdout": "",
            "stderr": str(e),
            "errorType": "HarnessInternalError",
            "errorMessage": str(e),
            "lineNumber": None,
            "traceback": ""
        }))
