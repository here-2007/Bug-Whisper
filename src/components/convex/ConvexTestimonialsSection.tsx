import React from 'react';

interface Tweet {
  name: string;
  handle: string;
  avatarText: string;
  body: string;
}

const COL1: Tweet[] = [
  {
    name: 'urubatan',
    handle: '@urubatan',
    avatarText: 'UR',
    body: 'But it looks like all our backend needs are covered with zero infra maintenance.',
  },
  {
    name: 'James Perkins',
    handle: '@james_r_perkins',
    avatarText: 'JP',
    body: "I used @convex once to make sure our integration at @ClerkDev worked and the docs matched what we expected. It's magical. I don't say that lightly. I think it's time to do a video on the channel.",
  },
  {
    name: 'Timothy Stepro',
    handle: '@tim_stepro',
    avatarText: 'TS',
    body: '@convex is everything I wanted Firebase to be. Such a great tool. Feels illegal to know about this before others.',
  },
  {
    name: 'Robin',
    handle: '@robinxpfp',
    avatarText: 'RO',
    body: "I think @convex might be the best DB I've ever used",
  },
];

const COL2: Tweet[] = [
  {
    name: 'Jason Lengstorf',
    handle: '@jlengstorf',
    avatarText: 'JL',
    body: '- DB schema defined in TS - end-to-end types (like if tRPC also set up your DB) - real-time updates Just Work™',
  },
  {
    name: 'David Kim',
    handle: '@dvddkkim',
    avatarText: 'DK',
    body: '@convex feels like what I wanted Firebase and MongoDB Realm to be and more. Really enjoying the DX so far!',
  },
  {
    name: 'Guillermo Rauch',
    handle: '@rauchg',
    avatarText: 'GR',
    body: '🤠 @convex is the gift that keeps on giving. Check it out in combination with @nextjs docs.convex.dev',
  },
  {
    name: 'Clerk Dev',
    handle: '@clerkdev',
    avatarText: 'CD',
    body: "Happy to see more first-class clerk x convex integration. There's such a major architecture shift around Serverless + Edge + React + Typescript that it's unlikely SQL is still the right abstraction.",
  },
];

const COL3: Tweet[] = [
  {
    name: 'Anshuman Bhardwaj',
    handle: '@sun_anshuman',
    avatarText: 'AB',
    body: 'Interesting tool of the week: convex.dev by @convex. Strictly-typed fully relational schemas defined in code.',
  },
  {
    name: 'Console - Devtools',
    handle: '@consoledotdev',
    avatarText: 'CO',
    body: 'We like: Makes it easy to build a live-updating web app with a document database. Strictly-typed relational schemas defined in code (optional, but recommended).',
  },
  {
    name: 'WebDevCody',
    handle: '@webdevcody',
    avatarText: 'WC',
    body: 'Next + Convex (all in typescript) Vs Angular (typescript) + Django (python) + Postgres + S3 + Websocket DIY + SQS + IaC + DIY e2e type safety 🤔',
  },
  {
    name: 'AndyOz',
    handle: '@andy_austin_dev',
    avatarText: 'AO',
    body: '@convex Simple. Fast. Realtime.',
  },
];

export const ConvexTestimonialsSection: React.FC = () => {
  return (
    <section className="w-full px-3 sm:px-6 py-16 select-none bg-[#eeede4]">
      {/* Eyebrow & Title */}
      <div className="max-w-[1460px] mx-auto flex flex-col items-center text-center mb-10">
        <div className="inline-flex items-center px-3 py-0.5 rounded-[4px] border border-[#cfc9bc] bg-[#eae7dc] mb-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#63665c] font-semibold">
            CUSTOMER LOVE
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#141414] tracking-[-0.035em]">
          Loved by developers
        </h2>

        <p className="mt-3 text-base sm:text-lg text-[#55584e] max-w-xl font-normal">
          What people building their business on Convex are saying.
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
