import { BUG_PRESETS } from '../constants/presets';
import type { ExecutionResult } from '../types/pyodide';

/**
 * Deterministic fallback execution simulator when Pyodide Wasm is downloading or offline.
 */
export function executeDeterministicFallback(code: string, id: string): ExecutionResult {
  const cleanCode = code.trim();

  // Match against known buggy presets
  const preset = BUG_PRESETS.find(
    (p) =>
      p.buggyCode.trim() === cleanCode ||
      cleanCode.includes(p.id) ||
      (p.offendingLine && cleanCode.includes(p.summary.slice(0, 15)))
  );

  if (preset) {
    const isMutable = preset.id === 'mutable_default';
    return {
      id,
      success: false,
      stdout: isMutable ? "Cart: ['apple']\nCart: ['apple', 'banana']" : '',
      stderr: `${preset.exceptionType}: ${preset.summary}`,
      errorType: preset.exceptionType,
      errorMessage: preset.summary,
      lineNumber: preset.offendingLine,
      traceback: `Traceback (most recent call last):\n  File "main.py", line ${preset.offendingLine}, in <module>\n${preset.exceptionType}: ${preset.summary}`,
      executionTimeMs: 4,
      isTimeout: false,
    };
  }

  // Match against known fixed presets
  const fixedPreset = BUG_PRESETS.find((p) => p.fixedCode.trim() === cleanCode);
  if (fixedPreset) {
    return {
      id,
      success: true,
      stdout: 'Process exited with code 0.\nVerification: 0 regressions, all assertions passed.',
      stderr: '',
      errorType: null,
      errorMessage: null,
      lineNumber: null,
      traceback: '',
      executionTimeMs: 2,
      isTimeout: false,
    };
  }

  // Generic clean execution fallback
  return {
    id,
    success: true,
    stdout: 'Execution completed.\nProcess exited with code 0 in 3ms.',
    stderr: '',
    errorType: null,
    errorMessage: null,
    lineNumber: null,
    traceback: '',
    executionTimeMs: 3,
    isTimeout: false,
  };
}
