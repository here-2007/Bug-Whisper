import React from 'react';
import { BugWhisperPlayground } from '../playground/BugWhisperPlayground';

export const StudioSection: React.FC = () => {
  return (
    <section className="w-full px-3 sm:px-6 lg:px-8 py-12 bg-[#f6f6f6]" id="playground">
      <div className="max-w-[1460px] mx-auto flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded border border-[#dfdacd] bg-white w-fit">
              <span className="text-[10px] font-mono uppercase tracking-[0.05em] text-[#63665c] font-semibold">
                INTERACTIVE STUDIO
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#141414] tracking-[-0.035em]">
              Python Debugging Studio
            </h2>
            <p className="text-xs sm:text-sm text-[#55584e] max-w-xl">
              Live Pyodide WebWorker execution harness. Tracebacks and focal scopes are extracted deterministically with instantaneous 3B model remediation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#787e70]">
            <span className="w-2 h-2 rounded-full bg-[#7bd88f] animate-pulse" />
            <span>Sandbox Ready</span>
            <span className="text-[#bbb]">·</span>
            <span>Python 3.12 Wasm</span>
          </div>
        </div>

        {/* Studio Card */}
        <BugWhisperPlayground />
      </div>
    </section>
  );
};
