import React, { useState, useEffect } from 'react';
import { Terminal, ArrowRight } from 'lucide-react';

const GithubIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const HuggingFaceIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm-3.665-6.61a.584.584 0 0 1-.365-.138c-.378-.303-3.177-2.613-3.177-4.996 0-1.579 1.139-2.73 2.535-2.73 1.094 0 1.954.71 2.316 1.636a2.915 2.915 0 0 1 4.712 0c.362-.927 1.222-1.636 2.316-1.636 1.396 0 2.535 1.15 2.535 2.73 0 2.383-2.8 4.693-3.177 4.996a.579.579 0 0 1-.722 0c-.378-.303-3.178-2.613-3.178-4.996 0-1.579-1.139-2.73-2.534-2.73-1.396 0-2.536 1.15-2.536 2.73 0 2.383 2.799 4.693 3.177 4.996a.576.576 0 0 1 .098.138z" />
  </svg>
);

export const StickyNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isScrolled) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 w-full bg-[#f6f6f6]/95 backdrop-blur-sm border-b border-[#e5e5e5] px-6 select-none transition-all duration-200">
      <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#de5d33]" />
            <span className="mr-12 font-bold text-[20px] text-[#141414] tracking-[-0.04em] lowercase">
              bug whisper
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-6 text-[17px] font-bold text-[#55584e]">
            <a href="#playground" className="font-bold mr-12 hover:text-black transition-colors">PlayGround</a>
            <a href="#soup" className="font-bold hover:text-black transition-colors">SOUP</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
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

          <a
            href="#playground"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#20221e] hover:bg-[#2e3129] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </a>
        </div>
      </div>
    </header>
  );
};
