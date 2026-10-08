import React from 'react';
import { Terminal } from 'lucide-react';

export const GithubIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const HuggingFaceIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm-3.665-6.61a.584.584 0 0 1-.365-.138c-.378-.303-3.177-2.613-3.177-4.996 0-1.579 1.139-2.73 2.535-2.73 1.094 0 1.954.71 2.316 1.636a2.915 2.915 0 0 1 4.712 0c.362-.927 1.222-1.636 2.316-1.636 1.396 0 2.535 1.15 2.535 2.73 0 2.383-2.8 4.693-3.177 4.996a.579.579 0 0 1-.722 0c-.378-.303-3.178-2.613-3.178-4.996 0-1.579-1.139-2.73-2.534-2.73-1.396 0-2.536 1.15-2.536 2.73 0 2.383 2.799 4.693 3.177 4.996a.576.576 0 0 1 .098.138z" />
  </svg>
);

export const HeroBrandNav: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-between pb-6 lg:pb-8 text-[#cfd3c7] select-none">
      <div className="flex items-center gap-6 sm:gap-8">
        <a href="#" className="flex items-center gap-2 group">
          <Terminal className="w-5 h-5 text-[#de5d33]" />
          <span className="font-bold text-[20px] sm:text-[22px] text-white tracking-[-0.04em] lowercase">
            bug whisper
          </span>
        </a>

        <div className="flex items-center gap-5 sm:gap-8 text-[15px] sm:text-[17px] font-medium text-[#cfd3c7]">
          <a href="#playground" className="font-bold mr-4 sm:mr-8 hover:text-white transition-colors">
            PlayGround
          </a>
          <a href="#soup" className="font-bold hover:text-white transition-colors">
            SOUP
          </a>
        </div>
      </div>
    </div>
  );
};

export const HeroActionsNav: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-end pb-6 lg:pb-8 text-[#cfd3c7] select-none">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <a
          href="https://github.com/here-2007/Bug-Whisper"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#282c22] hover:bg-[#343a2c] border border-[#3c4232] text-xs font-medium text-white transition-colors"
        >
          <GithubIcon />
          <span>GitHub</span>
        </a>
        <a
          href="https://github.com/here-2007/Bug-Whisper"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#282c22] hover:bg-[#343a2c] border border-[#3c4232] text-xs font-medium text-white transition-colors"
        >
          <HuggingFaceIcon />
          <span>Hugging Face</span>
        </a>
      </div>
    </div>
  );
};

export const HeroNavbar: React.FC = () => {
  return (
    <nav className="w-full flex items-center justify-between pb-6 lg:pb-8 text-[#cfd3c7] select-none">
      <HeroBrandNav />
      <HeroActionsNav />
    </nav>
  );
};
