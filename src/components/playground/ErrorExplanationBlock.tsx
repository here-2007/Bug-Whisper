import React from 'react';
import { Sparkles, CheckCircle2, AlertOctagon, Loader2, HelpCircle } from 'lucide-react';
import type { ExplanationResponse } from '../../lib/inference';
import type { ExecutionResult } from '../../types/pyodide';

interface ErrorExplanationBlockProps {
  result: ExecutionResult | null;
  explanation: ExplanationResponse | null;
  isExecuting: boolean;
  isExplaining: boolean;
}

export const ErrorExplanationBlock: React.FC<ErrorExplanationBlockProps> = ({
  result,
  explanation,
  isExecuting,
  isExplaining,
}) => {
  const hasError = Boolean(result && !result.success);

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-[#141414] overflow-hidden font-mono text-xs select-text">
      {/* Sub-header Bar */}
      <div className="h-[38px] min-h-[38px] bg-[#1a1c17] border-b border-[#2d3128] px-3.5 flex items-center justify-between text-xs select-none shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#f8e67a]" />
          <span className="font-semibold text-white tracking-tight">Error Explanation</span>
          <span className="text-[10px] text-[#6f7566] hidden sm:inline">
            [bug-whisper-qwen25-coder-3b]
          </span>
        </div>

        {/* Dynamic status pill */}
        <div>
          {isExecuting ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-[#322c15] text-[#f8e67a] border border-[#52451c]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Executing...</span>
            </span>
          ) : isExplaining ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-[#322c15] text-[#f8e67a] border border-[#52451c]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Diagnosing...</span>
            </span>
          ) : hasError ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-[#351e18] text-[#ea6b42] border border-[#5a2c20]">
              <AlertOctagon className="w-3 h-3" />
              <span>Diagnosis Ready</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-[#16251b] text-[#7bd88f] border border-[#223d2b]">
              <CheckCircle2 className="w-3 h-3" />
              <span>Code Clean</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {/* State 0: Executing */}
        {isExecuting ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#322c15] border border-[#52451c] flex items-center justify-center text-[#f8e67a]">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-[#f8e67a]">Executing Code...</div>
              <p className="text-[11px] text-[#8e9385] max-w-sm leading-relaxed">
                Evaluating Python code in WebWorker sandbox to monitor runtime signals.
              </p>
            </div>
          </div>
        ) : isExplaining ? (
          /* State 1: Explaining in progress */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#322c15] border border-[#52451c] flex items-center justify-center text-[#f8e67a]">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-[#f8e67a]">Diagnosing Runtime Failure...</div>
              <p className="text-[11px] text-[#8e9385] max-w-sm leading-relaxed">
                Qwen 2.5 Coder 3B is deconstructing the traceback and evaluating what and why the error occurred.
              </p>
            </div>
          </div>
        ) : hasError && explanation ? (
          /* State 2: Error occurred & explanation ready */
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Card 1: What Happened */}
            <div className="p-3.5 rounded-lg bg-[#241719] border border-[#482025] space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-[#fc618d]">
                <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                <span>What Happened</span>
              </div>
              <p className="text-[#e2c7cb] text-[12px] leading-relaxed whitespace-pre-wrap">
                {explanation.what}
              </p>
            </div>

            {/* Card 2: Why It Happened */}
            <div className="p-3.5 rounded-lg bg-[#1f221b] border border-[#343b2b] space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-[#f8e67a]">
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Why It Happened</span>
              </div>
              <p className="text-[#d8decb] text-[12px] leading-relaxed whitespace-pre-wrap">
                {explanation.why}
              </p>
            </div>

            {/* Model telemetry badge */}
            <div className="flex items-center justify-between text-[10px] text-[#6a7061] px-1 pt-1">
              <span>Engine: {explanation.provider}</span>
              <span>Latency: {explanation.latencyMs}ms</span>
            </div>
          </div>
        ) : (
          /* State 3: Code Clean (Default on mount & on clean exit code 0) */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#16251b] border border-[#223d2b] flex items-center justify-center text-[#7bd88f]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-[#7bd88f] tracking-tight">Code Clean</div>
              <p className="text-[11px] text-[#8e9385] max-w-sm leading-relaxed">
                No runtime or syntax errors detected. When an error occurs during execution, Bug Whisper automatically analyzes the traceback and explains what and why it failed.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#191b17] border border-[#272b22] text-[10px] text-[#6f7566]">
              <span>Status: Clean</span>
              <span>·</span>
              <span>Exit Code: 0</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
