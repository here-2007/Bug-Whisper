import React from 'react';

const ConvexLogo: React.FC = () => (
  <div className="flex items-center gap-2">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 5C3 3.89543 3.89543 3 5 3H12C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21H5C3.89543 21 3 20.1046 3 19V5Z"
        fill="#ffffff"
      />
      <path
        d="M8 8C8 7.44772 8.44772 7 9 7H12C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17H9C8.44772 17 8 16.5523 8 16V8Z"
        fill="#141414"
      />
    </svg>
    <span className="font-bold text-base text-white tracking-tight lowercase">
      convex
    </span>
  </div>
);

export const ConvexFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#111111] text-white py-16 px-6 border-t border-[#38383a] select-none">
      <div className="max-w-[1240px] mx-auto grid grid-cols-2 md:grid-cols-12 gap-10">
        
        {/* Brand */}
        <div className="col-span-2 md:col-span-4 flex flex-col gap-3">
          <ConvexLogo />
          <p className="text-xs text-[#a9a9ac] leading-relaxed max-w-xs mt-2">
            The reactive backend platform for full-stack TypeScript applications.
          </p>
        </div>

        {/* Product */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2.5 text-xs">
          <span className="font-bold uppercase font-mono tracking-wider text-[#6d6d70] text-[11px]">
            Product
          </span>
          <a href="#sync" className="text-[#a9a9ac] hover:text-white transition-colors">Sync</a>
          <a href="#realtime" className="text-[#a9a9ac] hover:text-white transition-colors">Realtime</a>
          <a href="#auth" className="text-[#a9a9ac] hover:text-white transition-colors">Auth</a>
          <a href="#database" className="text-[#a9a9ac] hover:text-white transition-colors">Database</a>
          <a href="#vector" className="text-[#a9a9ac] hover:text-white transition-colors">Vector Search</a>
        </div>

        {/* Developers */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2.5 text-xs">
          <span className="font-bold uppercase font-mono tracking-wider text-[#6d6d70] text-[11px]">
            Developers
          </span>
          <a href="#docs" className="text-[#a9a9ac] hover:text-white transition-colors">Docs</a>
          <a href="#blog" className="text-[#a9a9ac] hover:text-white transition-colors">Blog</a>
          <a href="#components" className="text-[#a9a9ac] hover:text-white transition-colors">Components</a>
          <a href="#templates" className="text-[#a9a9ac] hover:text-white transition-colors">Templates</a>
          <a href="#changelog" className="text-[#a9a9ac] hover:text-white transition-colors">Changelog</a>
        </div>

        {/* Company */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2.5 text-xs">
          <span className="font-bold uppercase font-mono tracking-wider text-[#6d6d70] text-[11px]">
            Company
          </span>
          <a href="#about" className="text-[#a9a9ac] hover:text-white transition-colors">About us</a>
          <a href="#brand" className="text-[#a9a9ac] hover:text-white transition-colors">Brand</a>
          <a href="#investors" className="text-[#a9a9ac] hover:text-white transition-colors">Investors</a>
          <a href="#careers" className="text-[#a9a9ac] hover:text-white transition-colors">Careers</a>
        </div>

        {/* Social */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2.5 text-xs">
          <span className="font-bold uppercase font-mono tracking-wider text-[#6d6d70] text-[11px]">
            Social
          </span>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[#a9a9ac] hover:text-white transition-colors">Twitter</a>
          <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-[#a9a9ac] hover:text-white transition-colors">Discord</a>
          <a href="https://github.com/get-convex" target="_blank" rel="noreferrer" className="text-[#a9a9ac] hover:text-white transition-colors">GitHub</a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-[#a9a9ac] hover:text-white transition-colors">YouTube</a>
        </div>

      </div>

      <div className="max-w-[1240px] mx-auto mt-12 pt-6 border-t border-[#38383a] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6d6d70] font-mono">
        <span>&copy; {new Date().getFullYear()} Convex, Inc. All rights reserved.</span>
        <span>Cream paper engineering notebook · Zero Drop Shadows</span>
      </div>
    </footer>
  );
};
