import React from 'react';
import { CONVEX_GLYPHS } from '../../constants/convexGlyphs';

export const ConvexLlmsSection: React.FC = () => {
  return (
    <section className="w-full py-20 lg:py-28 px-6 select-none bg-[#eeede4]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: SFT INTELLIGENCE Headline & Story */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] border border-[#cfc9bc] bg-[#eae7dc] w-fit">
            <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#63665c] font-semibold">
              SFT INTELLIGENCE
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#141414] tracking-[-0.035em] leading-[1.08]">
            LLMs love deterministic Python
          </h2>

          <p className="text-base sm:text-lg text-[#55584e] leading-relaxed font-normal max-w-lg">
            Trained exclusively on 2.4M Python fault-localization traces, bug-whisper-qwen25-coder-3b synthesizes exact AST focal replacements rather than hallucinating entire modules.
          </p>

          <div className="pt-2">
            <a
              href="#benchmarks"
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#20221e] hover:bg-[#2e3129] text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Explore benchmarks
            </a>
          </div>
        </div>

        {/* Right Column: 8-Bit Pixel Glyph Matrix on Ruled Paper Grid */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            className="w-full max-w-[620px] p-8 sm:p-12 rounded-[22px] border border-[#dfdacd] bg-[#f2f1ea] relative overflow-hidden"
            style={{
              backgroundImage:
                'linear-gradient(#e4e0d4 1px, transparent 1px), linear-gradient(90deg, #e4e0d4 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            {/* Floating accent pixels */}
            <div className="absolute top-6 right-16 w-6 h-3 bg-[#c88d72] rounded-xs opacity-75" />
            <div className="absolute top-20 right-8 w-4 h-2 bg-[#dcd8cb] rounded-xs" />
            <div className="absolute bottom-16 right-12 w-6 h-3 bg-[#75503e] rounded-xs opacity-80" />
            <div className="absolute bottom-28 right-20 w-6 h-3 bg-[#8b9cb5] rounded-xs opacity-75" />

            {/* 3x3 Matrix of Glyphs */}
            <div className="grid grid-cols-3 gap-8 sm:gap-12 relative z-10 w-fit">
              {CONVEX_GLYPHS.map((glyph, gIdx) => (
                <div key={gIdx} className="flex flex-col gap-[3px]">
                  {glyph.map((row, rIdx) => (
                    <div key={rIdx} className="flex gap-[3px]">
                      {row.map((val, cIdx) => (
                        <div
                          key={cIdx}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[1.5px] transition-transform ${
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
        </div>
      </div>
    </section>
  );
};
