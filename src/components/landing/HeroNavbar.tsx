import React from 'react';
import { Terminal } from 'lucide-react';

const GithubIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const HeroNavbar: React.FC = () => {
  return (
    <nav className="w-full flex items-center justify-between pb-6 lg:pb-8 text-[#cfd3c7] select-none">
      {/* Brand logo & main links */}
      <div className="flex items-center gap-7 lg:gap-9">
        <a href="#" className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#de5d33]" />
          <span className="font-bold text-[22px] text-white tracking-[-0.04em] lowercase">
            bug whisper
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-[#cfd3c7]">
          <a href="#playground" className="hover:text-white transition-colors">Studio</a>
          <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
        </div>
      </div>

      {/* Right: GitHub Star Badge & Ghost Action */}
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/harshitthek/bug-whisper"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#282c22] hover:bg-[#343a2c] border border-[#3c4232] text-xs font-medium text-white transition-colors"
        >
          <GithubIcon />
          <span>GitHub</span>
          <span className="text-[#8e9385] font-mono text-[11px]">3B Model</span>
        </a>

        <span className="text-xs font-mono px-2 py-1 text-[#8e9385]">
          v1.0
        </span>
      </div>
    </nav>
  );
};
