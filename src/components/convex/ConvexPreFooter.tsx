import React from 'react';

export const ConvexPreFooter: React.FC = () => {
  return (
    <section className="w-full bg-[#141414] py-28 px-6 select-none relative overflow-hidden border-t border-[#38383a]">
      {/* Background blueprint grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-[800px] mx-auto flex flex-col items-center text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-[-0.04em] leading-tight">
          Get your app up and running in minutes
        </h2>

        <div className="mt-8">
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-[#de5d33] hover:bg-[#e8693f] text-white font-medium text-sm transition-colors cursor-pointer"
          >
            Start building
          </button>
        </div>
      </div>
    </section>
  );
};
