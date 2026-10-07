import React from 'react';

interface FeatureBadge {
  label: string;
  glyph: string;
  badgeBg: string;
}

const LEFT_BADGES: FeatureBadge[] = [
  { label: 'SERVER FUNCTIONS', glyph: 'λ', badgeBg: 'bg-[#488fa7]' },
  { label: 'ACID DATABASE', glyph: '▤', badgeBg: 'bg-[#d8a13a]' },
  { label: 'VECTOR SEARCH', glyph: '⋮⋮', badgeBg: 'bg-[#de5d33]' },
  { label: 'CRON JOBS', glyph: '◷', badgeBg: 'bg-[#488fa7]' },
  { label: 'FILE STORAGE', glyph: '📁', badgeBg: 'bg-[#c85c36]' },
];

const RIGHT_BADGES: FeatureBadge[] = [
  { label: 'REALTIME UPDATES', glyph: '↻', badgeBg: 'bg-[#de5d33]' },
  { label: 'TYPE SAFETY', glyph: 'TS', badgeBg: 'bg-[#3b6f8f]' },
  { label: 'FRAMEWORK INTEGRATION', glyph: '⚛', badgeBg: 'bg-[#d8a13a]' },
];

export const ConvexProductSection: React.FC = () => {
  return (
    <section className="w-full px-3 sm:px-6 py-12 select-none bg-[#eeede4]">
      {/* Outer Giant Dark Card */}
      <div className="max-w-[1460px] mx-auto bg-[#1c1e19] border border-[#2d3128] rounded-[28px] p-8 sm:p-12 lg:p-16 flex flex-col items-center text-center relative overflow-hidden">
        {/* Subtle background isometric grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(#69bee2 1px, transparent 1px), linear-gradient(90deg, #69bee2 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Eyebrow */}
        <div className="inline-flex items-center px-3 py-0.5 rounded-[4px] border border-[#3c4134] bg-[#252821] mb-5">
          <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#9ba092] font-semibold">
            PRODUCT
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white tracking-[-0.035em] leading-[1.08]">
          Not just a database
        </h2>

        {/* Subhead */}
        <p className="mt-4 text-base sm:text-lg text-[#9ba092] max-w-xl font-normal leading-relaxed">
          Everything your product deserves to build, launch, and scale.
        </p>

        {/* Cyan CTA Button */}
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#69bee2] hover:bg-[#7ed2f7] text-[#141414] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Learn more
          </button>
        </div>

        {/* Blueprint Hardware Chip Isometric Diagram */}
        <div className="w-full mt-14 max-w-[1100px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column Badges */}
          <div className="lg:col-span-3 flex flex-col gap-3 text-left">
            {LEFT_BADGES.map((b) => (
              <div
                key={b.label}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#242721] border border-[#34392e] text-xs font-mono text-[#d6dad0] hover:border-[#4d5444] transition-colors"
              >
                <span className="tracking-tight text-[11px]">{b.label}</span>
                <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] text-white font-bold ${b.badgeBg}`}>
                  {b.glyph}
                </span>
              </div>
            ))}
          </div>

          {/* Center Isometric Stage */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 relative">
            <div className="w-full max-w-[380px] h-[240px] rounded-2xl bg-gradient-to-b from-[#252922] to-[#181a16] border border-[#383d31] flex flex-col items-center justify-center relative p-6">
              {/* Central Glowing Layers */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2e332a] border border-[#484e3e] flex items-center justify-center text-white text-lg">
                  ⚙
                </div>
                <div className="w-24 h-24 rounded-2xl bg-[#1d222e] border border-[#69bee2]/50 flex items-center justify-center font-mono font-bold text-2xl text-[#69bee2]">
                  &lt;/&gt;
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#342e28] border border-[#c89880]/50 flex items-center justify-center text-[#c89880] text-lg font-mono">
                  CX
                </div>
              </div>
              <div className="mt-5 text-xs font-mono text-[#9ba092] tracking-wider uppercase">
                Convex Reactive Engine
              </div>
            </div>

            {/* Bottom Floating Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#242721] border border-[#34392e] text-[11px] font-mono text-[#d6dad0]">
                <span className="w-4 h-4 rounded bg-[#cca23c] flex items-center justify-center text-white text-[9px] font-bold">☍</span>
                <span>AUTOMATIC CACHING</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#242721] border border-[#34392e] text-[11px] font-mono text-[#d6dad0]">
                <span className="w-4 h-4 rounded bg-[#cc503b] flex items-center justify-center text-white text-[9px] font-bold">◎</span>
                <span>STRONG CONSISTENCY</span>
              </div>
            </div>
          </div>

          {/* Right Column Badges */}
          <div className="lg:col-span-3 flex flex-col gap-3 text-left">
            {RIGHT_BADGES.map((b) => (
              <div
                key={b.label}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#242721] border border-[#34392e] text-xs font-mono text-[#d6dad0] hover:border-[#4d5444] transition-colors"
              >
                <span className="tracking-tight text-[11px]">{b.label}</span>
                <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] text-white font-bold ${b.badgeBg}`}>
                  {b.glyph}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
