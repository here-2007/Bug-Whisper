import React, { useState, useMemo } from 'react';
import { Sparkles, CheckCircle2, AlertOctagon, Loader2, Copy, Check, GitCommitHorizontal, FileText } from 'lucide-react';
import type { ExplanationResponse } from '../../lib/inference';
import type { ExecutionResult } from '../../types/pyodide';
import { generateUnifiedDiff } from '../../lib/diff';

interface ErrorExplanationBlockProps {
  result: ExecutionResult | null;
  explanation: ExplanationResponse | null;
  currentCode?: string;
  isExecuting: boolean;
  isExplaining: boolean;
  onApplyFix?: (repairedCode: string) => void;
}

export const ErrorExplanationBlock: React.FC<ErrorExplanationBlockProps> = ({
  result,
  explanation,
  currentCode = '',
  isExecuting,
  isExplaining,
  onApplyFix,
}) => {
  const hasError = Boolean(result && !result.success);
  const [activeTab, setActiveTab] = useState<'explanation' | 'diff'>('explanation');
  const [copied, setCopied] = useState(false);

  const repairedCode = explanation?.repairedCode;
  const diffText = useMemo(() => {
    if (!repairedCode || !currentCode) return '';
    return generateUnifiedDiff(currentCode, repairedCode);
  }, [currentCode, repairedCode]);

  const handleCopyExplanation = async () => {
    if (!explanation) return;
    const textToCopy = activeTab === 'diff' && diffText
      ? diffText
      : (explanation.explanation || `${explanation.what}\n\n${explanation.why}`);
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        {/* Right Header: Dynamic Status Pill & Copy Action */}
        <div className="flex items-center gap-2">
          {hasError && explanation && (
            <button
              type="button"
              onClick={handleCopyExplanation}
              title="Copy diagnosis to clipboard"
              className="flex items-center gap-1 text-[11px] text-[#8e9385] hover:text-white px-2 py-0.5 rounded bg-[#20221d] border border-[#2e3227] hover:border-[#3d4236] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-[#7bd88f]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}

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
          ) : hasError && explanation ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-[#351e18] text-[#ea6b42] border border-[#5a2c20]">
              <AlertOctagon className="w-3 h-3" />
              <span>Diagnosis Ready</span>
            </span>
          ) : hasError ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-[#351e18] text-[#ea6b42] border border-[#5a2c20]">
              <AlertOctagon className="w-3 h-3" />
              <span>Execution Error</span>
            </span>
          ) : result && result.success ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-[#16251b] text-[#7bd88f] border border-[#223d2b]">
              <CheckCircle2 className="w-3 h-3" />
              <span>Code Clean</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-[#191b17] text-[#8e9385] border border-[#272b22]">
              <Sparkles className="w-3 h-3 text-[#f8e67a]" />
              <span>Standby</span>
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
                Qwen 2.5 Coder 3B is deconstructing the traceback and evaluating the error...
              </p>
            </div>
          </div>
        ) : hasError && explanation ? (
          /* State 2: Error occurred & direct model explanation ready */
          <div className="space-y-2 animate-in fade-in duration-200 h-full flex flex-col justify-between">
            {/* View Tab Switcher when Diff is Available */}
            {explanation.repairedCode && diffText && (
              <div className="flex items-center justify-between pb-1 border-b border-[#2d3128]">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('explanation')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                      activeTab === 'explanation'
                        ? 'bg-[#20221d] text-white border border-[#3d4236]'
                        : 'text-[#8e9385] hover:text-white'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    <span>Explanation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('diff')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                      activeTab === 'diff'
                        ? 'bg-[#20221d] text-white border border-[#3d4236]'
                        : 'text-[#8e9385] hover:text-white'
                    }`}
                  >
                    <GitCommitHorizontal className="w-3 h-3 text-[#7bd88f]" />
                    <span>Diff Patch</span>
                  </button>
                </div>

                {onApplyFix && (
                  <button
                    type="button"
                    onClick={() => onApplyFix(explanation.repairedCode!)}
                    title="Apply the synthesized fix to editor and re-execute"
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#16251b] hover:bg-[#1e3425] border border-[#223d2b] text-[#7bd88f] text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Apply Fix & Re-run</span>
                  </button>
                )}
              </div>
            )}

            {/* Main Diagnostic Body */}
            {activeTab === 'diff' && diffText ? (
              <div className="p-3.5 rounded-lg bg-[#191b17] border border-[#2d3128] text-xs leading-relaxed font-mono select-text flex-1 overflow-y-auto">
                <pre className="space-y-0.5">
                  {diffText.split('\n').map((line, idx) => {
                    let lineClass = 'text-[#8e9385]';
                    if (line.startsWith('+')) lineClass = 'text-[#7bd88f] bg-[#16251b]/60 px-1 rounded-sm';
                    else if (line.startsWith('-')) lineClass = 'text-[#fc618d] bg-[#2b161b]/60 px-1 rounded-sm';
                    else if (line.startsWith('@')) lineClass = 'text-[#f8e67a]';
                    return (
                      <div key={idx} className={lineClass}>
                        {line || ' '}
                      </div>
                    );
                  })}
                </pre>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-[#191b17] border border-[#2d3128] text-[#d8decb] text-xs leading-relaxed whitespace-pre-wrap font-mono select-text flex-1 overflow-y-auto">
                {explanation.explanation || `${explanation.what}\n\n${explanation.why}`}
              </div>
            )}

            {/* Bottom Row: Actions & Telemetry */}
            <div className="flex items-center justify-between text-[10px] text-[#6a7061] px-1 pt-1 border-t border-[#23271f] shrink-0">
              <span>Engine: {explanation.provider}</span>
              <div className="flex items-center gap-3">
                {explanation.suggestedFix && activeTab === 'explanation' && (
                  <span className="text-[#a0a599] hidden md:inline">Fix: {explanation.suggestedFix}</span>
                )}
                <span>Latency: {explanation.latencyMs}ms</span>
              </div>
            </div>
          </div>
        ) : hasError ? (
          /* State 4: Error occurred but explanation unavailable */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#351e18] border border-[#5a2c20] flex items-center justify-center text-[#ea6b42]">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-[#ea6b42] tracking-tight">Diagnosis Unavailable</div>
              <p className="text-[11px] text-[#8e9385] max-w-sm leading-relaxed">
                Unable to generate an AI explanation right now. Inspect the terminal traceback above to identify the root cause.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#191b17] border border-[#272b22] text-[10px] text-[#6f7566]">
              <span>Error: {result?.errorType || 'Runtime Exception'}</span>
              <span>·</span>
              <span>Line: {result?.lineNumber ?? 'Unknown'}</span>
            </div>
          </div>
        ) : result && result.success ? (
          /* State 3: Code Clean (Only when actual execution succeeded with exit code 0) */
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
        ) : (
          /* State 5: Standby / Ready for Execution (Initial mount before code runs) */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#1e201b] border border-[#2d3128] flex items-center justify-center text-[#8e9385]">
              <Sparkles className="w-5 h-5 text-[#f8e67a]" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white tracking-tight">Ready for Execution</div>
              <p className="text-[11px] text-[#8e9385] max-w-sm leading-relaxed">
                Click &apos;Run (Ctrl+Enter)&apos; to evaluate Python code. If an error occurs during execution, Bug Whisper automatically intercepts the traceback and explains the failure.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#191b17] border border-[#272b22] text-[10px] text-[#6f7566]">
              <span>Deterministic Tracer</span>
              <span>·</span>
              <span>Qwen 2.5 Coder 3B</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
