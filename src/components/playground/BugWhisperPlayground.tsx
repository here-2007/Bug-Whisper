import React, { useState, useEffect, useCallback } from 'react';
import { PlaygroundHeader } from './PlaygroundHeader';
import { PlaygroundEditor } from './PlaygroundEditor';
import { PlaygroundTerminal } from './PlaygroundTerminal';
import { ErrorExplanationBlock } from './ErrorExplanationBlock';
import { usePyodide } from '../../hooks/usePyodide';
import { explainError, type ExplanationResponse } from '../../lib/inference';

const DEFAULT_CODE = `def calculate_user_metrics(users, target_id):
    # Lookup telemetry metrics for user
    record = users.get(target_id)
    ratio = record["total_requests"] / record["error_count"]
    return {
        "user_id": target_id,
        "ratio": ratio,
        "role": record["roles"][5]
    }

user_db = {
    "usr_102": {
        "total_requests": 1420,
        "error_count": 0,
        "roles": ["viewer", "analyst"]
    }
}

# Running metrics calculation
print("Computing metrics...")
metrics = calculate_user_metrics(user_db, "usr_102")
print(f"Metrics computed: {metrics}")
`;

export const BugWhisperPlayground: React.FC = () => {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);

  const { status, isExecuting, lastResult, runCode, clearOutput } = usePyodide();

  // Execute initial code on mount once Pyodide Wasm is ready
  useEffect(() => {
    if (status === 'ready') {
      runCode(code);
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Automatically trigger model explanation whenever a runtime or syntax error occurs
  useEffect(() => {
    if (!lastResult) {
      setExplanation(null);
      setIsExplaining(false);
      return;
    }

    if (lastResult.success) {
      setExplanation(null);
      setIsExplaining(false);
      return;
    }

    let isMounted = true;
    setIsExplaining(true);

    explainError({
      code,
      stderr: lastResult.stderr,
      traceback: lastResult.traceback,
      errorType: lastResult.errorType,
      lineNumber: lastResult.lineNumber,
    })
      .then((res) => {
        if (isMounted) {
          setExplanation(res);
          setIsExplaining(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsExplaining(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [lastResult]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derive effective highlighted line from traceback
  const effectiveHighlightedLine =
    highlightedLine !== null
      ? highlightedLine
      : lastResult && !lastResult.success && lastResult.lineNumber
        ? lastResult.lineNumber
        : null;

  const handleRun = useCallback(() => {
    setExplanation(null);
    setIsExplaining(false);
    runCode(code);
  }, [code, runCode]);

  const handleReset = useCallback(() => {
    setCode(DEFAULT_CODE);
    setHighlightedLine(null);
    setExplanation(null);
    setIsExplaining(false);
    clearOutput();
    runCode(DEFAULT_CODE);
  }, [clearOutput, runCode]);

  return (
    <div className="w-full rounded-xl border border-[#38383a] bg-[#141414] overflow-hidden flex flex-col shadow-none">
      <PlaygroundHeader
        onRun={handleRun}
        onReset={handleReset}
        isExecuting={isExecuting}
        isExplaining={isExplaining}
        status={status}
      />

      {/* Top Row: 2-Column Split (Code Editor on Left, Terminal Output on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2d3128] min-h-[380px] lg:h-[400px]">
        {/* Top-Left: Python Code Editor */}
        <div className="min-h-[360px] lg:h-full flex flex-col overflow-hidden bg-[#141414]">
          <PlaygroundEditor
            code={code}
            onChange={(newCode) => {
              setCode(newCode);
              setHighlightedLine(null);
            }}
            onRun={handleRun}
            highlightLine={effectiveHighlightedLine}
          />
        </div>

        {/* Top-Right: Terminal Output */}
        <div className="min-h-[280px] lg:h-full flex flex-col overflow-hidden bg-[#141414]">
          <PlaygroundTerminal
            result={lastResult}
            isExecuting={isExecuting}
            onJumpToLine={(line) => setHighlightedLine(line)}
            onClearTerminal={clearOutput}
          />
        </div>
      </div>

      {/* Bottom Row: Full-Width Error Explanation Block */}
      <div className="w-full border-t border-[#2d3128] min-h-[220px] lg:min-h-[240px] flex flex-col bg-[#141414]">
        <ErrorExplanationBlock
          result={lastResult}
          explanation={explanation}
          isExecuting={isExecuting}
          isExplaining={isExplaining}
        />
      </div>
    </div>
  );
};

