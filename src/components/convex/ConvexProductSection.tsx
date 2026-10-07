import React from 'react';
import { BugWhisperPlayground } from '../playground/BugWhisperPlayground';

export const ConvexProductSection: React.FC = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-10 bg-[#f6f6f6]" id="playground">
      <div className="max-w-[1440px] mx-auto">
        <BugWhisperPlayground />
      </div>
    </section>
  );
};
