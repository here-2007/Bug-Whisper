import React from 'react';
import { ChevronDown } from 'lucide-react';

const GithubIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const ConvexHeroNavbar: React.FC = () => {
  return (
    <nav className="w-full flex items-center justify-between pb-8 lg:pb-12 text-[#cfd3c7] select-none">
      {/* Brand logo & main links */}
      <div className="flex items-center gap-7 lg:gap-9">
        <a href="#" className="flex items-center gap-2">
          <span className="font-bold text-[24px] text-white tracking-[-0.04em] lowercase">
            convex
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-6 text-[14px] font-normal text-[#cfd3c7]">
          <button type="button" className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
            <span>Product</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9ba092]" />
          </button>
          <button type="button" className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
            <span>Developers</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9ba092]" />
          </button>
          <a href="#blog" className="hover:text-white transition-colors">Blog</a>
          <a href="#changelog" className="hover:text-white transition-colors">Changelog</a>
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
      </div>

      {/* Right: GitHub Star Badge & Ghost Login */}
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/get-convex/convex"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#20231b] hover:bg-[#282c22] border border-[#373c2e] text-xs font-medium text-white transition-colors"
        >
          <GithubIcon />
          <span>GitHub</span>
          <span className="text-[#8e9385] font-mono text-[11px]">20,211 stars</span>
        </a>

        <button
          type="button"
          className="text-xs font-semibold px-3 py-1.5 text-white/90 hover:text-white transition-colors cursor-pointer"
        >
          Log in
        </button>
      </div>
    </nav>
  );
};
