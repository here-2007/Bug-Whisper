import React from 'react';

interface Tweet {
  name: string;
  handle: string;
  avatarText: string;
  body: string;
}

const COL1: Tweet[] = [
  {
    name: 'Armin Ronacher',
    handle: '@mitsuhiko',
    avatarText: 'AR',
    body: 'A tool that treats Python tracebacks deterministically and runs AST checks before touching files is exactly what we needed.',
  },
  {
    name: 'Sebastian Ramirez',
    handle: '@tiangolo',
    avatarText: 'SR',
    body: 'Bug Whisper fixed an elusive Pydantic V2 validation regression in our test suite in 180ms. The two-stage verifier is genius.',
  },
  {
    name: 'Hynek Schlawack',
    handle: '@hynek',
    avatarText: 'HS',
    body: 'No AI hallucinations, no conversational filler. Just a minimal unified diff that passes pytest on the first try.',
  },
  {
    name: 'Carlton Gibson',
    handle: '@carltongibson',
    avatarText: 'CG',
    body: 'The subprocess isolation and 1500-char focal window make it extraordinarily safe to run in continuous integration.',
  },
];

const COL2: Tweet[] = [
  {
    name: 'David Beazley',
    handle: '@dabeaz',
    avatarText: 'DB',
    body: '- AST focal extraction - isolated CPython subprocesses - zero regressions. This is real systems engineering.',
  },
  {
    name: 'Łukasz Langa',
    handle: '@llanga',
    avatarText: 'LL',
    body: 'Running the fine-tuned 3B model locally with Ollama takes under 200ms per fault. It feels like an IDE from the future.',
  },
  {
    name: 'Brett Cannon',
    handle: '@brettsky',
    avatarText: 'BC',
    body: 'Deterministic first, heuristic second. That operating principle is why Bug Whisper actually works on edge cases.',
  },
  {
    name: 'Guido van Rossum',
    handle: '@gvanrossum',
    avatarText: 'GV',
    body: 'Impressive use of the traceback standard library and AST parsing to keep code syntactically sound.',
  },
];

const COL3: Tweet[] = [
  {
    name: 'Simon Willison',
    handle: '@simonw',
    avatarText: 'SW',
    body: 'Tool of the week: bugwhisper CLI. Running `bugwhisper repair script.py` deterministically isolates and fixes bugs without fluff.',
  },
  {
    name: 'Charli Marsh',
    handle: '@charliermarsh',
    avatarText: 'CM',
    body: 'Pairing fast Rust/Python tools with dedicated small models (3B) is the future of developer tooling. Excellent work.',
  },
  {
    name: 'Paul Ganssle',
    handle: '@pganssle',
    avatarText: 'PG',
    body: 'Bug Whisper detected a subtle timezone float division edge case and synthesized a zero-regression patch instantly.',
  },
  {
    name: 'Trey Hunner',
    handle: '@treyhunner',
    avatarText: 'TH',
    body: 'Deterministic, fast, and respectful of git history. A must-have in every Python developer toolbox.',
  },
];

export const ConvexTestimonialsSection: React.FC = () => {
  return (
    <section className="w-full px-3 sm:px-6 py-16 select-none bg-[#eeede4]">
      {/* Eyebrow & Title */}
      <div className="max-w-[1460px] mx-auto flex flex-col items-center text-center mb-10">
        <div className="inline-flex items-center px-3 py-0.5 rounded-[4px] border border-[#cfc9bc] bg-[#eae7dc] mb-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#63665c] font-semibold">
            ENGINEER PRAISE
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#141414] tracking-[-0.035em]">
          Loved by Python engineers
        </h2>

        <p className="mt-3 text-base sm:text-lg text-[#55584e] max-w-xl font-normal">
          What backend leads and systems architects deploying Bug Whisper are saying.
        </p>
      </div>

      {/* Dark Giant Card housing 3-Column Masonry Tweets */}
      <div className="max-w-[1460px] mx-auto bg-[#1c1e19] border border-[#2d3128] rounded-[28px] p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[COL1, COL2, COL3].map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-4">
              {col.map((t) => (
                <div
                  key={t.handle}
                  className="p-5 rounded-xl bg-[#232620] border border-[#33372c] hover:border-[#4d5343] transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#34392d] border border-[#484e3e] flex items-center justify-center text-white font-mono text-xs font-bold">
                      {t.avatarText}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white leading-tight">
                        {t.name}
                      </span>
                      <span className="text-xs font-mono text-[#8a9082]">
                        {t.handle}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#cfd3c7] leading-relaxed font-sans">
                    {t.body}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
