import React, { useState, useEffect, useCallback } from 'react';
import { PlaygroundHeader } from './PlaygroundHeader';
import { PlaygroundEditor } from './PlaygroundEditor';
import { PlaygroundTabs, type RightTab } from './PlaygroundTabs';
import { PlaygroundTerminal } from './PlaygroundTerminal';
import { PlaygroundDiff } from './PlaygroundDiff';
import { PlaygroundVerifierPanel } from './PlaygroundVerifierPanel';
import { BUG_PRESETS } from '../../constants/presets';
import { DEFAULT_INFERENCE_SETTINGS } from '../../types/settings';
import { usePyodide } from '../../hooks/usePyodide';
import { runInference } from '../../lib/inference';
import type { BugPreset } from '../../types/presets';

export const BugWhisperPlayground: React.FC = () => {
  const [activePreset, setActivePreset] = useState<BugPreset>(BUG_PRESETS[0]);
  const [code, setCode] = useState<string>(BUG_PRESETS[0].buggyCode);
  const [fixedCode, setFixedCode] = useState<string>(BUG_PRESETS[0].fixedCode);
  const [activeTab, setActiveTab] = useState<RightTab>('terminal');
  const [isFixing, setIsFixing] = useState<boolean>(false);
  const [diffLatency, setDiffLatency] = useState<number>(185);

  const { status, isExecuting, lastResult, runCode } = usePyodide();

  // Execute initial preset on first load or when preset changes
  useEffect(() => {
    if (status === 'ready') {
      runCode(code);
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectPreset = useCallback((preset: BugPreset) => {
    setActivePreset(preset);
    setCode(preset.buggyCode);
    setFixedCode(preset.fixedCode);
    setActiveTab('terminal');
    runCode(preset.buggyCode);
  }, [runCode]);

  const handleRun = useCallback(() => {
    setActiveTab('terminal');
    runCode(code);
  }, [code, runCode]);

  const handleHeal = useCallback(async () => {
    setIsFixing(true);
    try {
      const res = await runInference({
        code,
        stderr: lastResult?.stderr || lastResult?.traceback || '',
        settings: DEFAULT_INFERENCE_SETTINGS,
      });
      setFixedCode(res.fixedCode);
      setDiffLatency(res.latencyMs || 185);
      setActiveTab('diff');
    } finally {
      setIsFixing(false);
    }
  }, [code, lastResult]);

  const handleAcceptFix = useCallback((acceptedCode: string) => {
    setCode(acceptedCode);
    setActiveTab('terminal');
    runCode(acceptedCode);
  }, [runCode]);

  const handleReset = useCallback(() => {
    setCode(activePreset.buggyCode);
    setFixedCode(activePreset.fixedCode);
    setActiveTab('terminal');
    runCode(activePreset.buggyCode);
  }, [activePreset, runCode]);

  const hasDiff = Boolean(fixedCode && code.trim() !== fixedCode.trim());
  const hasError = Boolean(lastResult && !lastResult.success);

  return (
    <div className="w-full rounded-[22px] border-[2px] border-[#c89880] bg-[#161715] overflow-hidden flex flex-col select-none">
      <PlaygroundHeader
        activePresetId={activePreset.id}
        onSelectPreset={handleSelectPreset}
        onRun={handleRun}
        onHeal={handleHeal}
        onReset={handleReset}
        isExecuting={isExecuting}
        isFixing={isFixing}
        status={status}
      />

      {/* Main 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left: Code Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <PlaygroundEditor
            code={code}
            onChange={setCode}
            onRun={handleRun}
            highlightLine={lastResult?.lineNumber}
          />
        </div>

        {/* Right: Multi-tab Terminal / Diff / Verifier (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-[#141414]">
          <PlaygroundTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hasDiff={hasDiff}
            hasError={hasError}
          />

          <div className="flex-1 flex flex-col">
            {activeTab === 'terminal' && (
              <PlaygroundTerminal
                result={lastResult}
                isExecuting={isExecuting}
                onJumpToLine={() => {}}
                onHeal={handleHeal}
              />
            )}
            {activeTab === 'diff' && (
              <PlaygroundDiff
                originalCode={code}
                fixedCode={fixedCode}
                onAcceptFix={handleAcceptFix}
                latencyMs={diffLatency}
              />
            )}
            {activeTab === 'verifier' && (
              <PlaygroundVerifierPanel
                result={lastResult}
                hasFixedCode={hasDiff}
                fixedCode={fixedCode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
