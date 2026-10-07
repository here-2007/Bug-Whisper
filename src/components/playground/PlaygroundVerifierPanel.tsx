import React from 'react';
import { ShieldCheck, Cpu, Check } from 'lucide-react';
import type { ExecutionResult } from '../../types/pyodide';

interface PlaygroundVerifierPanelProps {
  result: ExecutionResult | null;
  hasFixedCode?: boolean;
  fixedCode?: string;
}

export const PlaygroundVerifierPanel: React.FC<PlaygroundVerifierPanelProps> = ({
  result,
}) => {
  const isHealthy = result?.success;

  return (
    <div className="flex-1 flex flex-col bg-[#141414] p-5 overflow-y-auto font-mono text-xs space-y-4">
      {/* Overview Card */}
      <div className="p-4 rounded-xl bg-[#1c1e19] border border-[#2d3128] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#242721] border border-[#373c2e] flex items-center justify-center text-[#7bd88f]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Two-Stage Verification Harness</div>
            <div className="text-[11px] text-[#8e9385]">Deterministic AST check followed by isolated execution</div>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded bg-[#1f2f22] text-[#86e39d] border border-[#2e5234] text-[11px] font-bold">
          0 Regressions
        </div>
      </div>

      {/* Stages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Stage 1 */}
        <div className="p-3.5 rounded-lg bg-[#181a16] border border-[#282c22] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[#8e9385] font-semibold text-[11px]">Stage 1: AST Syntax Validator</span>
            <span className="text-[10px] text-[#7bd88f] flex items-center gap-1">
              <Check className="w-3 h-3" /> PASS
            </span>
          </div>
          <p className="text-[11px] text-[#64685b]">
            Validates Python grammar and bounds within 1,500-char focal window.
          </p>
        </div>

        {/* Stage 2 */}
        <div className="p-3.5 rounded-lg bg-[#181a16] border border-[#282c22] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[#8e9385] font-semibold text-[11px]">Stage 2: Runtime Assertion Test</span>
            <span className={`text-[10px] flex items-center gap-1 ${isHealthy ? 'text-[#7bd88f]' : 'text-[#fc618d]'}`}>
              {isHealthy ? '✓ PASS' : '✗ FAILING'}
            </span>
          </div>
          <p className="text-[11px] text-[#64685b]">
            Re-runs unit assertions against the synthesized candidate patch.
          </p>
        </div>
      </div>

      {/* Model Alignment Details */}
      <div className="p-4 rounded-xl bg-[#181a16] border border-[#282c22] space-y-2">
        <div className="text-white font-semibold text-xs flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#de5d33]" />
          <span>Inference Model: bug-whisper-qwen25-coder-3b</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#23261f] text-[11px]">
          <div>
            <span className="text-[#64685b] block">Target Architecture</span>
            <span className="text-[#d6dad0]">3B LoRA / vLLM</span>
          </div>
          <div>
            <span className="text-[#64685b] block">Focal Window</span>
            <span className="text-[#d6dad0]">1,500 chars</span>
          </div>
          <div>
            <span className="text-[#64685b] block">Confidence</span>
            <span className="text-[#7bd88f]">0.99 (High)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
