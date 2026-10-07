import React from 'react';
import { AST_GLYPHS } from '../../constants/astGlyphs';

export const AstIntelligenceSection: React.FC = () => {
  return (
    <section className="w-full py-16 lg:py-24 px-6 select-none bg-[#f6f6f6]" id="benchmarks">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: SFT INTELLIGENCE Headline & Story */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded border border-[#dfdacd] bg-white w-fit">
            <span className="text-[10px] font-mono uppercase tracking-[0.05em] text-[#63665c] font-semibold">
              SFT INTELLIGENCE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#141414] tracking-[-0.035em] leading-[1.1]">
            LLMs love deterministic Python
          </h2>

          <p className="text-sm sm:text-base text-[#55584e] leading-relaxed max-w-lg">
            Trained exclusively on 2.4M Python fault-localization traces, bug-whisper-qwen25-coder-3b synthesizes exact AST focal replacements rather than hallucinating entire modules.
          </p>

          <div className="pt-2">
            <a
              href="#playground"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#20221e] hover:bg-[#2e3129] text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Try in Studio ↘
            </a>
          </div>
        </div>

        {/* Right Column: AST Glyph Lattice & Telemetry Panel */}
        <div className="lg:col-span-7 flex justify-center w-full">
          <div
            className="w-full p-6 sm:p-8 rounded-xl border border-[#dfdacd] bg-white relative overflow-hidden"
            style={{
              backgroundImage:
                'linear-gradient(#f0ede4 1px, transparent 1px), linear-gradient(90deg, #f0ede4 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
              {/* 3x3 Matrix of Glyphs (5 cols) */}
              <div className="md:col-span-5 flex justify-center">
                <div className="grid grid-cols-3 gap-5 sm:gap-6 w-fit p-4 rounded-lg bg-[#f8f7f2] border border-[#e8e4da]">
                  {AST_GLYPHS.map((glyph, gIdx) => (
                    <div key={gIdx} className="flex flex-col gap-[2.5px]">
                      {glyph.map((row, rIdx) => (
                        <div key={rIdx} className="flex gap-[2.5px]">
                          {row.map((val, cIdx) => (
                            <div
                              key={cIdx}
                              className={`w-3 h-3 rounded-[1px] transition-transform ${
                                val === 1
                                  ? 'bg-[#20221e]'
                                  : val === 2
                                  ? 'bg-[#de5d33]'
                                  : 'bg-transparent'
                              }`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Telemetry Cards (7 cols) */}
              <div className="md:col-span-7 grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-lg bg-[#141414] border border-[#2e3128] text-white flex flex-col justify-between">
                  <span className="text-[10px] text-[#8e9385]">PASS@1 ACCURACY</span>
                  <span className="text-xl font-bold text-[#7bd88f] mt-1">89.4%</span>
                  <span className="text-[10px] text-[#6d6d70]">AST focal validation</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#141414] border border-[#2e3128] text-white flex flex-col justify-between">
                  <span className="text-[10px] text-[#8e9385]">INFERENCE LATENCY</span>
                  <span className="text-xl font-bold text-[#69bee2] mt-1">&lt;190ms</span>
                  <span className="text-[10px] text-[#6d6d70]">Local Ollama / vLLM</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#141414] border border-[#2e3128] text-white flex flex-col justify-between">
                  <span className="text-[10px] text-[#8e9385]">MODEL SIZE</span>
                  <span className="text-xl font-bold text-[#f8e67a] mt-1">3.09B</span>
                  <span className="text-[10px] text-[#6d6d70]">1.9GB Q4_K_M GGUF</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#141414] border border-[#2e3128] text-white flex flex-col justify-between">
                  <span className="text-[10px] text-[#8e9385]">AI SIGNALING</span>
                  <span className="text-xl font-bold text-[#fc618d] mt-1">0%</span>
                  <span className="text-[10px] text-[#6d6d70]">Pure diffs, no fluff</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
