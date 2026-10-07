import React from 'react';

// Authentic 8-bit corner and border brackets from Video Frame 14s
const CornerGlyphTopLeft: React.FC = () => (
  <div className="absolute top-10 left-10 flex flex-col gap-[3px] opacity-80 pointer-events-none">
    <div className="flex gap-[3px]">
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
      <span className="w-3.5 h-3.5 bg-transparent" />
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
    </div>
    <div className="flex gap-[3px]">
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
      <span className="w-3.5 h-3.5 bg-transparent" />
      <span className="w-3.5 h-3.5 bg-transparent" />
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
    </div>
    <div className="flex gap-[3px]">
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
      <span className="w-3.5 h-3.5 bg-transparent" />
      <span className="w-3.5 h-3.5 bg-transparent" />
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
    </div>
  </div>
);

const CornerGlyphTopCenter: React.FC = () => (
  <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col gap-[3px] opacity-80 pointer-events-none">
    <div className="flex gap-[3px]">
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
    </div>
    <div className="flex gap-[3px]">
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
      <span className="w-3.5 h-3.5 bg-transparent" />
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
    </div>
  </div>
);

const CornerGlyphBottomRight: React.FC = () => (
  <div className="absolute bottom-10 right-14 flex flex-col gap-[3px] opacity-80 pointer-events-none">
    <div className="flex gap-[3px]">
      <span className="w-3.5 h-3.5 bg-transparent" />
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
      <span className="w-3.5 h-3.5 bg-transparent" />
    </div>
    <div className="flex gap-[3px]">
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
    </div>
    <div className="flex gap-[3px]">
      <span className="w-3.5 h-3.5 bg-transparent" />
      <span className="w-3.5 h-3.5 bg-[#c89880]" />
      <span className="w-3.5 h-3.5 bg-transparent" />
    </div>
  </div>
);

export const ConvexPreFooter: React.FC = () => {
  return (
    <section className="w-full px-3 sm:px-6 py-12 select-none bg-[#eeede4]">
      {/* Dark Grid Outer Banner Card */}
      <div
        className="max-w-[1460px] mx-auto bg-[#1c1e19] border border-[#2d3128] rounded-[28px] py-24 sm:py-32 px-6 flex flex-col items-center text-center relative overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      >
        {/* Floating 8-bit Corner Brackets */}
        <CornerGlyphTopLeft />
        <CornerGlyphTopCenter />
        <CornerGlyphBottomRight />

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-white tracking-[-0.04em] leading-[1.06] max-w-3xl relative z-10">
          Get your Python codebase healed in seconds
        </h2>

        {/* Terracotta CTA Button */}
        <div className="mt-8 relative z-10">
          <a
            href="#workbench"
            className="inline-flex items-center px-8 py-3 rounded-full bg-[#de5d33] hover:bg-[#ea6b42] text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Start repairing
          </a>
        </div>
      </div>
    </section>
  );
};
