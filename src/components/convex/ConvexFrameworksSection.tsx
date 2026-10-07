import React from 'react';

export const ConvexFrameworksSection: React.FC = () => {
  const frameworks = [
    'React',
    'React Native',
    'Python',
    'Remix',
    'TanStack Start',
    'Rust',
    'Next.js',
    'Vue',
    'Svelte',
  ];

  return (
    <section className="w-full bg-[#f6f6f6] py-20 px-6 border-b border-[#e5e5e5] select-none">
      <div className="max-w-[1240px] mx-auto flex flex-col items-center">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center px-3 py-1 rounded bg-[#ffffff] border border-[#e5e5e5] mb-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#6d6d70] font-medium">
            Integrations
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#141414] tracking-[-0.025em] text-center">
          Convex ❤️ your favorite frameworks
        </h2>

        {/* Subhead */}
        <p className="mt-3 text-base text-[#4f4f52] text-center max-w-xl font-normal leading-relaxed">
          Connect your backend to your client libraries and frameworks.
        </p>

        {/* Button */}
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#141414] hover:bg-[#292929] text-white font-medium text-sm transition-colors cursor-pointer"
          >
            Learn more
          </button>
        </div>

        {/* 9 Framework Cards Grid (Video Frame 00:11) */}
        <div className="mt-14 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {frameworks.map((name) => (
            <div
              key={name}
              className="p-5 rounded-xl bg-[#ffffff] border border-[#e5e5e5] hover:border-[#4f4f52] transition-colors flex items-center justify-between"
            >
              <span className="text-sm font-bold text-[#141414]">{name}</span>
              <span className="w-2 h-2 rounded-full bg-[#7bd88f]" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
