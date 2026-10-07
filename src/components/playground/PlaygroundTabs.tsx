import React from 'react';
import { Terminal, GitCompare, ShieldCheck } from 'lucide-react';

export type RightTab = 'terminal' | 'diff' | 'verifier';

interface PlaygroundTabsProps {
  activeTab: RightTab;
  onTabChange: (tab: RightTab) => void;
  hasDiff: boolean;
  hasError: boolean;
}

export const PlaygroundTabs: React.FC<PlaygroundTabsProps> = ({
  activeTab,
  onTabChange,
  hasDiff,
  hasError,
}) => {
  return (
    <div className="h-8 bg-[#1a1c17] border-b border-[#2d3128] px-3 flex items-center justify-between text-xs font-mono select-none shrink-0">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onTabChange('terminal')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-t text-xs font-medium transition-colors cursor-pointer border-t border-x ${
            activeTab === 'terminal'
              ? 'bg-[#141414] text-white border-[#2d3128]'
              : 'border-transparent text-[#8e9385] hover:text-[#d6dad0]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Terminal</span>
          {hasError && <span className="w-1.5 h-1.5 rounded-full bg-[#fc618d]" />}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('diff')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-t text-xs font-medium transition-colors cursor-pointer border-t border-x ${
            activeTab === 'diff'
              ? 'bg-[#141414] text-white border-[#2d3128]'
              : 'border-transparent text-[#8e9385] hover:text-[#d6dad0]'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>Remediation Diff</span>
          {hasDiff && <span className="w-1.5 h-1.5 rounded-full bg-[#7bd88f]" />}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('verifier')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-t text-xs font-medium transition-colors cursor-pointer border-t border-x ${
            activeTab === 'verifier'
              ? 'bg-[#141414] text-white border-[#2d3128]'
              : 'border-transparent text-[#8e9385] hover:text-[#d6dad0]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verifier</span>
        </button>
      </div>

      <div className="text-[11px] text-[#64685b] hidden sm:block">
        Deterministic Two-Stage Verifier
      </div>
    </div>
  );
};
