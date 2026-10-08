import React from 'react';
import { PlaygroundTabs, type RightTab } from './PlaygroundTabs';
import { PlaygroundTerminal } from './PlaygroundTerminal';
import { PlaygroundDiff } from './PlaygroundDiff';
import { PlaygroundVerifierPanel } from './PlaygroundVerifierPanel';
import type { ExecutionResult } from '../../types/pyodide';

interface PlaygroundRightPaneProps {
  activeTab: RightTab;
  onTabChange: (tab: RightTab) => void;
  hasDiff: boolean;
  hasError: boolean;
  sideBySide: boolean;
  onToggleSideBySide: () => void;
  onCopyDiff: () => void;
  diffCopied: boolean;
  onAcceptFix: () => void;
  onClearTerminal: () => void;
  lastResult: ExecutionResult | null;
  isExecuting: boolean;
  onJumpToLine: (line: number) => void;
  onHeal: () => void;
  code: string;
  fixedCode: string;
}

export const PlaygroundRightPane: React.FC<PlaygroundRightPaneProps> = ({
  activeTab,
  onTabChange,
  hasDiff,
  hasError,
  sideBySide,
  onToggleSideBySide,
  onCopyDiff,
  diffCopied,
  onAcceptFix,
  onClearTerminal,
  lastResult,
  isExecuting,
  onJumpToLine,
  onHeal,
  code,
  fixedCode,
}) => {
  return (
    <div className="min-h-[380px] lg:h-full flex flex-col overflow-hidden bg-[#141414]">
      <PlaygroundTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        hasDiff={hasDiff}
        hasError={hasError}
        sideBySide={sideBySide}
        onToggleSideBySide={onToggleSideBySide}
        onCopyDiff={onCopyDiff}
        diffCopied={diffCopied}
        onAcceptFix={onAcceptFix}
        onClearTerminal={onClearTerminal}
      />

      <div className="flex-1 w-full h-[calc(100%-40px)] overflow-hidden relative">
        <div className={activeTab === 'terminal' ? 'w-full h-full flex flex-col' : 'hidden'}>
          <PlaygroundTerminal
            result={lastResult}
            isExecuting={isExecuting}
            onJumpToLine={onJumpToLine}
            onHeal={onHeal}
          />
        </div>

        <div className={activeTab === 'diff' ? 'w-full h-full flex flex-col' : 'hidden'}>
          <PlaygroundDiff
            originalCode={code}
            fixedCode={fixedCode}
            sideBySide={sideBySide}
          />
        </div>

        <div className={activeTab === 'verifier' ? 'w-full h-full flex flex-col' : 'hidden'}>
          <PlaygroundVerifierPanel
            result={lastResult}
            hasFixedCode={hasDiff}
            fixedCode={fixedCode}
          />
        </div>
      </div>
    </div>
  );
};
