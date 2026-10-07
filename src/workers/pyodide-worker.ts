import { loadPyodide, type PyodideInterface } from 'pyodide';
import type {
  WorkerInboundMessage,
  WorkerOutboundMessage,
  ExecutionResult,
} from '../types/pyodide';

const PYTHON_HARNESS = `
import sys
import io
import json
import traceback

def __bug_whisper_execute__(user_code_str):
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
        # Tier 1: Static syntax verification
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
            full_tb = "Traceback (most recent call last):\\n" + "\\n".join(lines)
            result["traceback"] = full_tb
            result["stderr"] = full_tb
            return json.dumps(result)

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

    except SystemExit as se:
        exit_code = se.code if hasattr(se, 'code') else None
        if exit_code == 0 or exit_code is None:
            result["success"] = True
        else:
            result["errorType"] = "SystemExit"
            result["errorMessage"] = f"sys.exit({exit_code})"
            result["stderr"] = f"SystemExit: {exit_code}"
            result["traceback"] = f"SystemExit: {exit_code}"
            result["lineNumber"] = None
        result["stdout"] = stdout_buf.getvalue()[:50000]

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
        clean_tb_str = "\\n".join(tb_lines)

        captured_stderr = stderr_buf.getvalue()
        result["traceback"] = clean_tb_str
        result["stderr"] = (captured_stderr + "\\n" + clean_tb_str).strip() if captured_stderr else clean_tb_str
        result["stdout"] = stdout_buf.getvalue()[:50000]

    finally:
        sys.stdout = old_stdout
        sys.stderr = old_stderr

    return json.dumps(result)
`;

let pyodideInstance: PyodideInterface | null = null;
let initPromise: Promise<PyodideInterface> | null = null;

function postMessageToMain(msg: WorkerOutboundMessage): void {
  self.postMessage(msg);
}

async function initHarness(py: PyodideInterface): Promise<void> {
  await py.runPythonAsync(PYTHON_HARNESS);
}

async function getPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) {
    return pyodideInstance;
  }
  if (initPromise) {
    return initPromise;
  }

  postMessageToMain({
    type: 'STATUS',
    status: 'loading',
    message: 'Loading Pyodide Wasm runtime...',
  });

  initPromise = (async () => {
    try {
      const py = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      });
      await initHarness(py);
      pyodideInstance = py;
      postMessageToMain({
        type: 'STATUS',
        status: 'ready',
        message: 'Pyodide Wasm runtime ready',
      });
      return py;
    } catch (cdnErr) {
      // Fallback if CDN is inaccessible
      try {
        const py = await loadPyodide();
        await initHarness(py);
        pyodideInstance = py;
        postMessageToMain({
          type: 'STATUS',
          status: 'ready',
          message: 'Pyodide Wasm runtime ready (local)',
        });
        return py;
      } catch (fallbackErr: unknown) {
        const errMsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr || cdnErr);
        postMessageToMain({
          type: 'STATUS',
          status: 'error',
          message: `Failed to initialize Pyodide: ${errMsg}`,
        });
        throw fallbackErr;
      }
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

async function handleRun(id: string, code: string): Promise<void> {
  const startTime = performance.now();
  try {
    const py = await getPyodide();
    postMessageToMain({
      type: 'STATUS',
      status: 'running',
    });

    const runner = py.globals.get('__bug_whisper_execute__');
    const rawResultJson = runner(code) as string;
    if (typeof runner.destroy === 'function') {
      runner.destroy();
    }

    const parsed = JSON.parse(rawResultJson);
    const executionTimeMs = Math.round(performance.now() - startTime);

    const result: ExecutionResult = {
      id,
      success: Boolean(parsed.success),
      stdout: parsed.stdout ?? '',
      stderr: parsed.stderr ?? '',
      errorType: parsed.errorType ?? null,
      errorMessage: parsed.errorMessage ?? null,
      lineNumber: typeof parsed.lineNumber === 'number' ? parsed.lineNumber : null,
      traceback: parsed.traceback ?? '',
      executionTimeMs,
      isTimeout: false,
    };

    postMessageToMain({
      type: 'RUN_COMPLETE',
      result,
    });
    postMessageToMain({
      type: 'STATUS',
      status: 'ready',
    });
  } catch (err: unknown) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    const errorObj = err instanceof Error ? err : new Error(String(err));
    const result: ExecutionResult = {
      id,
      success: false,
      stdout: '',
      stderr: errorObj.message,
      errorType: errorObj.name || 'RuntimeError',
      errorMessage: errorObj.message,
      lineNumber: null,
      traceback: errorObj.stack || errorObj.message,
      executionTimeMs,
      isTimeout: false,
    };

    postMessageToMain({
      type: 'RUN_COMPLETE',
      result,
    });
    postMessageToMain({
      type: 'STATUS',
      status: 'ready',
    });
  }
}

self.onmessage = async (event: MessageEvent<WorkerInboundMessage>) => {
  const msg = event.data;
  if (!msg) return;

  switch (msg.type) {
    case 'INIT':
      try {
        await getPyodide();
      } catch {
        // Handled in getPyodide
      }
      break;
    case 'RUN':
      await handleRun(msg.id, msg.code);
      break;
    case 'RESET':
      if (pyodideInstance) {
        try {
          await initHarness(pyodideInstance);
        } catch {
          // Ignore reset errors
        }
      }
      postMessageToMain({
        type: 'STATUS',
        status: 'ready',
      });
      break;
  }
};

// Start eager initialization on worker load
void getPyodide().catch(() => {});
