import React from 'react';
import { ChevronDown, Star } from 'lucide-react';

const ConvexLogo: React.FC = () => (
  <div className="flex items-center gap-2 cursor-pointer">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M3 5C3 3.89543 3.89543 3 5 3H12C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21H5C3.89543 21 3 20.1046 3 19V5Z"
        fill="#141414"
      />
      <path
        d="M8 8C8 7.44772 8.44772 7 9 7H12C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17H9C8.44772 17 8 16.5523 8 16V8Z"
        fill="#ffffff"
      />
    </svg>
    <span className="font-bold text-[19px] text-[#141414] tracking-[-0.04em] lowercase">
      convex
    </span>
  </div>
);

const GithubIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const ConvexNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 h-16 w-full bg-[#ffffff] border-b border-[#e5e5e5] px-6 select-none">
      <div className="max-w-[1240px] mx-auto h-full flex items-center justify-between">
        
        {/* Left: Brand + Navigation Links */}
        <div className="flex items-center gap-8">
          <ConvexLogo />

          <nav className="hidden lg:flex items-center gap-6 text-[14px] font-medium text-[#141414]">
            <button type="button" className="flex items-center gap-1 hover:text-[#4f4f52] transition-colors cursor-pointer">
              <span>Product</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6d6d70]" />
            </button>
            <button type="button" className="flex items-center gap-1 hover:text-[#4f4f52] transition-colors cursor-pointer">
              <span>Developers</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6d6d70]" />
            </button>
            <a href="#blog" className="hover:text-[#4f4f52] transition-colors">
              Blog
            </a>
            <a href="#changelog" className="hover:text-[#4f4f52] transition-colors">
              Changelog
            </a>
            <a href="#docs" className="hover:text-[#4f4f52] transition-colors">
              Docs
            </a>
            <a href="#pricing" className="hover:text-[#4f4f52] transition-colors">
              Pricing
            </a>
          </nav>
        </div>

        {/* Right: GitHub Stars Pill, Log In, Start Building */}
        <div className="flex items-center gap-3">
          {/* GitHub Stars Pill */}
          <a
            href="https://github.com/get-convex/convex"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ffffff] hover:bg-[#f6f6f6] border border-[#e5e5e5] text-[13px] font-medium text-[#141414] transition-colors"
          >
            <GithubIcon />
            <span>GitHub</span>
            <span className="text-[#e5e5e5]">|</span>
            <Star className="w-3.5 h-3.5 text-[#f8e67a] fill-[#f8e67a]" />
            <span className="font-medium text-[#6d6d70]">11.2k</span>
          </a>

          {/* Log in (Ghost CTA) */}
          <button
            type="button"
            className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#ffffff] hover:bg-[#f6f6f6] border border-[#e5e5e5] text-[14px] font-medium text-[#141414] transition-colors cursor-pointer"
          >
            Log in
          </button>

          {/* Start building (Filled Dark CTA) */}
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#141414] hover:bg-[#292929] text-[#ffffff] text-[14px] font-medium transition-colors cursor-pointer"
          >
            Start building
          </button>
        </div>

      </div>
    </header>
  );
};
