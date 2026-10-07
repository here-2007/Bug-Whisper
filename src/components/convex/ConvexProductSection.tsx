import React from 'react';

export const ConvexProductSection: React.FC = () => {
  return (
    <section className="w-full bg-dusk-gradient py-24 px-6 select-none relative overflow-hidden border-y border-[#38383a]">
      {/* Background blueprint grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(#69bee2 1px, transparent 1px), linear-gradient(90deg, #69bee2 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-[1240px] mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center px-3 py-1 rounded bg-[#1f1d1c]/80 border border-[#38383a] mb-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#a9a9ac] font-medium">
            Product
          </span>
        </div>

        {/* Display Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-[-0.025em] leading-tight">
          Not just a database
        </h2>

        {/* Subhead */}
        <p className="mt-4 text-base sm:text-lg text-[#a9a9ac] max-w-xl font-normal leading-relaxed">
          Everything your product deserves to build, launch, and scale.
        </p>

        {/* Signal Blue CTA Button */}
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-6 py-2.5 rounded-lg bg-[#69bee2] hover:bg-[#7dd0f5] text-[#141414] font-medium text-sm transition-colors cursor-pointer"
          >
            Learn more
          </button>
        </div>

        {/* Glowing Isometric Blueprint Hardware Chip Diagram (Video Frame 00:04 - 00:06) */}
        <div className="w-full mt-16 max-w-[1040px] bg-[#141414]/90 rounded-2xl border border-[#38383a] p-6 sm:p-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Column Callouts */}
            <div className="md:col-span-4 flex flex-col gap-2.5 text-left">
              {['SERVER FUNCTIONS', 'ACID DATABASE', 'VECTOR SEARCH', 'CRON JOBS', 'FILE STORAGE'].map((label) => (
                <div
                  key={label}
                  className="p-3 rounded-lg bg-[#292929] border border-[#38383a] text-xs font-mono text-white flex items-center justify-between"
                >
                  <span>{label}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#69bee2]" />
                </div>
              ))}
            </div>

            {/* Center Isometric Chip Core */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#222222] to-[#161616] rounded-xl border border-[#38383a]">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#1a233a] to-[#253965] border border-[#69bee2]/50 flex items-center justify-center relative mb-5">
                <div className="w-12 h-12 rounded-lg bg-[#69bee2]/20 flex items-center justify-center font-mono font-bold text-lg text-[#69bee2]">
                  CX
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-[#69bee2]/20 blur-sm pointer-events-none" />
              </div>
              <span className="text-xs font-mono text-[#a9a9ac] uppercase tracking-wider">
                AUTOMATIC CACHING
              </span>
              <span className="text-xs font-mono text-[#7bd88f] uppercase tracking-wider mt-1">
                STRONG CONSISTENCY
              </span>
            </div>

            {/* Right Column Callouts */}
            <div className="md:col-span-4 flex flex-col gap-2.5 text-left">
              {['REALTIME UPDATES', 'TYPE SAFETY', 'FRAMEWORK INTEGRATION'].map((label) => (
                <div
                  key={label}
                  className="p-3 rounded-lg bg-[#292929] border border-[#38383a] text-xs font-mono text-white flex items-center justify-between"
                >
                  <span>{label}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7bd88f]" />
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
