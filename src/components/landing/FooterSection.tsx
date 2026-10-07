import React from 'react';
import { Terminal } from 'lucide-react';

export const FooterSection: React.FC = () => {
  return (
    <footer className="w-full bg-[#0f100e] text-white pt-20 pb-16 px-6 select-none border-t border-[#23261f]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-12 gap-10 lg:gap-14">
        {/* Brand */}
        <div className="col-span-2 md:col-span-4 flex flex-col gap-3">
          <a href="#" className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#de5d33]" />
            <span className="font-bold text-[24px] text-white tracking-[-0.04em] lowercase">
              bug whisper
            </span>
          </a>
          <p className="text-xs text-[#8e9385] leading-relaxed max-w-xs mt-1">
            The deterministic Python bug repair platform powered by CPython AST validation and Qwen 2.5 Coder 3B intelligence.
          </p>
        </div>

        {/* Product Column */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-3 text-xs">
          <span className="font-semibold text-white text-[13px]">
            Product
          </span>
          <a href="#playground" className="text-[#8e9385] hover:text-white transition-colors">Runtime Studio</a>
          <a href="#architecture" className="text-[#8e9385] hover:text-white transition-colors">Two-Stage Verifier</a>
          <a href="#inference" className="text-[#8e9385] hover:text-white transition-colors">AST Focal Window</a>
          <a href="#diff" className="text-[#8e9385] hover:text-white transition-colors">Unified Diff Engine</a>
        </div>

        {/* Engine Column */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-3 text-xs">
          <span className="font-semibold text-white text-[13px]">
            Engine
          </span>
          <a href="#cpython" className="text-[#8e9385] hover:text-white transition-colors">CPython Isolation</a>
          <a href="#timeout" className="text-[#8e9385] hover:text-white transition-colors">Subprocess Sandbox</a>
          <a href="#webworker" className="text-[#8e9385] hover:text-white transition-colors">Pyodide WebWorker</a>
          <a href="#traceback" className="text-[#8e9385] hover:text-white transition-colors">Traceback Interceptor</a>
        </div>

        {/* CLI & API Column */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-3 text-xs">
          <span className="font-semibold text-white text-[13px]">
            CLI & API
          </span>
          <a href="#cli" className="text-[#8e9385] hover:text-white transition-colors">Typer CLI (bugwhisper)</a>
          <a href="#fastapi" className="text-[#8e9385] hover:text-white transition-colors">FastAPI REST Server</a>
          <a href="#stream" className="text-[#8e9385] hover:text-white transition-colors">SSE Event Stream</a>
          <a href="#pytest" className="text-[#8e9385] hover:text-white transition-colors">Pytest Runner</a>
        </div>

        {/* Community Column */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-3 text-xs">
          <span className="font-semibold text-white text-[13px]">
            Community
          </span>
          <a href="https://github.com/harshitthek/bug-whisper" target="_blank" rel="noreferrer" className="text-[#8e9385] hover:text-white transition-colors flex items-center gap-1">GitHub 3B <span className="text-[10px]">↗</span></a>
          <a href="https://pypi.org/project/bugwhisper" target="_blank" rel="noreferrer" className="text-[#8e9385] hover:text-white transition-colors flex items-center gap-1">PyPI Package <span className="text-[10px]">↗</span></a>
          <a href="https://discord.gg" target="_blank" rel="noreferrer" className="text-[#8e9385] hover:text-white transition-colors flex items-center gap-1">Discord <span className="text-[10px]">↗</span></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[#8e9385] hover:text-white transition-colors flex items-center gap-1">Twitter / X <span className="text-[10px]">↗</span></a>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-[#1c1e19] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64685b] font-mono">
        <span>&copy; {new Date().getFullYear()} Bug Whisper. Open-source Python intelligence.</span>
        <span>Cream Paper Engineering Notebook · Zero Drop Shadows</span>
      </div>
    </footer>
  );
};
