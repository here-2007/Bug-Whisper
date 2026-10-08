import React, { useState, useEffect, useCallback } from 'react';
import { PlaygroundHeader } from './PlaygroundHeader';
import { PlaygroundEditor } from './PlaygroundEditor';
import { PlaygroundRightPane } from './PlaygroundRightPane';
import { type RightTab } from './PlaygroundTabs';
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
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const [sideBySide, setSideBySide] = useState<boolean>(true);
  const [diffCopied, setDiffCopied] = useState<boolean>(false);

  const { status, isExecuting, lastResult, runCode, clearOutput } = usePyodide();

  // Execute initial preset on mount once status becomes ready
  useEffect(() => {
    if (status === 'ready') {
      runCode(code);
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derive effective highlighted line without triggering cascading effect re-renders
  const effectiveHighlightedLine =
    highlightedLine !== null
      ? highlightedLine
      : lastResult && !lastResult.success && lastResult.lineNumber
        ? lastResult.lineNumber
        : null;

  const handleSelectPreset = useCallback((preset: BugPreset) => {
    setActivePreset(preset);
    setCode(preset.buggyCode);
    setFixedCode(preset.fixedCode);
    setHighlightedLine(preset.offendingLine || null);
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
      setActiveTab('diff');
    } finally {
      setIsFixing(false);
    }
  }, [code, lastResult]);

  const handleAcceptFix = useCallback(() => {
    setCode(fixedCode);
    setHighlightedLine(null);
    setActiveTab('terminal');
    runCode(fixedCode);
  }, [fixedCode, runCode]);

  const handleReset = useCallback(() => {
    setCode(activePreset.buggyCode);
    setFixedCode(activePreset.fixedCode);
    setHighlightedLine(activePreset.offendingLine || null);
    setActiveTab('terminal');
    runCode(activePreset.buggyCode);
  }, [activePreset, runCode]);

  const handleCopyDiff = useCallback(async () => {
    await navigator.clipboard.writeText(fixedCode);
    setDiffCopied(true);
    setTimeout(() => setDiffCopied(false), 2000);
  }, [fixedCode]);

  return (
    <div className="w-full rounded-xl border border-[#38383a] bg-[#141414] overflow-hidden flex flex-col shadow-none">
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

      {/* Main 2-Column Split Workspace (Equal 50/50, Exactly Aligned) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2d3128] min-h-[560px] lg:h-[560px]">
        {/* Left: Python Code Editor */}
        <div className="min-h-[380px] lg:h-full flex flex-col overflow-hidden bg-[#141414]">
          <PlaygroundEditor
            code={code}
            onChange={(newCode) => {
              setCode(newCode);
              setHighlightedLine(null);
            }}
            onRun={handleRun}
            highlightLine={effectiveHighlightedLine}
          />
        </div>

        {/* Right: Multi-tab Terminal / Diff / Verifier */}
        <PlaygroundRightPane
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasDiff={Boolean(fixedCode && code.trim() !== fixedCode.trim())}
          hasError={Boolean(lastResult && !lastResult.success)}
          sideBySide={sideBySide}
          onToggleSideBySide={() => setSideBySide(!sideBySide)}
          onCopyDiff={handleCopyDiff}
          diffCopied={diffCopied}
          onAcceptFix={handleAcceptFix}
          onClearTerminal={clearOutput}
          lastResult={lastResult}
          isExecuting={isExecuting}
          onJumpToLine={(line) => setHighlightedLine(line)}
          onHeal={handleHeal}
          code={code}
          fixedCode={fixedCode}
        />
      </div>
    </div>
  );
};
