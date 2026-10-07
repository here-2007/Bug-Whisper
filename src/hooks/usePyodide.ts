import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  PyodideStatus,
  ExecutionResult,
  WorkerOutboundMessage,
  WorkerInboundMessage,
  UsePyodideReturn,
} from '../types/pyodide';

const TIMEOUT_MS = 3000;

interface PendingRequest {
  id: string;
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

  const spawnWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    try {
      const worker = new Worker(
        new URL('../workers/pyodide-worker.ts', import.meta.url),
        { type: 'module' }
      );

      worker.onmessage = (event: MessageEvent<WorkerOutboundMessage>) => {
        const msg = event.data;
        if (!msg) return;

        if (msg.type === 'STATUS') {
          setStatus(msg.status);
        } else if (msg.type === 'RUN_COMPLETE') {
          if (timeoutTimerRef.current) {
            clearTimeout(timeoutTimerRef.current);
            timeoutTimerRef.current = null;
          }

          setIsExecuting(false);
          setLastResult(msg.result);

          if (pendingRequestRef.current && pendingRequestRef.current.id === msg.result.id) {
            pendingRequestRef.current.resolve(msg.result);
            pendingRequestRef.current = null;
          }
        }
      };

      worker.onerror = (err) => {
        console.error('Pyodide worker runtime error:', err);
        setStatus('error');
        setIsExecuting(false);

        if (timeoutTimerRef.current) {
          clearTimeout(timeoutTimerRef.current);
          timeoutTimerRef.current = null;
        }

        if (pendingRequestRef.current) {
          const fallbackResult: ExecutionResult = {
            id: pendingRequestRef.current.id,
            success: false,
            stdout: '',
            stderr: 'Pyodide worker execution failed',
            errorType: 'WorkerError',
            errorMessage: 'Worker encountered an unhandled error',
            lineNumber: null,
            traceback: '',
            executionTimeMs: 0,
            isTimeout: false,
          };
          pendingRequestRef.current.resolve(fallbackResult);
          pendingRequestRef.current = null;
        }
      };

      workerRef.current = worker;
      worker.postMessage({ type: 'INIT' } satisfies WorkerInboundMessage);
    } catch (err) {
      console.error('Failed to instantiate Pyodide WebWorker:', err);
      queueMicrotask(() => {
        setStatus('error');
      });
    }
  }, []);

  const handleTimeout = useCallback((requestId: string) => {
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }

    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    const timeoutResult: ExecutionResult = {
      id: requestId,
      success: false,
      stdout: '',
      stderr: 'TimeoutError: Execution exceeded 3.0-second limit (possible infinite loop detected).\nWorker thread terminated to preserve browser responsiveness.',
      errorType: 'TimeoutError',
      errorMessage: 'Execution exceeded 3.0s limit (infinite loop)',
      lineNumber: null,
      traceback: 'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\nTimeoutError: Execution exceeded 3.0s limit',
      executionTimeMs: TIMEOUT_MS,
      isTimeout: true,
    };

    setIsExecuting(false);
    setLastResult(timeoutResult);

    if (pendingRequestRef.current && pendingRequestRef.current.id === requestId) {
      pendingRequestRef.current.resolve(timeoutResult);
      pendingRequestRef.current = null;
    }

    // Transparently restart a fresh worker
    spawnWorker();
  }, [spawnWorker]);

  const runCode = useCallback((code: string): Promise<ExecutionResult> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        spawnWorker();
      }

      const requestId = 'req_' + Math.random().toString(36).slice(2, 9) + '_' + Date.now();

      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
      }

      timeoutTimerRef.current = setTimeout(() => {
        handleTimeout(requestId);
      }, TIMEOUT_MS);

      pendingRequestRef.current = {
        id: requestId,
        resolve,
        reject,
      };

      setIsExecuting(true);
      setStatus('running');

      const request: WorkerInboundMessage = {
        type: 'RUN',
        id: requestId,
        code,
      };

      workerRef.current?.postMessage(request);
    });
  }, [handleTimeout, spawnWorker]);

  const clearOutput = useCallback(() => {
    setLastResult(null);
  }, []);

  useEffect(() => {
    spawnWorker();

    return () => {
      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
        timeoutTimerRef.current = null;
      }
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [spawnWorker]);

  return {
    status,
    isExecuting,
    lastResult,
    runCode,
    clearOutput,
  };
}
