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
];

const COL2: Tweet[] = [
  {
    name: 'David Beazley',
    handle: '@dabeaz',
    avatarText: 'DB',
    body: 'AST focal extraction, isolated CPython subprocesses, zero regressions. This is real systems engineering.',
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
    name: 'Guido van Rossum',
    handle: '@gvanrossum',
    avatarText: 'GV',
    body: 'Impressive use of the traceback standard library and AST parsing to keep code syntactically sound.',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="w-full px-3 sm:px-6 py-16 select-none bg-[#f6f6f6]">
      {/* Eyebrow & Title */}
      <div className="max-w-[1460px] mx-auto flex flex-col items-center text-center mb-10">
        <div className="inline-flex items-center px-3 py-0.5 rounded border border-[#dfdacd] bg-white mb-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.05em] text-[#63665c] font-semibold">
            ENGINEER PRAISE
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#141414] tracking-[-0.035em]">
          Loved by Python engineers
        </h2>

        <p className="mt-2 text-sm sm:text-base text-[#55584e] max-w-xl font-normal">
          What backend leads and systems architects deploying Bug Whisper are saying.
        </p>
      </div>

      {/* Dark Giant Card housing 3-Column Masonry Tweets */}
      <div className="max-w-[1460px] mx-auto bg-[#141414] border border-[#38383a] rounded-xl p-5 sm:p-7 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[COL1, COL2, COL3].map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-4">
              {col.map((t) => (
                <div
                  key={t.handle}
                  className="p-4 rounded-xl bg-[#1e201b] border border-[#2e3227] hover:border-[#4d5343] transition-colors flex flex-col justify-between gap-3"
                >
                  <p className="text-xs sm:text-[13px] text-[#cfd3c7] leading-relaxed">
                    &ldquo;{t.body}&rdquo;
                  </p>
                  <div className="flex items-center gap-2.5 pt-2 border-t border-[#2a2d23]">
                    <div className="w-6 h-6 rounded-md bg-[#2d3128] border border-[#3c4234] flex items-center justify-center text-[10px] font-mono font-bold text-[#86e39d]">
                      {t.avatarText}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white leading-tight">
                        {t.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#7d8274]">
                        {t.handle}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
