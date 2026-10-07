import React from 'react';
import { HeroCodeEditor } from './HeroCodeEditor';
import { HeroRuntimePreview } from './HeroRuntimePreview';
import { HeroDatabaseTable } from './HeroDatabaseTable';
import { usePythonStudioDemo } from '../../hooks/usePythonStudioDemo';

export const HeroWorkbench: React.FC = () => {
  const {
    isPatched,
    togglePatched,
    tests,
    runTests,
    isRunning,
    showBlockedHint,
  } = usePythonStudioDemo();

  return (
    <div className="w-full rounded-xl border border-[#38383a] bg-[#141414] p-3 sm:p-4 select-none">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-stretch">
        {/* Left Sub-card: Python Code Editor (7 cols) */}
        <div className="xl:col-span-7 flex flex-col min-h-[460px]">
          <HeroCodeEditor
            isPatched={isPatched}
            onTogglePatch={togglePatched}
          />
        </div>

        {/* Right Sub-cards: Stacked Runtime Terminal & Verifier Table (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-3 min-h-[460px]">
          <HeroRuntimePreview
            tests={tests}
            onRunTests={runTests}
            isRunning={isRunning}
            showBlockedHint={showBlockedHint}
          />
          <HeroDatabaseTable isPatched={isPatched} />
        </div>
      </div>
    </div>
  );
};
