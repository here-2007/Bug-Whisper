import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import type { PythonTestCase } from '../../hooks/usePythonStudioDemo';

interface PythonRuntimePreviewProps {
  tests: PythonTestCase[];
  onRunTests: () => void;
  isRunning: boolean;
  showBlockedHint: boolean;
}

export const HeroRuntimePreview: React.FC<PythonRuntimePreviewProps> = ({
  tests,
  onRunTests,
  showBlockedHint,
}) => {
  return (
    <div className="bg-[#181a16] rounded-xl border border-[#2e3128] overflow-hidden flex flex-col relative select-none">
      {/* Toast alert if running tests while bug persists */}
      {showBlockedHint && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded bg-[#fc618d] text-[#141414] font-bold text-[11px] animate-bounce whitespace-nowrap">
          ZeroDivisionError detected! Click &apos;Try fix&apos; in code ↖
        </div>
      )}

      {/* Header Bar */}
      <div className="h-9 bg-[#20231d] border-b border-[#2e3128] px-3.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
        </div>
        <div className="px-4 py-0.5 rounded bg-[#121410] border border-[#282c22] text-[11px] font-mono text-[#8a9082]">
          terminal.bugwhisper.run
        </div>
        <div className="w-6" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="text-[11px] font-mono text-[#787e70] mb-3 flex items-center justify-between">
            <span>CPython 3.11 · Deterministic Traceback</span>
            <span className="text-[#388bfd]">WebWorker Sandbox</span>
          </div>

          <div className="space-y-2.5">
            {tests.map((test) => {
              const isPassed = test.status === 'passed';
              return (
                <div
                  key={test.id}
                  onClick={onRunTests}
                  className="flex items-center justify-between py-1.5 px-2 rounded bg-[#1d201a] border border-[#282c22] hover:border-[#3d4335] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center ${
                        isPassed ? 'text-[#7bd88f]' : 'text-[#fc618d]'
                      }`}
                    >
                      {isPassed ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-white leading-tight">
                        {test.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#7d8274]">
                        {test.inputArgs}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium border ${
                      isPassed
                        ? 'bg-[#1c3524] text-[#86e39d] border-[#295434]'
                        : 'bg-[#401f28] text-[#fca5a5] border-[#6b2c3a]'
                    }`}
                  >
                    {isPassed ? 'PASSED' : 'ZeroDivisionError'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
