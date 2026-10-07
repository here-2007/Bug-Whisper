import React from 'react';
import { Terminal, GitCompare, ShieldCheck, Columns, Split, Copy, CheckCheck, Check, Trash2 } from 'lucide-react';

export type RightTab = 'terminal' | 'diff' | 'verifier';

interface PlaygroundTabsProps {
  activeTab: RightTab;
  onTabChange: (tab: RightTab) => void;
  hasDiff: boolean;
  hasError: boolean;
  sideBySide?: boolean;
  onToggleSideBySide?: () => void;
  onCopyDiff?: () => void;
  diffCopied?: boolean;
  onAcceptFix?: () => void;
  onClearTerminal?: () => void;
}

export const PlaygroundTabs: React.FC<PlaygroundTabsProps> = ({
  activeTab,
  onTabChange,
  hasDiff,
  hasError,
  sideBySide = true,
  onToggleSideBySide,
  onCopyDiff,
  diffCopied = false,
  onAcceptFix,
  onClearTerminal,
}) => {
  return (
    <div className="h-10 bg-[#1a1c17] border-b border-[#2d3128] px-3 flex items-center justify-between text-xs font-mono select-none shrink-0">
      {/* Tabs list */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onTabChange('terminal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs font-medium transition-colors cursor-pointer border-t border-x ${
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs font-medium transition-colors cursor-pointer border-t border-x ${
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs font-medium transition-colors cursor-pointer border-t border-x ${
            activeTab === 'verifier'
              ? 'bg-[#141414] text-white border-[#2d3128]'
              : 'border-transparent text-[#8e9385] hover:text-[#d6dad0]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verifier</span>
        </button>
      </div>

      {/* Right side contextual actions */}
      <div className="flex items-center gap-2">
        {activeTab === 'diff' && (
          <>
            {onToggleSideBySide && (
              <button
                type="button"
                onClick={onToggleSideBySide}
                className="flex items-center gap-1 text-[11px] text-[#8e9385] hover:text-white px-2 py-0.5 rounded cursor-pointer"
                title="Toggle split/inline diff"
              >
                {sideBySide ? <Columns className="w-3 h-3" /> : <Split className="w-3 h-3" />}
                <span className="hidden sm:inline">{sideBySide ? 'Split' : 'Inline'}</span>
              </button>
            )}

            {onCopyDiff && (
              <button
                type="button"
                onClick={onCopyDiff}
                className="flex items-center gap-1 text-[11px] text-[#8e9385] hover:text-white px-2 py-0.5 rounded bg-[#20231d] border border-[#2e3128] cursor-pointer"
              >
                {diffCopied ? <CheckCheck className="w-3 h-3 text-[#7bd88f]" /> : <Copy className="w-3 h-3" />}
                <span className="hidden sm:inline">{diffCopied ? 'Copied' : 'Copy'}</span>
              </button>
            )}

            {onAcceptFix && (
              <button
                type="button"
                onClick={onAcceptFix}
                disabled={!hasDiff}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-neutral-100 text-[#141414] text-[11px] font-bold cursor-pointer transition-colors disabled:opacity-40"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Accept</span>
              </button>
            )}
          </>
        )}

        {activeTab === 'terminal' && onClearTerminal && (
          <button
            type="button"
            onClick={onClearTerminal}
            className="flex items-center gap-1 text-[11px] text-[#717668] hover:text-[#b8bdad] px-2 py-0.5 rounded cursor-pointer"
            title="Clear terminal"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}

        {activeTab === 'verifier' && (
          <span className="text-[11px] text-[#7bd88f] hidden sm:block">
            0 Regressions · Two-Stage
          </span>
        )}
      </div>
    </div>
  );
};
