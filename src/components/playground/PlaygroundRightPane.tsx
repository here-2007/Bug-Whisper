import React from 'react';
import { PlaygroundTerminal } from './PlaygroundTerminal';
import { ErrorExplanationBlock } from './ErrorExplanationBlock';
import type { ExecutionResult } from '../../types/pyodide';
import type { ExplanationResponse } from '../../lib/inference';

interface PlaygroundRightPaneProps {
  lastResult: ExecutionResult | null;
  explanation: ExplanationResponse | null;
  isExecuting: boolean;
  isExplaining: boolean;
  onJumpToLine: (line: number) => void;
  onClearTerminal: () => void;
}

export const PlaygroundRightPane: React.FC<PlaygroundRightPaneProps> = ({
  lastResult,
  explanation,
  isExecuting,
  isExplaining,
  onJumpToLine,
  onClearTerminal,
}) => {
  return (
    <div className="min-h-[460px] lg:h-full flex flex-col overflow-hidden bg-[#141414] divide-y divide-[#2d3128]">
      {/* Upper Half: Terminal Output */}
      <div className="flex-1 min-h-[220px] h-1/2 flex flex-col overflow-hidden">
        <PlaygroundTerminal
          result={lastResult}
          isExecuting={isExecuting}
          onJumpToLine={onJumpToLine}
          onClearTerminal={onClearTerminal}
        />
      </div>

      {/* Lower Half: Error Explanation */}
      <div className="flex-1 min-h-[220px] h-1/2 flex flex-col overflow-hidden">
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

