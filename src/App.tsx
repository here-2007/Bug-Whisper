import { useState, useCallback, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroWorkbench } from './components/HeroWorkbench';
import { LlmsLoveSection } from './components/LlmsLoveSection';
import { ArchitectureBlueprintSection } from './components/ArchitectureBlueprintSection';
import { BenchmarkDashboard } from './components/BenchmarkDashboard';
import { TestimonialsSection } from './components/TestimonialsSection';
import { IntegrationsSection } from './components/IntegrationsSection';
import { BugPresetsStrip } from './components/BugPresetsStrip';
import { CodeEditor } from './components/CodeEditor';
import { DiffViewer } from './components/DiffViewer';
import { TerminalDrawer } from './components/TerminalDrawer';
import { FaqSection } from './components/FaqSection';
import { PreFooterBanner } from './components/PreFooterBanner';
import { Footer } from './components/Footer';
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

  const handleLaunchStudio = useCallback(() => {
    const el = document.getElementById('studio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
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
    <div className="min-h-screen bg-cream-surface flex flex-col text-ink-black font-sans selection:bg-[#e5e5e5]">
      {/* 1. Top Navigation */}
      <Navbar
        currentProvider={settings.provider}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Convex Hero & Interactive Workbench (Video Frame 00:00 - 00:02) */}
      <HeroWorkbench onOpenStudio={handleLaunchStudio} />

      {/* 3. LLMs love Bug Whisper (Video Frame 00:02 - 00:03) */}
      <LlmsLoveSection />

      {/* 4. Architecture Blueprint (Video Frame 00:04 - 00:06) */}
      <ArchitectureBlueprintSection />

      {/* 5. Empirical Benchmark Dashboard (Convex Component 142) */}
      <div id="benchmarks" className="scroll-mt-16">
        <BenchmarkDashboard />
      </div>

      {/* 6. Loved by Developers - Testimonial Grid (Video Frame 00:07 - 00:10) */}
      <TestimonialsSection />

      {/* 7. Ecosystem Integrations (Video Frame 00:11) */}
      <IntegrationsSection />

      {/* 8. Full Interactive Monaco Studio Section */}
      <section id="studio" className="w-full bg-cream-surface py-16 px-6 border-b border-mist-divider scroll-mt-16">
        <div className="max-w-[1240px] w-full mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-mint-green animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-fog-text">
                Live Interactive Sandbox
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-ink-black tracking-tight">
                Bug Whisper Interactive Studio
              </h2>
              <span className="text-xs font-mono text-fog-text">
                Press <kbd className="px-1.5 py-0.5 rounded bg-paper-white border border-mist-divider text-ink-black font-semibold">Ctrl+Enter</kbd> to run in Pyodide Sandbox
              </span>
            </div>
            <p className="text-sm text-slate-text max-w-2xl font-normal">
              Execute Python client-side via WebAssembly, capture deterministic tracebacks, inspect synthetic repairs in side-by-side diff, and accept patches in one click.
            </p>
          </div>

          {/* Preset Chips */}
          <div className="pt-2">
            <BugPresetsStrip
              activePresetId={activePreset?.id ?? null}
              onSelectPreset={handleSelectPreset}
            />
          </div>

          {/* Studio Split: Left (Editor + Terminal) / Right (DiffViewer) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[640px] mt-2">
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
        </div>
      </section>

      {/* 9. Technical FAQ Accordion */}
      <div id="faq" className="scroll-mt-16">
        <FaqSection />
      </div>

      {/* 10. Pre-Footer Dark Grid Banner (Video Frame 00:12 - 00:13) */}
      <PreFooterBanner />

      {/* 11. Convex Engineering Footer (Video Frame 00:13) */}
      <Footer />

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
