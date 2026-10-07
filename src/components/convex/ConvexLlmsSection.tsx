import React from 'react';

export const ConvexLlmsSection: React.FC = () => {
  // Exact 8-bit pixel glyph matrix from Convex video Frame 00:02 - 00:03
  const matrixRows = [
    ['#292929', '#292929', '', '#292929', '', '#de5d33', '#292929', '', '', '#292929', '#292929', ''],
    ['#292929', '', '#292929', '', '#292929', '#292929', '', '#69bee2', '', '#292929', '', '#292929'],
    ['', '#292929', '#292929', '', '#292929', '', '#292929', '#292929', '', '', '#7bd88f', '#292929'],
    ['#292929', '#292929', '', '#de5d33', '', '#292929', '#292929', '', '#292929', '#292929', '#292929', ''],
    ['', '#69bee2', '#292929', '#292929', '', '', '#292929', '#292929', '#de5d33', '', '#292929', '#292929'],
    ['#292929', '', '', '#292929', '#292929', '', '#69bee2', '', '#292929', '#292929', '', '#7bd88f'],
    ['#292929', '#292929', '', '', '#292929', '#292929', '', '#292929', '', '#292929', '#292929', ''],
  ];

  return (
    <section className="w-full bg-[#f6f6f6] py-20 px-6 border-b border-[#e5e5e5] select-none">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Eyebrow, Heading, Body, CTA */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="inline-flex items-center px-2.5 py-1 rounded bg-[#ffffff] border border-[#e5e5e5] w-fit">
            <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#6d6d70] font-medium">
              AI + Tools
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#141414] tracking-[-0.025em] leading-[1.1]">
            LLMs love Convex
          </h2>

          <p className="text-base text-[#4f4f52] leading-relaxed font-normal">
            With Convex, everything is just TypeScript. This means your favorite AI tools are pre-equipped to generate high quality code.
          </p>

          <div className="pt-2">
            <button
              type="button"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#141414] hover:bg-[#292929] text-[#ffffff] font-medium text-sm transition-colors cursor-pointer"
            >
              Learn more
            </button>
          </div>
        </div>

        {/* Right Column: 8-Bit Pixel Glyph Matrix Canvas */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full bg-[#eaeaea] p-8 sm:p-12 rounded-2xl border border-[#e5e5e5] flex flex-col items-center justify-center min-h-[320px]">
            <div className="grid grid-rows-7 gap-2.5">
              {matrixRows.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-2.5">
                  {row.map((color, cIdx) => (
                    <div
                      key={cIdx}
                      style={{ backgroundColor: color || 'transparent' }}
                      className="w-5 h-5 sm:w-7 sm:h-7 rounded-[4px] transition-all duration-300"
                    />
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
