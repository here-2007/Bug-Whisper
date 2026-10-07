import { useState, useCallback, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { BugPresetsStrip } from './components/BugPresetsStrip';
import { CodeEditor } from './components/CodeEditor';
import { DiffViewer } from './components/DiffViewer';
import { TerminalDrawer } from './components/TerminalDrawer';
import { SettingsDrawer } from './components/SettingsDrawer';
import { useSettings } from './hooks/useSettings';
import { usePyodide } from './hooks/usePyodide';
import { runInference } from './lib/inference';
import type { BugPreset } from './types/presets';
import { BUG_PRESETS } from './constants/presets';

export default function App() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<BugPreset | null>(BUG_PRESETS[0]);
  const [code, setCode] = useState<string>(BUG_PRESETS[0]?.buggyCode ?? '');
  const [fixedCode, setFixedCode] = useState<string>(BUG_PRESETS[0]?.fixedCode ?? '');
  const [inferenceLatency, setInferenceLatency] = useState<number | null>(null);
  const [isInferring, setIsInferring] = useState<boolean>(false);
  const [highlightLine, setHighlightLine] = useState<number | null>(null);

  const { status, isExecuting, lastResult, runCode, clearOutput } = usePyodide();

  // Trigger inference to synthesize fix
  const triggerRemediation = useCallback(
    async (codeToFix: string, stderrText: string) => {
      setIsInferring(true);
      try {
        const response = await runInference({
          code: codeToFix,
          stderr: stderrText,
          settings,
        });
        setFixedCode(response.fixedCode);
        setInferenceLatency(response.latencyMs);
      } catch (err) {
        console.error('Inference error:', err);
      } finally {
        setIsInferring(false);
      }
    },
    [settings]
  );

  // When selecting a preset bug
  const handleSelectPreset = useCallback(
    (preset: BugPreset) => {
      setActivePreset(preset);
      setCode(preset.buggyCode);
      setFixedCode(preset.fixedCode);
      setHighlightLine(null);
      clearOutput();
    },
    [clearOutput]
  );

  // Execute Python in Pyodide
  const handleRun = useCallback(async () => {
    if (isExecuting) return;
    setHighlightLine(null);
    const res = await runCode(code);

    // If code encountered an unhandled exception, automatically trigger inference
    if (res && !res.success) {
      if (res.lineNumber) {
        setHighlightLine(res.lineNumber);
      }
      void triggerRemediation(code, res.traceback || res.stderr || '');
    }
  }, [isExecuting, runCode, code, triggerRemediation]);

  // Apply model fix to active editor
  const handleAcceptFix = useCallback(
    (acceptedCode: string) => {
      setCode(acceptedCode);
      setHighlightLine(null);
      clearOutput();
    },
    [clearOutput]
  );

  // Jump to failing line
  const handleJumpToLine = useCallback((line: number) => {
    setHighlightLine(line);
  }, []);

  // Global keyboard shortcuts (Ctrl+Enter / Cmd+Enter)
  const handleRunRef = useRef(handleRun);
  useEffect(() => {
    handleRunRef.current = handleRun;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-cream-surface flex flex-col text-ink-black font-sans">
      {/* Top Navigation */}
      <Navbar
        currentProvider={settings.provider}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Preset Bug Selector Strip */}
      <BugPresetsStrip
        activePresetId={activePreset?.id ?? null}
        onSelectPreset={handleSelectPreset}
      />

      {/* Primary Studio Workspace */}
      <main className="flex-1 p-6 flex flex-col gap-6 max-w-[1600px] w-full mx-auto">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[640px]">
          {/* Left Panel: Python Code Editor + Terminal Drawer */}
          <div className="flex flex-col gap-5 min-h-[600px]">
            {/* Monaco Python Code Editor */}
            <div className="flex-1 flex flex-col min-h-[360px]">
              <CodeEditor
                value={code}
                onChange={(newVal) => setCode(newVal)}
                onRun={handleRun}
                isExecuting={isExecuting}
                highlightLine={highlightLine}
                className="flex-1"
              />
            </div>

            {/* In-Browser Python Terminal HUD */}
            <TerminalDrawer
              status={status}
              isExecuting={isExecuting}
              result={lastResult}
              onClear={clearOutput}
              onJumpToLine={handleJumpToLine}
              onRemediate={() => {
                void triggerRemediation(code, lastResult?.traceback || lastResult?.stderr || '');
              }}
              className="min-h-[220px]"
            />
          </div>

          {/* Right Panel: Side-by-Side Monaco Diff Viewer */}
          <div className="flex flex-col min-h-[600px]">
            <DiffViewer
              originalCode={code}
              fixedCode={fixedCode}
              onAcceptFix={handleAcceptFix}
              latencyMs={inferenceLatency}
              providerLabel={
                isInferring
                  ? 'Synthesizing Fix...'
                  : settings.provider === 'mock'
                    ? 'Qwen 2.5 Coder 3B (LoRA)'
                    : settings.provider.toUpperCase()
              }
              className="flex-1"
            />
          </div>
        </div>
      </main>

      {/* Settings Modal Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetSettings={resetSettings}
      />
    </div>
  );
}
