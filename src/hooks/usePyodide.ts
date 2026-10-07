import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  PyodideStatus,
  ExecutionResult,
  WorkerOutboundMessage,
  WorkerInboundMessage,
  UsePyodideReturn,
} from '../types/pyodide';
import { executeDeterministicFallback } from '../lib/pythonFallback';

const TIMEOUT_MS = 3000;

interface PendingRequest {
  id: string;
  code: string;
  resolve: (result: ExecutionResult) => void;
  reject: (reason?: unknown) => void;
}

export function usePyodide(): UsePyodideReturn {
  const [status, setStatus] = useState<PyodideStatus>('idle');
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<ExecutionResult | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const timeoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRequestRef = useRef<PendingRequest | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
  }, []);

  const spawnWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    try {
      const worker = new Worker(new URL('../workers/pyodide-worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (event: MessageEvent<WorkerOutboundMessage>) => {
        const msg = event.data;
        if (!msg) return;
        if (msg.type === 'STATUS') {
          setStatus(msg.status);
          if (msg.status === 'running') {
            clearTimer();
            timeoutTimerRef.current = setTimeout(() => handleTimeout(), TIMEOUT_MS);
          }
        } else if (msg.type === 'RUN_COMPLETE') {
          clearTimer();
          setIsExecuting(false);
          setLastResult(msg.result);
          if (pendingRequestRef.current && pendingRequestRef.current.id === msg.result.id) {
            pendingRequestRef.current.resolve(msg.result);
            pendingRequestRef.current = null;
          }
        }
      };
      worker.onerror = () => {
        clearTimer();
        setStatus('error');
        setIsExecuting(false);
        if (pendingRequestRef.current) {
          const fb = executeDeterministicFallback(pendingRequestRef.current.code, pendingRequestRef.current.id);
          setLastResult(fb);
          pendingRequestRef.current.resolve(fb);
          pendingRequestRef.current = null;
        }
      };
      workerRef.current = worker;
      worker.postMessage({ type: 'INIT' } satisfies WorkerInboundMessage);
    } catch {
      setStatus('error');
    }
  }, [clearTimer]);

  const handleTimeout = useCallback(() => {
    clearTimer();
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    const req = pendingRequestRef.current;
    const timeoutRes: ExecutionResult = {
      id: req?.id || 'timeout',
      success: false,
      stdout: '',
      stderr: 'TimeoutError: Execution exceeded 3.0s limit (possible infinite loop).\nWorker terminated.',
      errorType: 'TimeoutError',
      errorMessage: 'Execution exceeded 3.0s limit',
      lineNumber: null,
      traceback: 'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\nTimeoutError: Limit exceeded',
      executionTimeMs: TIMEOUT_MS,
      isTimeout: true,
    };
    setIsExecuting(false);
    setLastResult(timeoutRes);
    if (req) {
      req.resolve(timeoutRes);
      pendingRequestRef.current = null;
    }
    spawnWorker();
  }, [clearTimer, spawnWorker]);

  const runCode = useCallback((code: string): Promise<ExecutionResult> => {
    return new Promise((resolve, reject) => {
      const id = 'req_' + Math.random().toString(36).slice(2, 9) + '_' + Date.now();
      if (!workerRef.current || status === 'error') {
        const fb = executeDeterministicFallback(code, id);
        setIsExecuting(false);
        setLastResult(fb);
        resolve(fb);
        return;
      }
      pendingRequestRef.current = { id, code, resolve, reject };
      setIsExecuting(true);
      clearTimer();
      timeoutTimerRef.current = setTimeout(() => {
        if (pendingRequestRef.current?.id === id) {
          const fb = executeDeterministicFallback(code, id);
          setIsExecuting(false);
          setLastResult(fb);
          pendingRequestRef.current.resolve(fb);
          pendingRequestRef.current = null;
        }
      }, 15000);
      workerRef.current.postMessage({ type: 'RUN', id, code } satisfies WorkerInboundMessage);
    });
  }, [clearTimer, status]);

  const clearOutput = useCallback(() => setLastResult(null), []);

  useEffect(() => {
    spawnWorker();
    return () => {
      clearTimer();
      if (workerRef.current) workerRef.current.terminate();
    };
  }, [spawnWorker, clearTimer]);

  return { status, isExecuting, lastResult, runCode, clearOutput };
}
