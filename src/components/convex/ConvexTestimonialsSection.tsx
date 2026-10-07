import React from 'react';

interface TweetCard {
  name: string;
  handle: string;
  avatarText: string;
  text: string;
}

export const ConvexTestimonialsSection: React.FC = () => {
  const tweets: TweetCard[] = [
    {
      name: 'crubetan',
      handle: '@crubetan',
      avatarText: 'CB',
      text: 'I used @convex once to make sure our integration at @ClerkDev worked and the docs matched what we expected. It\'s magical. I don\'t say that lightly. I think it\'s time to do a video on the channel.',
    },
    {
      name: 'Jason Lengstorf',
      handle: '@jlengstorf',
      avatarText: 'JL',
      text: '• DB schema defined in TS -> end to end types (like if tRPC also set up your DB) • Real-time updates "just work"',
    },
    {
      name: 'Anshuman Bhardwaj',
      handle: '@anshuman_bhardwaj',
      avatarText: 'AB',
      text: 'Interesting tool of the week: convex.dev by @convex. Makes it easy to build a live-updating web app with a document database. Strictly-typed fully relational schemas defined in code.',
    },
    {
      name: 'David Kim',
      handle: '@davidk_dev',
      avatarText: 'DK',
      text: '@convex feels like what I wanted Firebase and MongoDB Realm to be and more. Really enjoying the DX so far.',
    },
    {
      name: 'Guillermo Rauch',
      handle: '@rauchg',
      avatarText: 'GR',
      text: '@convex is the gift that keeps on giving. Check it out in combination with @nextjs docs.convex.dev',
    },
    {
      name: 'v0',
      handle: '@v0',
      avatarText: 'V0',
      text: 'Next + Convex (all in TypeScript) · Angular (typescript) + Django (python) + Postgres + S3 + Webworker DX + POJO + DI + type safety',
    },
    {
      name: 'James Perkins',
      handle: '@james_perkins',
      avatarText: 'JP',
      text: '@convex is everything I wanted Firebase to be. Such a great tool. Feel\'s illegal to know about this before others.',
    },
    {
      name: 'Timothy Broder',
      handle: '@timothybroder',
      avatarText: 'TB',
      text: 'I think @convex might be the best DB I\'ve ever used.',
    },
    {
      name: 'WebDevCody',
      handle: '@webdevcody',
      avatarText: 'WC',
      text: '@convex Simple, Fast, Realtime.',
    },
  ];

  return (
    <section className="w-full bg-[#f6f6f6] py-20 px-6 border-b border-[#e5e5e5] select-none">
      <div className="max-w-[1240px] mx-auto flex flex-col items-center">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center px-3 py-1 rounded bg-[#ffffff] border border-[#e5e5e5] mb-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#6d6d70] font-medium">
            Customer Love
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#141414] tracking-[-0.025em] text-center">
          Loved by developers
        </h2>

        {/* Subhead */}
        <p className="mt-3 text-base text-[#4f4f52] text-center max-w-xl font-normal leading-relaxed">
          What people building their business on Convex are saying.
        </p>

        {/* 3-Column Masonry Grid of Tweets (Video Frame 00:07 - 00:10) */}
        <div className="mt-14 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tweets.map((t) => (
            <div
              key={t.handle}
              className="p-5 rounded-xl bg-[#141414] border border-[#38383a] flex flex-col justify-between hover:border-[#4f4f52] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#292929] border border-[#38383a] flex items-center justify-center text-white font-mono text-xs font-bold">
                  {t.avatarText}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white leading-tight">
                    {t.name}
                  </span>
                  <span className="text-xs font-mono text-[#6d6d70]">
                    {t.handle}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-[13px] text-[#cccccc] leading-relaxed font-sans">
                {t.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
