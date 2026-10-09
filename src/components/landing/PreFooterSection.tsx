import React from 'react';
import { Terminal, ArrowRight, ExternalLink, Cpu, CheckCircle2 } from 'lucide-react';

const HIGHLIGHT_CHIPS = [
  'Deterministic Pyodide Wasm',
  '4-bit NF4 Quantization',
  'Fine-Tuned with soup-cli',
  'Zero Drop Shadows',
  '90 TS + 16 Py Verified',
];

export const PreFooterSection: React.FC = () => {
  return (
    <section className="w-full px-3 sm:px-6 py-12 select-none bg-[#f6f6f6]">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative rounded-2xl bg-[#141414] border border-[#2e3128] p-8 sm:p-12 overflow-hidden flex flex-col justify-between gap-8">
          {/* Top Row: Eyebrow + Traffic Light Accent */}
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1c1e19] border border-[#2e3128]">
              <Cpu className="w-3.5 h-3.5 text-[#de5d33]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.05em] text-[#a0a599] font-medium">
                OPEN-SOURCE PYTHON INTELLIGENCE · SOUP-CLI ECOSYSTEM
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fc618d]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f8e67a]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#7bd88f]" />
            </div>
          </div>

          {/* Center Copy */}
          <div className="flex flex-col gap-3.5 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-[-0.035em] leading-tight">
              Ready to eliminate Python traceback guesswork?
            </h2>
            <p className="text-xs sm:text-sm text-[#8e9385] leading-relaxed">
              Run scripts directly in-browser with zero-overhead Pyodide Wasm, or connect to the fine-tuned 4-bit Qwen 2.5 Coder 3B model for instant root cause diagnosis and unified diff repairs.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#playground"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#de5d33] hover:bg-[#c94d27] text-white text-xs font-semibold tracking-tight transition-colors cursor-pointer"
            >
              <span>Open Interactive Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://github.com/here-2007/Bug-Whisper"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1c1e19] hover:bg-[#282c22] border border-[#2e3128] hover:border-[#3c4232] text-xs font-mono font-medium text-white transition-colors cursor-pointer group"
            >
              <Terminal className="w-3.5 h-3.5 text-[#de5d33]" />
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3 text-[#64685b] group-hover:text-white transition-colors" />
            </a>

            <a
              href="https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1c1e19] hover:bg-[#282c22] border border-[#2e3128] hover:border-[#3c4232] text-xs font-mono font-medium text-white transition-colors cursor-pointer group"
            >
              <span>Kaggle Weights</span>
              <ExternalLink className="w-3 h-3 text-[#64685b] group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Bottom Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#1c1e19]">
            {HIGHLIGHT_CHIPS.map((chip) => (
              <div
                key={chip}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181a15] border border-[#23261f] text-[11px] font-mono text-[#8e9385]"
              >
                <CheckCircle2 className="w-3 h-3 text-[#7bd88f]" />
                <span>{chip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
