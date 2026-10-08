import { execFileSync } from 'node:child_process';
import * as path from 'node:path';

export interface HarnessResult {
  success: boolean;
  stdout: string;
  stderr: string;
  errorType: string | null;
  errorMessage: string | null;
  lineNumber: number | null;
  traceback: string;
  executionTimeMs: number;
  isTimeout?: boolean;
}

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HARNESS_SCRIPT_PATH = path.resolve(__dirname, 'python-harness.py');

/**
 * Runs user Python code through the deterministic Python execution harness
 * via the system Python runtime (CPython 3.11).
 */
export function runPythonHarness(code: string, timeoutMs: number = 4000): HarnessResult {
  const startTime = Date.now();

  try {
    const pythonBin = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
    const stdout = execFileSync(pythonBin, [HARNESS_SCRIPT_PATH], {
      input: code,
      encoding: 'utf-8',
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024,
    });

    const parsed = JSON.parse(stdout.trim());
    return {
      ...parsed,
      executionTimeMs: Date.now() - startTime,
    };
  } catch (err: any) {
    const elapsed = Date.now() - startTime;
    if (err.code === 'ETIMEDOUT' || err.killed) {
      return {
        success: false,
        stdout: '',
        stderr: 'TimeoutError: Execution exceeded time limit (possible infinite loop detected).',
        errorType: 'TimeoutError',
        errorMessage: 'Execution exceeded time limit',
        lineNumber: null,
        traceback: 'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\nTimeoutError: Execution timed out',
        executionTimeMs: elapsed,
        isTimeout: true,
      };
    }

    // If script failed to parse or exited unexpectedly
    return {
      success: false,
      stdout: '',
      stderr: err.stderr ? String(err.stderr) : err.message,
      errorType: 'SystemError',
      errorMessage: err.message,
      lineNumber: null,
      traceback: err.stderr ? String(err.stderr) : '',
      executionTimeMs: elapsed,
    };
  }
}
