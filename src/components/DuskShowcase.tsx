import React from 'react';
import { Cpu, Layers, ShieldCheck, Zap } from 'lucide-react';

export const DuskShowcase: React.FC = () => {
  const specs = [
    {
      icon: Cpu,
      title: 'Triton Fused LoRA',
      badge: 'r=16 · α=32',
      badgeColor: '#7bd88f',
      description:
        'Trained with LoRA dropout 0.0, unlocking 100% of Unsloth fused Triton cross-entropy kernels for fast execution on single-T4 GPUs without PCIe bottlenecks.',
    },
    {
      icon: Layers,
      title: 'Response-Only Loss',
      badge: '100% Code Target',
      badgeColor: '#948ae3',
      description:
        'Cross-entropy loss computed strictly on assistant remediation turns. Gradients focus exclusively on bug resolution rather than memorizing stack traces.',
    },
    {
      icon: ShieldCheck,
      title: 'Deterministic Sandbox',
      badge: 'CPython 3.12 Wasm',
      badgeColor: '#69bee2',
      description:
        'Python runtime runs safely in a browser WebWorker. Tracebacks, line numbers, and standard library exceptions are extracted deterministically in 0ms.',
    },
    {
      icon: Zap,
      title: 'ChatML Alignment',
      badge: '3-Turn Prompt Contract',
      badgeColor: '#f8e67a',
      description:
        'Prompts strictly uphold the 3-turn ChatML template used during SFT. Eliminates conversational preamble and delivers direct, runnable Python code.',
    },
  ];

  return (
    <section className="w-full bg-dusk-gradient text-paper-white py-16 px-6 border-b border-graphite-border">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center gap-10">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-charcoal-surface border border-graphite-border">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.05em] text-ash-text">
            Architecture &amp; SFT Specifications
          </span>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col gap-3 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-paper-white tracking-[-0.025em] leading-[1.25]">
            Trained for Precision, Not Conversation.
          </h2>
          <p className="text-sm sm:text-base text-ash-text leading-relaxed">
            Standard chat models waste tokens attempting to simulate Python syntax in their weights. Bug Whisper decouples deterministic exception detection from code repair intelligence.
          </p>
        </div>

        {/* 4 Architectural Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-2">
          {specs.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div
                key={i}
                className="rounded-xl bg-ink-black border border-graphite-border p-5 flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-charcoal-surface border border-graphite-border flex items-center justify-center text-paper-white">
                      <Icon className="w-4 h-4 text-ash-text" />
                    </div>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded border font-medium"
                      style={{
                        color: spec.badgeColor,
                        borderColor: `${spec.badgeColor}40`,
                        backgroundColor: `${spec.badgeColor}15`,
                      }}
                    >
                      {spec.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-paper-white tracking-tight">
                    {spec.title}
                  </h3>
                  <p className="text-xs text-ash-text leading-relaxed">
                    {spec.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
