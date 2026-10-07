import React from 'react';

interface VerifierTableProps {
  isPatched: boolean;
}

export const HeroDatabaseTable: React.FC<VerifierTableProps> = ({ isPatched }) => {
  const records = [
    {
      stage: 'AST Parse',
      target: 'pipeline.py:8-10',
      status: 'VALID',
      latency: '0.4ms',
      confidence: '1.00',
    },
    {
      stage: 'Runtime Harness',
      target: 'test_calculate_rate',
      status: isPatched ? 'PASSED' : 'FAILED',
      latency: '1.2ms',
      confidence: '1.00',
    },
    {
      stage: 'Diff Synthesizer',
      target: 'patch_unified.diff',
      status: isPatched ? '+2 -0 lines' : 'DETECTING',
      latency: '184ms',
      confidence: '0.99',
    },
  ];

  return (
    <div className="bg-[#141414] rounded-xl border border-[#38383a] overflow-hidden flex flex-col select-none">
      {/* Header Bar */}
      <div className="h-9 bg-[#20231d] border-b border-[#2e3128] px-3.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-0.5 rounded bg-[#121410] border border-[#282c22] text-[11px] font-mono text-[#8a9082]">
          <span className="w-2 h-2 rounded-full bg-[#de5d33]" />
          <span>verifier.bugwhisper.dev</span>
        </div>
        <div className="w-6" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Table Description */}
        <div className="flex items-baseline justify-between mb-3 font-mono">
          <span className="text-xs font-bold text-white">verification</span>
          <span className="text-[11px] text-[#787e70]">
            two-stage harness · 0 regressions
          </span>
        </div>

        {/* Clean Table View with Proportional Column Spacing */}
        <div className="w-full text-[11px] font-mono overflow-x-auto">
          {/* Table Header */}
          <div className="flex items-center justify-between text-[#64685b] pb-2 border-b border-[#282c22] font-medium px-1">
            <span className="w-[30%]">_stage</span>
            <span className="w-[30%]">target</span>
            <span className="w-[20%] text-center">status</span>
            <span className="w-[10%] text-right">time</span>
            <span className="w-[10%] text-right">conf</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#23261f]">
            {records.map((r, idx) => {
              const isGreen = r.status === 'VALID' || r.status === 'PASSED' || r.status.includes('+');
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2.5 text-[#d6dad0] hover:bg-[#1a1c17] transition-colors px-1"
                >
                  <span className="w-[30%] text-[#8a9082] truncate pr-2">{r.stage}</span>
                  <span className="w-[30%] text-white font-medium truncate pr-2">&quot;{r.target}&quot;</span>
                  <span className="w-[20%] flex justify-center">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        isGreen
                          ? 'border border-[#386c47] bg-[#172c1c] text-[#80dc96]'
                          : 'border border-[#6b2c3a] bg-[#3a1a23] text-[#fca5a5]'
                      }`}
                    >
                      {r.status}
                    </span>
                  </span>
                  <span className="w-[10%] text-right text-[#8a9082] text-[10px]">{r.latency}</span>
                  <span className="w-[10%] text-right text-[#7bd88f]">{r.confidence}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
