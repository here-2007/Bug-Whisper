import React from 'react';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';

export const LlmsLoveSection: React.FC = () => {
  // 8-bit glyph block grid pattern
  const gridCells = [
    // Row 1
    ['#292929', '#292929', '', '#292929', '', '#de5d33', '#292929', '', '', '#292929', '#292929', ''],
    // Row 2
    ['#292929', '', '#292929', '', '#292929', '#292929', '', '#69bee2', '', '#292929', '', '#292929'],
    // Row 3
    ['', '#292929', '#292929', '', '#292929', '', '#292929', '#292929', '', '', '#7bd88f', '#292929'],
    // Row 4
    ['#292929', '#292929', '', '#de5d33', '', '#292929', '#292929', '', '#292929', '#292929', '#292929', ''],
    // Row 5
    ['', '#69bee2', '#292929', '#292929', '', '', '#292929', '#292929', '#de5d33', '', '#292929', '#292929'],
    // Row 6
    ['#292929', '', '', '#292929', '#292929', '', '#69bee2', '', '#292929', '#292929', '', '#7bd88f'],
    // Row 7
    ['#292929', '#292929', '', '', '#292929', '#292929', '', '#292929', '', '#292929', '#292929', ''],
  ];

  return (
    <section id="ai-tools" className="w-full bg-cream-surface py-20 px-6 border-b border-mist-divider select-none">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column (5 cols): Eyebrow, Headline, Description, CTA */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-paper-white border border-mist-divider w-fit">
            <Sparkles className="w-3 h-3 text-fog-text" />
            <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-fog-text font-medium">
              AI + Tools
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-ink-black tracking-[-0.025em] leading-[1.1]">
            LLMs love Bug Whisper
          </h2>

          <p className="text-base text-slate-text leading-relaxed font-normal">
            With Bug Whisper, everything is deterministic AST and Python tracebacks. This means your favorite AI models are pre-equipped to generate high quality code with zero hallucination.
          </p>

          <div className="pt-2">
            <a
              href="https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ink-black hover:bg-[#292929] text-paper-white font-medium text-sm transition-colors cursor-pointer"
            >
              <span>Learn more</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Column (7 cols): Pixel Art Matrix Canvas + Overlapping Dark Chat Card */}
        <div className="lg:col-span-7 relative">
          
          {/* Pixel Art Matrix Background Container */}
          <div className="w-full bg-[#eeeeee] p-8 sm:p-10 rounded-2xl border border-mist-divider overflow-hidden flex flex-col items-center justify-center min-h-[340px]">
            <div className="grid grid-rows-7 gap-2">
              {gridCells.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-2">
                  {row.map((color, cIdx) => (
                    <div
                      key={cIdx}
                      style={{ backgroundColor: color || 'transparent' }}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-[3px] transition-all duration-300"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Overlapping Dark Prompt / Inference Card (Component 162) */}
          <div className="w-[90%] sm:w-[85%] mx-auto -mt-16 sm:-mt-20 bg-charcoal-surface rounded-xl border border-graphite-border p-5 text-paper-white relative z-10">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-graphite-border">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-fog-text" />
                <span className="text-xs font-mono text-ash-text">
                  prompt: bug-whisper-qwen25-coder-3b
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-ink-black border border-graphite-border text-mint-green">
                Pass@1: 68.4%
              </span>
            </div>

            <div className="font-mono text-xs sm:text-[13px] text-[#e5e5e5] space-y-1.5 leading-relaxed">
              <div className="text-ash-text">
                &gt; Synthesize minimal AST diff for ZeroDivisionError at line 8
              </div>
              <div className="text-mint-green">
                ✓ Generated 1-line replacement in 142ms (4-bit NF4 LoRA)
              </div>
              <div className="text-fog-text text-xs">
                Zero syntax regressions · CPython bytecode verified
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-graphite-border flex items-center justify-between text-xs">
              <span className="text-fog-text font-mono">
                Weights: 3B parameters · 1.9 GB VRAM
              </span>
              <a
                href="#studio"
                className="text-signal-blue hover:underline font-mono flex items-center gap-1 font-medium"
              >
                <span>Try with Chef</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
