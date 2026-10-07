import React from 'react';
import { BugWhisperPlayground } from '../playground/BugWhisperPlayground';

export const ConvexProductSection: React.FC = () => {
  return (
    <section className="w-full px-3 sm:px-6 py-12 select-none bg-[#eeede4]" id="playground">
      {/* Outer Giant Dark Container Card */}
      <div className="max-w-[1460px] mx-auto bg-[#1c1e19] border border-[#2d3128] rounded-[28px] p-3 sm:p-5 lg:p-6 flex flex-col relative overflow-hidden">
        {/* Background blueprint grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(#69bee2 1px, transparent 1px), linear-gradient(90deg, #69bee2 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* The Complete Interactive Python Debugging Playground */}
        <div className="w-full relative z-10">
          <BugWhisperPlayground />
        </div>
      </div>
    </section>
  );
};
