import React from 'react';

export const ConvexFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#0f100e] text-white pt-20 pb-16 px-6 select-none border-t border-[#23261f]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-12 gap-10 lg:gap-14">
        {/* Brand */}
        <div className="col-span-2 md:col-span-4 flex flex-col gap-3">
          <a href="#" className="flex items-center gap-2">
            <span className="font-bold text-[24px] text-white tracking-[-0.04em] lowercase">
              convex
            </span>
          </a>
          <p className="text-xs text-[#8e9385] leading-relaxed max-w-xs mt-1">
            The reactive backend platform that synchronizes full-stack TypeScript applications in real time.
          </p>
        </div>

        {/* Product Column */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-3 text-xs">
          <span className="font-semibold text-white text-[13px]">
            Product
          </span>
          <a href="#sync" className="text-[#8e9385] hover:text-white transition-colors">Sync</a>
          <a href="#realtime" className="text-[#8e9385] hover:text-white transition-colors">Realtime</a>
          <a href="#auth" className="text-[#8e9385] hover:text-white transition-colors">Auth</a>
          <a href="#database" className="text-[#8e9385] hover:text-white transition-colors">Database</a>
          <a href="#vector" className="text-[#8e9385] hover:text-white transition-colors">Vector Search</a>
        </div>

        {/* Developers Column */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-3 text-xs">
          <span className="font-semibold text-white text-[13px]">
            Developers
          </span>
          <a href="#docs" className="text-[#8e9385] hover:text-white transition-colors flex items-center gap-1">Docs <span className="text-[10px]">↗</span></a>
          <a href="#blog" className="text-[#8e9385] hover:text-white transition-colors flex items-center gap-1">Blog <span className="text-[10px]">↗</span></a>
          <a href="#components" className="text-[#8e9385] hover:text-white transition-colors">Components</a>
          <a href="#templates" className="text-[#8e9385] hover:text-white transition-colors">Templates</a>
          <a href="#changelog" className="text-[#8e9385] hover:text-white transition-colors">Changelog</a>
        </div>

        {/* Company Column */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-3 text-xs">
          <span className="font-semibold text-white text-[13px]">
            Company
          </span>
          <a href="#about" className="text-[#8e9385] hover:text-white transition-colors">About us</a>
          <a href="#brand" className="text-[#8e9385] hover:text-white transition-colors">Brand</a>
          <a href="#investors" className="text-[#8e9385] hover:text-white transition-colors">Investors</a>
          <a href="#careers" className="text-[#8e9385] hover:text-white transition-colors">Careers</a>
        </div>

        {/* Social Column */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-3 text-xs">
          <span className="font-semibold text-white text-[13px]">
            Social
          </span>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[#8e9385] hover:text-white transition-colors flex items-center gap-1">Twitter <span className="text-[10px]">↗</span></a>
          <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-[#8e9385] hover:text-white transition-colors flex items-center gap-1">Discord <span className="text-[10px]">↗</span></a>
          <a href="https://github.com/get-convex" target="_blank" rel="noreferrer" className="text-[#8e9385] hover:text-white transition-colors flex items-center gap-1">GitHub <span className="text-[10px]">↗</span></a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-[#8e9385] hover:text-white transition-colors flex items-center gap-1">YouTube <span className="text-[10px]">↗</span></a>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-[#1c1e19] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64685b] font-mono">
        <span>&copy; {new Date().getFullYear()} Convex, Inc. All rights reserved.</span>
        <span>Cream Paper Engineering Notebook · Zero Drop Shadows</span>
      </div>
    </footer>
  );
};
