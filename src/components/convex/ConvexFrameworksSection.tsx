import React from 'react';

// Authentic 8-bit Pixel Heart from Video Frame 11s
const PixelHeart: React.FC = () => (
  <span className="inline-grid grid-cols-7 gap-[2px] w-[22px] h-[18px] mx-2 align-middle">
    <span className="col-start-2 bg-[#de5d33]" />
    <span className="bg-[#de5d33]" />
    <span className="col-start-5 bg-[#de5d33]" />
    <span className="bg-[#de5d33]" />
    <span className="col-span-7 bg-[#de5d33] h-[3px]" />
    <span className="col-span-7 bg-[#de5d33] h-[3px]" />
    <span className="col-start-2 col-span-5 bg-[#de5d33] h-[3px]" />
    <span className="col-start-3 col-span-3 bg-[#de5d33] h-[3px]" />
    <span className="col-start-4 bg-[#de5d33] h-[3px]" />
  </span>
);

interface FrameworkItem {
  name: string;
  badge: string;
  badgeColor: string;
}

const PYTHON_FRAMEWORKS: FrameworkItem[] = [
  { name: 'FastAPI', badge: '⚡', badgeColor: 'text-[#05998b]' },
  { name: 'PyTest', badge: '✓', badgeColor: 'text-[#0a9edc]' },
  { name: 'PyTorch', badge: '🔥', badgeColor: 'text-[#ee4c2c]' },
  { name: 'Django', badge: '🦄', badgeColor: 'text-[#092e20]' },
  { name: 'Flask', badge: '🧪', badgeColor: 'text-black' },
  { name: 'Celery', badge: '🌿', badgeColor: 'text-[#378147]' },
  { name: 'VS Code', badge: '💻', badgeColor: 'text-[#007acc]' },
  { name: 'Docker', badge: '🐳', badgeColor: 'text-[#2496ed]' },
  { name: 'PyO3 / Rust', badge: '⚙', badgeColor: 'text-[#dea584]' },
];

export const ConvexFrameworksSection: React.FC = () => {
  return (
    <section className="w-full py-20 lg:py-28 px-6 select-none bg-[#eeede4]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Heading & CTAs */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] border border-[#cfc9bc] bg-[#eae7dc] w-fit">
            <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#63665c] font-semibold">
              INTEGRATIONS
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-[50px] font-bold text-[#141414] tracking-[-0.035em] leading-[1.1]">
            Bug Whisper <PixelHeart /> your favorite tools
          </h2>

          <p className="text-base sm:text-lg text-[#55584e] leading-relaxed font-normal max-w-lg">
            Connect deterministic bug repair to your CI pipelines, editors, and Python frameworks.
          </p>

          <div className="pt-2">
            <a
              href="#workbench"
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#20221e] hover:bg-[#2e3129] text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Start repairing
            </a>
          </div>
        </div>

        {/* Right Column: 3x3 Python Frameworks Grid */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {PYTHON_FRAMEWORKS.map((fw) => (
              <div
                key={fw.name}
                className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-white/60 transition-colors cursor-pointer group"
              >
                <div className={`w-8 h-8 rounded-md bg-white border border-[#dfdacd] flex items-center justify-center text-sm font-bold shadow-none ${fw.badgeColor}`}>
                  {fw.badge}
                </div>
                <span className="text-base font-semibold text-[#141414] group-hover:text-black">
                  {fw.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
