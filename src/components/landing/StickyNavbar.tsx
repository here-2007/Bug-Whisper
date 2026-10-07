import React, { useState, useEffect } from 'react';
import { Terminal, ArrowRight } from 'lucide-react';

const GithubIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
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
            <span className="font-bold text-[20px] text-[#141414] tracking-[-0.04em] lowercase">
              bug whisper
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-[#55584e]">
            <a href="#benchmarks" className="hover:text-black transition-colors">Benchmarks</a>
            <a href="#playground" className="hover:text-black transition-colors">Studio</a>
            <a href="#integrations" className="hover:text-black transition-colors">Integrations</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/harshitthek/bug-whisper"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-50 border border-[#dfdacd] text-xs font-medium text-[#141414] transition-colors"
          >
            <GithubIcon />
            <span>GitHub</span>
            <span className="text-[#8e9385] font-mono text-[10px]">3B Model</span>
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
