import React from 'react';
import { ExternalLink } from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#111111] text-paper-white py-16 px-6 border-t border-graphite-border select-none">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Left Column: Brand & Authors */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-charcoal-surface border border-graphite-border flex items-center justify-center text-paper-white font-mono font-bold text-sm">
              BW
            </div>
            <span className="font-bold text-lg text-paper-white tracking-[-0.025em]">
              Bug Whisper
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-surface border border-graphite-border text-fog-text">
              v0.1.1-qwen3b
            </span>
          </div>

          <p className="text-xs text-ash-text leading-relaxed font-normal max-w-sm">
            Deterministic CPython AST validation meets fine-tuned Qwen 2.5 Coder 3B intelligence. Zero regressions, instant traceback healing.
          </p>

          <p className="text-xs text-fog-text mt-2">
            Created by{' '}
            <span className="text-paper-white font-medium">Harshit Sharma</span>{' '}
            &amp;{' '}
            <span className="text-paper-white font-medium">Pernav Jain</span>.
          </p>
        </div>

        {/* Column 2: Product Links */}
        <div className="md:col-span-2 flex flex-col gap-3 text-xs">
          <span className="font-bold uppercase font-mono tracking-wider text-fog-text text-[11px]">
            Product
          </span>
          <a href="#studio" className="text-ash-text hover:text-paper-white transition-colors">
            Web Studio
          </a>
          <a href="#ai-tools" className="text-ash-text hover:text-paper-white transition-colors">
            AI + Tools
          </a>
          <a href="#architecture" className="text-ash-text hover:text-paper-white transition-colors">
            Architecture
          </a>
          <a href="#benchmarks" className="text-ash-text hover:text-paper-white transition-colors">
            Benchmarks
          </a>
          <a href="#community" className="text-ash-text hover:text-paper-white transition-colors">
            Community Love
          </a>
        </div>

        {/* Column 3: Research & Model Links */}
        <div className="md:col-span-3 flex flex-col gap-3 text-xs">
          <span className="font-bold uppercase font-mono tracking-wider text-fog-text text-[11px]">
            Research &amp; Datasets
          </span>
          <a
            href="https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ash-text hover:text-paper-white transition-colors flex items-center gap-1"
          >
            <span>Qwen 2.5 Coder 3B Weights</span>
            <ExternalLink className="w-3 h-3 text-fog-text" />
          </a>
          <a
            href="https://www.kaggle.com/datasets/pernavjain/python-errors"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ash-text hover:text-paper-white transition-colors flex items-center gap-1"
          >
            <span>CommitPack Python Errors</span>
            <ExternalLink className="w-3 h-3 text-fog-text" />
          </a>
          <span className="text-fog-text">
            4-bit NF4 Quantization Pipeline
          </span>
          <span className="text-fog-text">
            Pass@1 HumanEval Verification
          </span>
        </div>

        {/* Column 4: Ecosystem & Social */}
        <div className="md:col-span-3 flex flex-col gap-3 text-xs">
          <span className="font-bold uppercase font-mono tracking-wider text-fog-text text-[11px]">
            Developers
          </span>
          <a
            href="https://github.com/harshitxdev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ash-text hover:text-paper-white transition-colors flex items-center gap-1.5"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub (@harshitxdev)</span>
          </a>
          <a
            href="https://www.kaggle.com/pernavjain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ash-text hover:text-paper-white transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Kaggle (@pernavjain)</span>
          </a>
          <span className="text-fog-text">
            License: Apache-2.0 Open Source
          </span>
          <span className="text-fog-text">
            Pyodide v0.26 WebAssembly Runtime
          </span>
        </div>

      </div>

      <div className="max-w-[1240px] mx-auto mt-12 pt-6 border-t border-graphite-border flex flex-col sm:flex-row items-center justify-between text-xs text-fog-text font-mono">
        <span>&copy; {CURRENT_YEAR} Bug Whisper. All rights reserved.</span>
        <span>Cream Paper Engineering Notebook · Zero Drop Shadows</span>
      </div>
    </footer>
  );
};
