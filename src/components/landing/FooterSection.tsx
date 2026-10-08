import React from 'react';
import { Terminal, ExternalLink } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

const GithubIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const FooterSection: React.FC = () => {
  return (
    <footer className="w-full bg-[#0f100e] text-white pt-16 sm:pt-20 pb-16 px-6 select-none border-t border-[#23261f]">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-10 sm:gap-12">
        {/* Header Row: Eyebrow & Brand */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c1e19] pb-8">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-[#de5d33]" />
            <span className="font-bold text-[22px] sm:text-[24px] text-white tracking-[-0.04em] lowercase">
              bug whisper
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#181a15] border border-[#2e3128] w-fit">
            <span className="w-2 h-2 rounded-full bg-[#de5d33]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#a0a599] font-medium">
              Made By · Core Builders
            </span>
          </div>
        </div>

        {/* 50/50 Vertically Equal Split: Left (Pernav Jain) and Right (Harshit Sharma) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left Person: Pernav Jain */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#141512] border border-[#23261f] hover:border-[#383e2e] flex flex-col justify-between transition-colors gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Pernav Jain
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1c1e19] text-[#de5d33] border border-[#2e3128]">
                  @here-2007
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#8e9385] leading-relaxed">
                building my skills, shipping projects, and aiming to become the kind of engineer who can think well, build fast, and solve real problems with taste.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1c1e19]">
              <a
                href="https://github.com/here-2007"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1c1e19] hover:bg-[#282c22] border border-[#2e3128] hover:border-[#3c4232] text-xs font-mono font-medium text-white transition-colors cursor-pointer group"
              >
                <GithubIcon />
                <span>here-2007</span>
                <ExternalLink className="w-3 h-3 text-[#64685b] group-hover:text-white transition-colors" />
              </a>

              <a
                href="https://www.linkedin.com/in/pernav-jain/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1c1e19] hover:bg-[#282c22] border border-[#2e3128] hover:border-[#3c4232] text-xs font-mono font-medium text-white transition-colors cursor-pointer group"
              >
                <LinkedinIcon />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-[#64685b] group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Right Person: Harshit Sharma */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#141512] border border-[#23261f] hover:border-[#383e2e] flex flex-col justify-between transition-colors gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Harshit Sharma
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1c1e19] text-[#de5d33] border border-[#2e3128]">
                  @harshitthek
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#8e9385] leading-relaxed">
                I&apos;m particularly interested in backend development, Linux, artificial intelligence, and building software that is reliable, maintainable, and secure.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1c1e19]">
              <a
                href="https://github.com/harshitthek"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1c1e19] hover:bg-[#282c22] border border-[#2e3128] hover:border-[#3c4232] text-xs font-mono font-medium text-white transition-colors cursor-pointer group"
              >
                <GithubIcon />
                <span>harshitthek</span>
                <ExternalLink className="w-3 h-3 text-[#64685b] group-hover:text-white transition-colors" />
              </a>

              <a
                href="https://www.linkedin.com/in/devharshitsharma/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1c1e19] hover:bg-[#282c22] border border-[#2e3128] hover:border-[#3c4232] text-xs font-mono font-medium text-white transition-colors cursor-pointer group"
              >
                <LinkedinIcon />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-[#64685b] group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Design Note Bar */}
        <div className="pt-8 border-t border-[#1c1e19] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64685b] font-mono">
          <span>&copy; {CURRENT_YEAR} Bug Whisper. Open-source Python intelligence.</span>
        </div>
      </div>
    </footer>
  );
};
