import React from 'react';
import { ConvexCodeEditor } from './ConvexCodeEditor';
import { ConvexTodoPreview } from './ConvexTodoPreview';
import { ConvexDatabaseTable } from './ConvexDatabaseTable';
import { usePythonStudioDemo } from '../../hooks/usePythonStudioDemo';

export const ConvexHeroWorkbench: React.FC = () => {
  const {
    isPatched,
    togglePatched,
    tests,
    runTests,
    isRunning,
    showBlockedHint,
  } = usePythonStudioDemo();

  return (
    <div className="w-full rounded-[22px] border-[2px] border-[#c89880] bg-[#161715] p-2.5 sm:p-3.5 select-none">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-stretch">
        {/* Left Sub-card: Python Code Editor (7 cols) */}
        <div className="xl:col-span-7 flex flex-col min-h-[480px]">
          <ConvexCodeEditor
            isPatched={isPatched}
            onTogglePatch={togglePatched}
          />
        </div>

        {/* Right Sub-cards: Stacked Runtime Terminal & Verifier Table (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-3 min-h-[480px]">
          <ConvexTodoPreview
            tests={tests}
            onRunTests={runTests}
            isRunning={isRunning}
            showBlockedHint={showBlockedHint}
          />
          <ConvexDatabaseTable isPatched={isPatched} />
        </div>
      </div>
    </div>
  );
};
