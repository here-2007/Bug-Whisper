import React from 'react';
import { ArrowRight, Terminal } from 'lucide-react';

export const PreFooterSection: React.FC = () => {
  return (
    <section className="w-full px-3 sm:px-6 py-12 select-none bg-[#f6f6f6]">
      {/* Dark Grid Outer Banner Card */}
      <div
        className="max-w-[1460px] mx-auto bg-[#141414] border border-[#38383a] rounded-xl py-20 sm:py-24 px-6 flex flex-col items-center text-center relative overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        {/* Subtle engineering corner markers */}
        <div className="absolute top-4 left-4 font-mono text-[10px] text-[#4f5247] select-none">
          SEC_PREFOOTER // V1.0
        </div>
        <div className="absolute top-4 right-4 font-mono text-[10px] text-[#4f5247] select-none">
          SYS_DIAG // OK
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-bold text-white tracking-[-0.04em] leading-[1.08] max-w-2xl relative z-10">
          Get your Python codebase healed in seconds
        </h2>

        <p className="mt-4 text-xs sm:text-sm text-[#8e9385] max-w-md font-mono relative z-10">
          Deterministic AST focal repair · Isolated sandbox · Zero regressions
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 relative z-10">
          <a
            href="#playground"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#de5d33] hover:bg-[#ea6b42] text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </a>

          <a
            href="https://github.com/harshitthek/bug-whisper"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#242720] hover:bg-[#2d3128] border border-[#383e2e] text-[#d6dad0] font-mono text-xs transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-[#8e9385]" />
            <span>git clone bug-whisper</span>
          </a>
        </div>
      </div>
    </section>
  );
};
