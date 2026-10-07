import React, { useState } from 'react';
import { Copy, Check, Play, RefreshCw, ArrowRight } from 'lucide-react';

interface HeroWorkbenchProps {
  onOpenStudio?: () => void;
}

export const HeroWorkbench: React.FC<HeroWorkbenchProps> = ({ onOpenStudio }) => {
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isBugFixed, setIsBugFixed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('pip install bugwhisper');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleBug = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsBugFixed(!isBugFixed);
      setIsRunning(false);
    }, 400);
  };

  const steps = [
    {
      title: 'Everything is deterministic',
      description:
        'From CPython AST parsing to isolated WebAssembly sandboxing, execute Python directly in the browser. Tracebacks and frame scopes are extracted deterministically so our fine-tuned 3B model targets faults with zero hallucinations.',
    },
    {
      title: 'Always in sync',
      description:
        'Watch syntax and runtime tests react in milliseconds as code is typed. As soon as an exception occurs, the 3B LoRA model synthesizes the minimal patch in under 200ms and updates your diff view instantly.',
    },
    {
      title: 'Zero-regression verification',
      description:
        'Every synthesized patch is re-evaluated in the deterministic harness before presenting the diff. If a patch fails syntax or unit tests, it is rejected deterministically before touching your repository.',
    },
  ];

  return (
    <section className="w-full bg-cream-surface py-12 lg:py-16 px-6 select-none border-b border-mist-divider">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column (5 cols): Headline, CTA, Command Snippet, Vertical Feature Tabs */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-ink-black tracking-[-0.05em] leading-[1.05]">
              The runtime platform that keeps Python code in sync
            </h1>
            <p className="text-base text-slate-text leading-relaxed font-normal">
              Deterministic CPython AST validation meets fine-tuned Qwen 2.5 Coder 3B intelligence. Zero regressions, instant traceback healing.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#studio"
              onClick={onOpenStudio}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-ink-black hover:bg-[#292929] text-paper-white font-medium text-sm transition-colors cursor-pointer"
            >
              Start repairing
            </a>

            {/* Command Snippet Card */}
            <button
              type="button"
              onClick={handleCopyCommand}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-charcoal-surface hover:bg-[#333333] border border-graphite-border font-mono text-xs text-paper-white transition-colors cursor-pointer group"
              title="Copy pip install command"
            >
              <span className="text-fog-text select-none">&gt;</span>
              <span className="text-paper-white font-medium">pip install bugwhisper</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-mint-green ml-1" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-ash-text group-hover:text-paper-white ml-1 transition-colors" />
              )}
            </button>
          </div>

          {/* Vertical Feature Tabs */}
          <div className="flex flex-col border-t border-mist-divider pt-6 gap-2">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.title}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-paper-white border-mist-divider'
                      : 'border-transparent hover:bg-[#eaeaea]/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-base font-bold tracking-tight ${
                        isActive ? 'text-ink-black' : 'text-slate-text'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-xs font-mono text-fog-text">
                      0{idx + 1}
                    </span>
                  </div>
                  {isActive && (
                    <p className="mt-2 text-sm text-slate-text leading-relaxed font-normal">
                      {step.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): The Big Dark Workbench Card */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="w-full rounded-xl bg-ink-black border border-graphite-border overflow-hidden">
            {/* Workbench Tab Header */}
            <div className="h-10 bg-charcoal-surface border-b border-graphite-border px-4 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-hot-pink" />
                <div className="w-2.5 h-2.5 rounded-full bg-canary-yellow" />
                <div className="w-2.5 h-2.5 rounded-full bg-mint-green" />
                <span className="ml-2 text-xs font-mono text-ash-text">
                  bug_repair_runtime.py
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ink-black border border-graphite-border text-fog-text uppercase">
                  Pyodide WASM
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ink-black border border-graphite-border text-mint-green">
                  Qwen-3B Ready
                </span>
              </div>
            </div>

            {/* Interior Split: Code Editor (Left) & Realtime Panels (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[440px]">
              
              {/* Left Sub-panel: Code Editor with "Try it out" Callout */}
              <div className="md:col-span-7 p-4 font-mono text-[13px] leading-[1.45] text-[#d7d7d7] border-b md:border-b-0 md:border-r border-graphite-border relative flex flex-col justify-between">
                
                {/* Floating "Try it out" Pill Badge */}
                <div className="absolute -left-3 top-28 hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-paper-white border border-mist-divider text-ink-black text-[11px] font-sans font-bold z-10">
                  <span className="w-2 h-2 rounded-full bg-hot-pink animate-ping" />
                  <span>Try it out</span>
                  <ArrowRight className="w-3 h-3 text-ink-black" />
                </div>

                <div className="space-y-1">
                  <div className="text-fog-text">
                    <span className="text-fog-text/60 select-none mr-3">1</span>
                    <span className="text-hot-pink">import</span> <span className="text-[#d7d7d7]">math</span>
                  </div>
                  <div className="text-fog-text">
                    <span className="text-fog-text/60 select-none mr-3">2</span>
                    <span className="text-hot-pink">from</span> <span className="text-[#d7d7d7]">typing</span> <span className="text-hot-pink">import</span> <span className="text-iris-violet">List, Optional</span>
                  </div>
                  <div>
                    <span className="text-fog-text/60 select-none mr-3">3</span>
                  </div>
                  <div>
                    <span className="text-fog-text/60 select-none mr-3">4</span>
                    <span className="text-hot-pink">def</span> <span className="text-canary-yellow">calculate_metrics</span>(values: <span className="text-iris-violet">List[float]</span>) -&gt; <span className="text-iris-violet">float</span>:
                  </div>
                  <div>
                    <span className="text-fog-text/60 select-none mr-3">5</span>
                    <span className="text-fog-text/60 select-none mr-3"> </span>
                    <span className="text-[#d7d7d7]">total = sum(values)</span>
                  </div>
                  <div>
                    <span className="text-fog-text/60 select-none mr-3">6</span>
                    <span className="text-fog-text/60 select-none mr-3"> </span>
                    <span className="text-fog-text"># Try running with empty list — ZeroDivision triggers!</span>
                  </div>
                  <div>
                    <span className="text-fog-text/60 select-none mr-3">7</span>
                    <span className="text-fog-text/60 select-none mr-3"> </span>
                    <span className="text-fog-text"># Change this or click "Auto Heal" to test:</span>
                  </div>

                  {/* Highlighted Buggy / Healed Line */}
                  <div
                    className={`py-0.5 px-1.5 rounded transition-colors ${
                      isBugFixed
                        ? 'bg-mint-green/15 text-mint-green'
                        : 'bg-hot-pink/15 text-[#ff8fa3]'
                    }`}
                  >
                    <span className="text-fog-text/60 select-none mr-3">8</span>
                    <span className="text-fog-text/60 select-none mr-3"> </span>
                    {isBugFixed ? (
                      <span>
                        <span className="text-hot-pink">return</span> total / len(values) <span className="text-hot-pink">if</span> len(values) &gt; <span className="text-mint-green">0</span> <span className="text-hot-pink">else</span> <span className="text-mint-green">0.0</span>
                      </span>
                    ) : (
                      <span>
                        <span className="text-hot-pink">return</span> total / len(values)
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-fog-text/60 select-none mr-3">9</span>
                  </div>
                  <div>
                    <span className="text-fog-text/60 select-none mr-3">10</span>
                    <span className="text-[#d7d7d7]">print(calculate_metrics([]))</span>
                  </div>
                </div>

                {/* Bottom Editor Action Bar */}
                <div className="pt-4 border-t border-graphite-border flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-fog-text">Status:</span>
                    {isBugFixed ? (
                      <span className="text-xs text-mint-green font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Repaired &amp; Verified
                      </span>
                    ) : (
                      <span className="text-xs text-hot-pink font-medium flex items-center gap-1">
                        ZeroDivisionError at line 8
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleBug}
                    disabled={isRunning}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                      isBugFixed
                        ? 'bg-charcoal-surface hover:bg-[#333333] text-paper-white border border-graphite-border'
                        : 'bg-signal-blue text-ink-black hover:bg-[#7dd0f5]'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Synthesizing...</span>
                      </>
                    ) : isBugFixed ? (
                      <>
                        <RefreshCw className="w-3 h-3" />
                        <span>Reset Bug</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-ink-black" />
                        <span>Auto Heal (Qwen 3B)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Sub-panel: Stacked Live Test Runner + Database Table */}
              <div className="md:col-span-5 flex flex-col bg-[#111111]">
                
                {/* Top Panel: Live Test Suite Runner */}
                <div className="p-4 border-b border-graphite-border">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-graphite-border/60">
                    <span className="text-xs font-mono text-ash-text">
                      test_runner.py
                    </span>
                    <span className="text-[10px] font-mono text-fog-text">
                      Last run: just now
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-fog-text">test_ast_compilation</span>
                      <span className="text-mint-green font-semibold">PASS</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-fog-text">test_empty_list_division</span>
                      {isBugFixed ? (
                        <span className="text-mint-green font-semibold">PASS (0.0ms)</span>
                      ) : (
                        <span className="text-hot-pink font-semibold">FAIL (line 8)</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-fog-text">test_deterministic_tb</span>
                      <span className="text-mint-green font-semibold">PASS</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Panel: Live Database / AST Trace Table (Component 142) */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-graphite-border/60">
                      <span className="text-xs font-mono text-ash-text">
                        dashboard.bugwhisper.dev
                      </span>
                      <span className="text-[10px] font-mono text-fog-text">
                        AST Trace Log
                      </span>
                    </div>

                    {/* Table View */}
                    <div className="w-full text-[11px] font-mono">
                      <div className="grid grid-cols-12 text-fog-text border-b border-graphite-border/40 pb-1 mb-1.5 font-medium">
                        <span className="col-span-3">_id</span>
                        <span className="col-span-4">error_type</span>
                        <span className="col-span-2">line</span>
                        <span className="col-span-3 text-right">status</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="grid grid-cols-12 text-paper-white items-center">
                          <span className="col-span-3 text-fog-text">bw_8f3a</span>
                          <span className="col-span-4 text-hot-pink truncate">ZeroDivision</span>
                          <span className="col-span-2 text-ash-text">8</span>
                          <span className="col-span-3 text-right">
                            {isBugFixed ? (
                              <span className="px-1.5 py-0.5 rounded bg-mint-green/20 text-mint-green text-[10px]">
                                HEALED
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded bg-hot-pink/20 text-hot-pink text-[10px]">
                                ACTIVE
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="grid grid-cols-12 text-paper-white items-center">
                          <span className="col-span-3 text-fog-text">bw_12c0</span>
                          <span className="col-span-4 text-ash-text truncate">TypeError</span>
                          <span className="col-span-2 text-ash-text">14</span>
                          <span className="col-span-3 text-right">
                            <span className="px-1.5 py-0.5 rounded bg-mint-green/20 text-mint-green text-[10px]">
                              PASS
                            </span>
                          </span>
                        </div>
                        <div className="grid grid-cols-12 text-paper-white items-center">
                          <span className="col-span-3 text-fog-text">bw_99b7</span>
                          <span className="col-span-4 text-ash-text truncate">IndexError</span>
                          <span className="col-span-2 text-ash-text">22</span>
                          <span className="col-span-3 text-right">
                            <span className="px-1.5 py-0.5 rounded bg-mint-green/20 text-mint-green text-[10px]">
                              PASS
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Studio jump link */}
                  <div className="pt-3 border-t border-graphite-border/60 flex items-center justify-between">
                    <span className="text-[10px] text-fog-text font-mono">
                      Pass@1: 68.4% (Qwen-3B)
                    </span>
                    <a
                      href="#studio"
                      className="text-xs text-signal-blue hover:underline font-mono flex items-center gap-1"
                    >
                      <span>Open Full Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
