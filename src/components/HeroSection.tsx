import React, { useState } from 'react';
import { ArrowDown, Copy, Check, ExternalLink, Terminal } from 'lucide-react';

interface HeroSectionProps {
  onLaunchStudio?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchStudio }) => {
  const [copied, setCopied] = useState(false);
  const installCmd = 'pip install bugwhisper';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy install command:', err);
    }
  };

  return (
    <section className="w-full bg-cream-surface pt-16 pb-14 px-6 border-b border-mist-divider">
      <div className="max-w-[1200px] mx-auto flex flex-col items-start gap-8">
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-paper-white border border-mist-divider">
          <span className="w-2 h-2 rounded-full bg-mint-green" />
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.05em] text-slate-text">
            Fine-Tuned Python Code Repair · Qwen 2.5 Coder 3B
          </span>
        </div>

        {/* Display Headline */}
        <div className="flex flex-col gap-2 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink-black tracking-[-0.05em] leading-[1.05]">
            Deterministic Runtime.
            <br />
            <span className="text-slate-text">Surgical Code Fixes.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-text leading-relaxed max-w-2xl font-normal">
            Don&apos;t ask an LLM to hallucinate Python bytecode. Bug Whisper executes code inside an in-browser CPython Wasm sandbox, captures exact exception tracebacks, and prompts a 3B parameter coder model fine-tuned on real-world Git error commits.
          </p>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Primary Filled Dark CTA */}
          <button
            type="button"
            onClick={onLaunchStudio}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ink-black hover:bg-charcoal-surface text-paper-white text-[15px] font-medium tracking-tight transition-colors cursor-pointer"
          >
            <span>Launch Studio</span>
            <ArrowDown className="w-4 h-4 text-ash-text" />
          </button>

          {/* Command Snippet Card */}
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-charcoal-surface border border-graphite-border select-none">
            <Terminal className="w-3.5 h-3.5 text-fog-text" />
            <span className="font-mono text-[13px] text-paper-white">
              {installCmd}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded hover:bg-ink-black text-ash-text hover:text-paper-white transition-colors cursor-pointer ml-1"
              title="Copy install command"
              aria-label="Copy install command"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-mint-green" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Ghost Kaggle Link Button */}
          <a
            href="https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-paper-white hover:bg-cream-surface border border-mist-divider text-ink-black text-[14px] font-medium transition-colors"
          >
            <span>Kaggle Weights</span>
            <ExternalLink className="w-3.5 h-3.5 text-fog-text" />
          </a>
        </div>

        {/* Technical Blueprint Metadata Strip */}
        <div className="w-full pt-6 mt-4 border-t border-mist-divider grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-[0.05em] text-fog-text">Base Model</span>
            <span className="font-medium text-ink-black">Qwen2.5-Coder-3B-Instruct</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-[0.05em] text-fog-text">Quantization</span>
            <span className="font-medium text-ink-black">4-bit NF4 (2.06 GB Shards)</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-[0.05em] text-fog-text">LoRA Architecture</span>
            <span className="font-medium text-ink-black">r=16, α=32 (14.7M Params)</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-[0.05em] text-fog-text">Execution Engine</span>
            <span className="font-medium text-mint-green">CPython 3.12 (Pyodide Wasm)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
