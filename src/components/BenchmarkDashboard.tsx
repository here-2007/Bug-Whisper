import React from 'react';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export const BenchmarkDashboard: React.FC = () => {
  const rows = [
    {
      exception: 'IndexError',
      pattern: 'List/Tuple Index Out of Range',
      basePass: '56.4%',
      tunedPass: '94.2%',
      improvement: '+37.8%',
      avgLatency: '310ms',
    },
    {
      exception: 'TypeError',
      pattern: "'NoneType' Object Not Subscriptable",
      basePass: '49.7%',
      tunedPass: '91.8%',
      improvement: '+42.1%',
      avgLatency: '290ms',
    },
    {
      exception: 'KeyError',
      pattern: 'Missing Dict Key in Nested Lookup',
      basePass: '67.1%',
      tunedPass: '96.5%',
      improvement: '+29.4%',
      avgLatency: '280ms',
    },
    {
      exception: 'ZeroDivisionError',
      pattern: 'Unchecked Denominator Variable',
      basePass: '76.1%',
      tunedPass: '98.1%',
      improvement: '+22.0%',
      avgLatency: '260ms',
    },
    {
      exception: 'UnboundLocalError',
      pattern: 'Local Scope Variable Assignment',
      basePass: '37.5%',
      tunedPass: '88.7%',
      improvement: '+51.2%',
      avgLatency: '340ms',
    },
    {
      exception: 'SyntaxError',
      pattern: 'Missing Colons & Header Delimiters',
      basePass: '55.4%',
      tunedPass: '89.4%',
      improvement: '+34.0%',
      avgLatency: '320ms',
    },
  ];

  return (
    <section className="w-full bg-cream-surface py-16 px-6 border-b border-mist-divider">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-[11px] font-mono font-medium uppercase tracking-[0.05em] text-fog-text">
              Empirical Validation · Pass@1 Evaluation
            </span>
            <h2 className="text-3xl font-bold text-ink-black tracking-[-0.025em]">
              Exception Remediation Benchmark
            </h2>
            <p className="text-sm text-slate-text font-normal">
              Evaluated on 1,000 held-out Python error scenarios from CommitPack. Pass@1 measured by automated AST parsing and test suite re-execution.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-paper-white border border-mist-divider text-xs font-mono text-slate-text">
            <TrendingUp className="w-3.5 h-3.5 text-mint-green" />
            <span>Average Gain:</span>
            <span className="font-semibold text-ink-black">+36.1% Pass@1</span>
          </div>
        </div>

        {/* Dashboard Preview Card (Component 142) */}
        <div className="rounded-xl bg-paper-white border border-mist-divider p-6 flex flex-col gap-4 overflow-hidden">
          {/* Card Header Row */}
          <div className="flex items-center justify-between pb-3 border-b border-mist-divider text-xs font-mono text-fog-text">
            <span className="font-medium text-slate-text">eval.bugwhisper.dev/benchmarks</span>
            <span className="hidden sm:inline">1,000 Eval Samples · Greedy Decoding (temp=0.0)</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-mist-divider text-fog-text select-none">
                  <th className="py-2.5 px-3 font-medium">Exception Class</th>
                  <th className="py-2.5 px-3 font-medium hidden md:table-cell">Failure Mechanism</th>
                  <th className="py-2.5 px-3 font-medium text-right">Base 3B</th>
                  <th className="py-2.5 px-3 font-medium text-right text-ink-black font-semibold">
                    Bug Whisper
                  </th>
                  <th className="py-2.5 px-3 font-medium text-right">Pass@1 Δ</th>
                  <th className="py-2.5 px-3 font-medium text-right hidden sm:table-cell">Latency</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-mist-divider transition-colors ${
                      i % 2 === 0 ? 'bg-paper-white' : 'bg-cream-surface'
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold text-ink-black">
                      {row.exception}
                    </td>
                    <td className="py-3 px-3 text-slate-text hidden md:table-cell">
                      {row.pattern}
                    </td>
                    <td className="py-3 px-3 text-right text-fog-text">
                      {row.basePass}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-ink-black">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-mint-green inline" />
                        {row.tunedPass}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-mint-green font-semibold">
                      {row.improvement}
                    </td>
                    <td className="py-3 px-3 text-right text-fog-text hidden sm:table-cell">
                      {row.avgLatency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Note */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-fog-text">
            <span>Methodology: Synthesized fix must execute to exit code 0 without raising secondary exceptions.</span>
            <span className="text-slate-text font-medium">Model: bug-whisper-qwen25-coder-3b (v1)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
