import React from 'react';
import { ExternalLink } from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-3 h-3' }) => (
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

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-cream-surface py-12 px-6 border-t border-mist-divider select-none">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-ink-black tracking-tight">
              Bug Whisper
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.05em] px-2 py-0.5 rounded bg-paper-white border border-mist-divider text-fog-text">
              v0.1.0-qwen3b
            </span>
          </div>
          <p className="text-xs text-fog-text font-normal">
            Deterministic runtime execution + fine-tuned code repair intelligence.
          </p>
          <p className="text-xs text-ash-text">
            Created by <span className="text-slate-text font-medium">Harshit Sharma</span> &amp; <span className="text-slate-text font-medium">Pernav Jain</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-text">
          <a
            href="https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-ink-black transition-colors"
          >
            <span>Kaggle Model</span>
            <ExternalLink className="w-3 h-3 text-fog-text" />
          </a>
          <a
            href="https://www.kaggle.com/datasets/pernavjain/python-errors"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-ink-black transition-colors"
          >
            <span>CommitPack Dataset</span>
            <ExternalLink className="w-3 h-3 text-fog-text" />
          </a>
          <a
            href="https://github.com/harshitxdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-ink-black transition-colors"
          >
            <GithubIcon className="w-3 h-3 text-fog-text" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
