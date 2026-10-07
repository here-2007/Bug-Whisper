import React from 'react';
import { ArrowRight, Terminal } from 'lucide-react';

export const PreFooterBanner: React.FC = () => {
  return (
    <section className="w-full bg-[#141414] py-24 px-6 select-none relative overflow-hidden border-t border-graphite-border">
      {/* Background blueprint grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Decorative corner glyphs */}
      <div className="absolute top-8 left-8 text-graphite-border font-mono text-xs select-none hidden sm:block">
        [SYS_CORE // 0x4B]
      </div>
      <div className="absolute top-8 right-8 text-graphite-border font-mono text-xs select-none hidden sm:block">
        [QWEN_3B // READY]
      </div>

      <div className="max-w-[800px] mx-auto flex flex-col items-center text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-paper-white tracking-[-0.04em] leading-tight">
          Get your bugs repaired in seconds
        </h2>

        <p className="mt-4 text-base sm:text-lg text-ash-text max-w-xl font-normal leading-relaxed">
          Deterministic CPython execution, zero hallucinations, and fine-tuned 3B model speed right inside your browser.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#studio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-ember-orange hover:bg-[#e8693f] text-paper-white font-medium text-sm transition-colors cursor-pointer"
          >
            <span>Start repairing</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="https://github.com/harshitxdev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-charcoal-surface hover:bg-[#333333] border border-graphite-border text-paper-white font-mono text-xs transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-fog-text" />
            <span>git clone bug-whisper</span>
          </a>
        </div>
      </div>
    </section>
  );
};
