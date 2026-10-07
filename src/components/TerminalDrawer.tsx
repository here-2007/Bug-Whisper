import React from 'react';
import { Trash2, CornerDownRight, Sparkles } from 'lucide-react';
import type { PyodideStatus, ExecutionResult } from '../types/pyodide';

export interface TerminalDrawerProps {
  status: PyodideStatus;
  isExecuting: boolean;
  result: ExecutionResult | null;
  onClear?: () => void;
  onJumpToLine?: (line: number) => void;
  onRemediate?: () => void;
  className?: string;
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({
  status,
  isExecuting,
  result,
  onClear,
  onJumpToLine,
  onRemediate,
  className = '',
}) => {
  const hasError = result && !result.success;
  const hasStdout = Boolean(result?.stdout);
  const hasStderr = Boolean(result?.stderr || result?.traceback);

  return (
    <div
      className={`rounded-xl bg-ink-black border border-graphite-border flex flex-col overflow-hidden ${className}`}
    >
      {/* 32px Tab Header Bar */}
      <div className="h-8 bg-charcoal-surface px-3.5 flex items-center justify-between border-b border-graphite-border select-none shrink-0">
        <div className="flex items-center gap-1.5">
          {/* macOS Traffic Dots */}
          <span className="w-2 h-2 rounded-full bg-hot-pink" />
          <span className="w-2 h-2 rounded-full bg-canary-yellow" />
          <span className="w-2 h-2 rounded-full bg-mint-green" />
          <span className="ml-2.5 text-xs font-mono text-ash-text">
            terminal · output
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Indicators */}
          {isExecuting ? (
            <span className="flex items-center gap-1.5 text-xs font-mono text-canary-yellow">
              <span className="w-1.5 h-1.5 rounded-full bg-canary-yellow animate-pulse" />
              EXECUTING...
            </span>
          ) : status === 'loading' ? (
            <span className="flex items-center gap-1.5 text-xs font-mono text-fog-text">
              <span className="w-1.5 h-1.5 rounded-full bg-fog-text animate-pulse" />
              LOADING WASM...
            </span>
          ) : result ? (
            result.success ? (
              <span className="flex items-center gap-1.5 text-xs font-mono text-mint-green">
                <span className="w-1.5 h-1.5 rounded-full bg-mint-green" />
                EXITED (0) · {result.executionTimeMs}ms
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-mono text-hot-pink">
                <span className="w-1.5 h-1.5 rounded-full bg-hot-pink" />
                FAILED (EXIT 1){result.lineNumber ? ` · Line ${result.lineNumber}` : ''}
              </span>
            )
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-mono text-fog-text">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-green" />
              READY
            </span>
          )}

          {/* Jump to Line Button */}
          {hasError && result?.lineNumber && onJumpToLine && (
            <button
              type="button"
              onClick={() => onJumpToLine(result.lineNumber!)}
              className="flex items-center gap-1 text-[11px] font-mono text-canary-yellow bg-charcoal-surface hover:bg-[#333333] border border-graphite-border px-2 py-0.5 rounded transition-colors cursor-pointer"
              title={`Jump to line ${result.lineNumber} in editor`}
            >
              <CornerDownRight className="w-3 h-3 text-canary-yellow" />
              Jump to Line {result.lineNumber}
            </button>
          )}

          {/* Clear Console Action */}
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-fog-text hover:text-ash-text transition-colors p-1 cursor-pointer"
              title="Clear terminal output"
              aria-label="Clear terminal output"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Interior Display Area */}
      <div className="flex-1 p-3.5 font-mono text-[13px] leading-[1.4] overflow-auto flex flex-col gap-2 min-h-[140px]">
        {/* Shell command line prompt */}
        <div className="text-fog-text select-none text-xs">
          $ python main.py
        </div>

        {/* Stdout stream */}
        {hasStdout && (
          <pre className="text-mint-green whitespace-pre-wrap font-mono text-[13px] leading-[1.4] m-0">
            {result?.stdout}
          </pre>
        )}

        {/* Stderr / Traceback stream */}
        {hasStderr && (
          <pre className="text-hot-pink whitespace-pre-wrap font-mono text-[13px] leading-[1.4] m-0">
            {result?.traceback || result?.stderr}
          </pre>
        )}

        {/* Idle prompt when no output is present */}
        {!hasStdout && !hasStderr && !isExecuting && (
          <div className="text-fog-text/50 italic text-xs select-none">
            Terminal idle. Click &quot;Run &amp; Whisper&quot; or press Ctrl+Enter to execute.
          </div>
        )}
      </div>

      {/* Remediate CTA Banner on Crash */}
      {hasError && (
        <div className="m-3 p-3 rounded border border-hot-pink/40 bg-hot-pink/10 flex flex-wrap items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-hot-pink/20 text-hot-pink border border-hot-pink/30 font-semibold">
              {result.errorType || 'Exception'}
            </span>
            {result.lineNumber && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-canary-yellow/20 text-canary-yellow border border-canary-yellow/30 font-semibold">
                Line {result.lineNumber}
              </span>
            )}
            <span className="text-xs font-mono text-ash-text truncate max-w-[280px] sm:max-w-md">
              {result.errorMessage || 'Execution encountered an exception'}
            </span>
          </div>

          {onRemediate && (
            <button
              type="button"
              onClick={onRemediate}
              className="flex items-center gap-1.5 text-xs font-mono font-medium text-paper-white bg-plum-button hover:bg-[#a6308c] px-3 py-1.5 rounded-lg border border-[#a6308c] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-canary-yellow" />
              Remediate with Whisper
            </button>
          )}
        </div>
      )}
    </div>
  );
};
