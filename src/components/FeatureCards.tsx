import React from 'react';
import { TerminalSquare, SplitSquareVertical, Sparkles } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: TerminalSquare,
      title: 'In-Browser Sandbox (Pyodide Wasm)',
      description:
        'Executes Python code directly in the client browser using WebAssembly. Eliminates server execution compute bills, prevents arbitrary code vulnerabilities, and runs with 0ms network latency.',
    },
    {
      icon: SplitSquareVertical,
      title: 'Deterministic Traceback Extraction',
      description:
        'CPython runtime standard libraries capture stderr buffers, extract offending line numbers, and classify exception types before prompt assembly. The model is never forced to guess syntax errors.',
    },
    {
      icon: Sparkles,
      title: 'Zero Conversational Hallucination',
      description:
        'Trained strictly on response-only loss within the 3-turn ChatML format. Bug Whisper does not emit apologetic filler or generic marketing prose—it delivers clean, executable Python fixes directly.',
    },
  ];

  return (
    <section className="w-full bg-cream-surface py-16 px-6 border-b border-mist-divider">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.05em] text-fog-text">
            Core Engineering Principles
          </span>
          <h2 className="text-3xl font-bold text-ink-black tracking-[-0.025em]">
            Why Bug Whisper Excels at Code Repair
          </h2>
          <p className="text-sm text-slate-text font-normal">
            Designed from the ground up to pair deterministic runtime execution with specialized low-rank code intelligence.
          </p>
        </div>

        {/* 3 Convex Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="flex flex-col gap-4 p-6 rounded-xl bg-paper-white border border-mist-divider"
              >
                <div className="w-9 h-9 rounded-lg bg-cream-surface border border-mist-divider flex items-center justify-center text-ink-black">
                  <Icon className="w-4 h-4 text-slate-text" />
                </div>
                <h3 className="text-lg font-bold text-ink-black tracking-tight leading-snug">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-text leading-relaxed font-normal">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
