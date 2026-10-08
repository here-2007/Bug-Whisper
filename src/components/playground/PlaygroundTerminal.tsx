import React from 'react';
import { CornerDownRight, CheckCircle2, AlertOctagon, Terminal, Trash2 } from 'lucide-react';
import type { ExecutionResult } from '../../types/pyodide';

interface PlaygroundTerminalProps {
  result: ExecutionResult | null;
  isExecuting: boolean;
  onJumpToLine?: (line: number) => void;
  onClearTerminal?: () => void;
}

export const PlaygroundTerminal: React.FC<PlaygroundTerminalProps> = ({
  result,
  isExecuting,
  onJumpToLine,
  onClearTerminal,
}) => {
  const hasError = Boolean(result && !result.success);

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-[#141414] overflow-hidden font-mono text-xs select-text">
      {/* Sub-header Bar */}
      <div className="h-[38px] min-h-[38px] bg-[#1a1c17] border-b border-[#2d3128] px-3.5 flex items-center justify-between text-xs select-none shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#8e9385]" />
          <span className="font-semibold text-white tracking-tight">Terminal Output</span>
        </div>

        {onClearTerminal && (
          <button
            type="button"
            onClick={onClearTerminal}
            className="flex items-center gap-1 text-[11px] text-[#8e9385] hover:text-white p-1 rounded hover:bg-[#20221d] cursor-pointer transition-colors"
            title="Clear terminal output"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Scrollable Output Canvas */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {/* Startup banner */}
        <div className="text-[#64685b] select-none text-[11px] leading-relaxed">
          Bug Whisper Runtime Harness [Python 3.12 Wasm Sandbox]
          <br />
          Deterministic AST tracer initialized. Isolated execution environment ready.
        </div>

        {/* Dynamic Execution Output */}
        {isExecuting ? (
          <div className="text-[#f8e67a] flex items-center gap-2 py-2">
            <span className="w-2 h-2 rounded-full bg-[#f8e67a] animate-ping" />
            <span>Executing Python code in isolated WebWorker sandbox...</span>
          </div>
        ) : result ? (
          <div className="space-y-3">
            {/* Standard Output */}
            {result.stdout && (
              <div className="text-[#d7d7d7] whitespace-pre-wrap leading-relaxed bg-[#191b17] p-2.5 rounded border border-[#272b22]">
                {result.stdout}
              </div>
            )}

            {/* Error / Exception Card */}
            {hasError && (
              <div className="p-3.5 rounded-lg bg-[#2b161b] border border-[#52222c] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#fc618d] font-bold">
                    <AlertOctagon className="w-4 h-4 shrink-0" />
                    <span>{result.errorType || 'Runtime Exception'}</span>
                  </div>
                  {result.lineNumber && onJumpToLine && (
                    <button
                      type="button"
                      onClick={() => onJumpToLine(result.lineNumber!)}
                      className="flex items-center gap-1 text-[11px] text-[#f8e67a] bg-[#3a251b] hover:bg-[#4d3224] border border-[#693f2c] px-2 py-0.5 rounded cursor-pointer transition-colors"
                    >
                      <CornerDownRight className="w-3 h-3" />
                      <span>Line {result.lineNumber}</span>
                    </button>
                  )}
                </div>

                <div className="text-[#fc618d] text-[11px] whitespace-pre-wrap leading-relaxed bg-[#1f1014] p-2.5 rounded border border-[#3f1922]">
                  {result.traceback || result.stderr}
                </div>
              </div>
            )}

            {/* Success exit code */}
            {!hasError && (
              <div className="flex items-center gap-2 text-[#7bd88f] text-[11px] p-2 rounded bg-[#16251b] border border-[#223d2b]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Process exited with code 0 in {result.executionTimeMs}ms (0 regressions)</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-[#7d8274] italic text-[11px]">
            &gt;&gt;&gt; Ready. Click &apos;Run (Ctrl+Enter)&apos; to execute Python code.
          </div>
        )}
      </div>
    </div>
  );
};
