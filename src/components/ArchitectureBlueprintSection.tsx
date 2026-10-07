import React from 'react';
import { ArrowRight, Cpu, ShieldCheck, Zap, GitBranch, Terminal, Layers } from 'lucide-react';

export const ArchitectureBlueprintSection: React.FC = () => {
  return (
    <section id="architecture" className="w-full bg-dusk-gradient py-24 px-6 select-none relative overflow-hidden border-y border-graphite-border">
      
      {/* Background Blueprint Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(#69bee2 1px, transparent 1px), linear-gradient(90deg, #69bee2 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-[1240px] mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#1f1d1c]/80 border border-graphite-border mb-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-ash-text font-medium">
            Product Architecture
          </span>
        </div>

        {/* Display Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-paper-white tracking-[-0.025em] leading-tight max-w-2xl">
          Not just a static linter
        </h2>

        {/* Subhead */}
        <p className="mt-4 text-base sm:text-lg text-ash-text max-w-xl font-normal leading-relaxed">
          Everything your codebase deserves to detect, isolate, and repair in real time.
        </p>

        {/* Signal Blue CTA Button (Convex Style) */}
        <div className="mt-6">
          <a
            href="https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-signal-blue hover:bg-[#7dd0f5] text-ink-black font-medium text-sm transition-colors cursor-pointer"
          >
            <span>Explore architecture</span>
            <ArrowRight className="w-4 h-4 text-ink-black" />
          </a>
        </div>

        {/* Glowing Isometric Blueprint Hardware Board (Video Frame 00:04 - 00:06) */}
        <div className="w-full mt-16 max-w-[1040px] bg-[#141414]/90 rounded-2xl border border-graphite-border p-6 sm:p-10 relative backdrop-blur-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Column Callouts */}
            <div className="md:col-span-4 flex flex-col gap-3 text-left">
              <div className="p-3.5 rounded-xl bg-charcoal-surface border border-graphite-border flex items-center justify-between group hover:border-signal-blue/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-signal-blue" />
                  <span className="text-xs font-mono text-paper-white font-medium">
                    CPython AST Parser
                  </span>
                </div>
                <span className="text-[10px] font-mono text-fog-text">01</span>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal-surface border border-graphite-border flex items-center justify-between group hover:border-signal-blue/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-mint-green" />
                  <span className="text-xs font-mono text-paper-white font-medium">
                    Pyodide WASM Sandbox
                  </span>
                </div>
                <span className="text-[10px] font-mono text-fog-text">02</span>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal-surface border border-graphite-border flex items-center justify-between group hover:border-signal-blue/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-hot-pink" />
                  <span className="text-xs font-mono text-paper-white font-medium">
                    Traceback Interceptor
                  </span>
                </div>
                <span className="text-[10px] font-mono text-fog-text">03</span>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal-surface border border-graphite-border flex items-center justify-between group hover:border-signal-blue/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-canary-yellow" />
                  <span className="text-xs font-mono text-paper-white font-medium">
                    Deterministic Harness
                  </span>
                </div>
                <span className="text-[10px] font-mono text-fog-text">04</span>
              </div>
            </div>

            {/* Center Glowing Isometric Core Platform */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#222222] to-[#161616] rounded-xl border border-graphite-border relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1a233a] to-[#253965] border border-signal-blue/40 flex items-center justify-center relative mb-4">
                <Cpu className="w-10 h-10 text-signal-blue animate-pulse" />
                <div className="absolute -inset-1 rounded-2xl bg-signal-blue/20 blur-sm pointer-events-none" />
              </div>

              <span className="text-sm font-bold text-paper-white tracking-tight">
                Deterministic Execution Core
              </span>
              <span className="text-xs font-mono text-ash-text mt-1">
                Zero Regressions · AST Diffing
              </span>

              {/* Connecting circuit pills */}
              <div className="mt-5 w-full flex flex-col gap-2">
                <div className="w-full py-1.5 px-3 rounded bg-ink-black border border-graphite-border flex items-center justify-between text-[11px] font-mono text-ash-text">
                  <span>Automatic Verification</span>
                  <span className="text-mint-green font-semibold">100% Deterministic</span>
                </div>
                <div className="w-full py-1.5 px-3 rounded bg-ink-black border border-graphite-border flex items-center justify-between text-[11px] font-mono text-ash-text">
                  <span>Inference Latency</span>
                  <span className="text-canary-yellow font-semibold">&lt; 200ms</span>
                </div>
              </div>
            </div>

            {/* Right Column Callouts */}
            <div className="md:col-span-4 flex flex-col gap-3 text-left">
              <div className="p-3.5 rounded-xl bg-charcoal-surface border border-graphite-border flex items-center justify-between group hover:border-signal-blue/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-canary-yellow" />
                  <span className="text-xs font-mono text-paper-white font-medium">
                    Qwen 2.5 Coder 3B
                  </span>
                </div>
                <span className="text-[10px] font-mono text-fog-text">05</span>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal-surface border border-graphite-border flex items-center justify-between group hover:border-signal-blue/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <GitBranch className="w-4 h-4 text-signal-blue" />
                  <span className="text-xs font-mono text-paper-white font-medium">
                    4-bit NF4 LoRA Adapter
                  </span>
                </div>
                <span className="text-[10px] font-mono text-fog-text">06</span>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal-surface border border-graphite-border flex items-center justify-between group hover:border-signal-blue/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-mint-green" />
                  <span className="text-xs font-mono text-paper-white font-medium">
                    Pass@1: 68.4% Accuracy
                  </span>
                </div>
                <span className="text-[10px] font-mono text-fog-text">07</span>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal-surface border border-graphite-border flex items-center justify-between group hover:border-signal-blue/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-iris-violet" />
                  <span className="text-xs font-mono text-paper-white font-medium">
                    Minimal 1.9 GB Footprint
                  </span>
                </div>
                <span className="text-[10px] font-mono text-fog-text">08</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
