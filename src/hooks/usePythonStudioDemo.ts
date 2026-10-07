import { useState, useCallback } from 'react';

export interface PythonTestCase {
  id: string;
  name: string;
  inputArgs: string;
  status: 'passed' | 'failed';
  resultText: string;
  latencyMs: number;
}

const INITIAL_TESTS: PythonTestCase[] = [
  {
    id: 'test-1',
    name: 'test_calculate_rate_zero_duration',
    inputArgs: 'items=[...], elapsed_seconds=0.0',
    status: 'failed',
    resultText: 'ZeroDivisionError: float division by zero',
    latencyMs: 1.2,
  },
  {
    id: 'test-2',
    name: 'test_calculate_rate_normal_batch',
    inputArgs: 'items=[...], elapsed_seconds=2.5',
    status: 'passed',
    resultText: '40.0 items/sec',
    latencyMs: 0.8,
  },
  {
    id: 'test-3',
    name: 'test_empty_queue_handling',
    inputArgs: 'items=[], elapsed_seconds=1.0',
    status: 'passed',
    resultText: '0.0 items/sec',
    latencyMs: 0.5,
  },
];

export function usePythonStudioDemo() {
  const [isPatched, setIsPatched] = useState(false);
  const [tests, setTests] = useState<PythonTestCase[]>(INITIAL_TESTS);
  const [showBlockedHint, setShowBlockedHint] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const togglePatched = useCallback(() => {
    setIsPatched((prev) => {
      const next = !prev;
      setTests((current) =>
        current.map((t) => {
          if (t.id === 'test-1') {
            return {
              ...t,
              status: next ? 'passed' : 'failed',
              resultText: next ? '0.0 items/sec (guarded)' : 'ZeroDivisionError: float division by zero',
            };
          }
          return t;
        })
      );
      return next;
    });
    setShowBlockedHint(false);
  }, []);

  const runTests = useCallback(() => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      if (!isPatched) {
        setShowBlockedHint(true);
        setTimeout(() => setShowBlockedHint(false), 2400);
      }
    }, 350);
  }, [isPatched]);

  return {
    isPatched,
    togglePatched,
    tests,
    runTests,
    isRunning,
    showBlockedHint,
  };
}
