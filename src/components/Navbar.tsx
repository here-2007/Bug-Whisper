import React from 'react';
import { SlidersHorizontal, ExternalLink, Cpu, Star } from 'lucide-react';
import {
  type ProviderType,
  PROVIDER_SHORT_LABELS,
} from '../types/settings';

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

interface NavbarProps {
  currentProvider?: ProviderType;
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProvider = 'mock',
  onOpenSettings,
}) => {
  const providerLabel = PROVIDER_SHORT_LABELS[currentProvider] || 'Mock';

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-paper-white border-b border-mist-divider px-6 flex items-center justify-between select-none">
      {/* Left: Wordmark & Navigation Links */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ink-black flex items-center justify-center text-paper-white font-mono font-bold text-sm">
            BW
          </div>
          <a href="#" className="flex flex-col">
            <span className="font-bold text-lg text-ink-black tracking-[-0.025em] leading-tight">
              Bug Whisper
            </span>
          </a>
        </div>

        {/* Section Navigation Anchors */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-text">
          <a
            href="#studio"
            className="hover:text-ink-black transition-colors"
          >
            Studio
          </a>
          <a
            href="#ai-tools"
            className="hover:text-ink-black transition-colors"
          >
            AI + Tools
          </a>
          <a
            href="#architecture"
            className="hover:text-ink-black transition-colors"
          >
            Architecture
          </a>
          <a
            href="#community"
            className="hover:text-ink-black transition-colors"
          >
            Community
          </a>
          <a
            href="#integrations"
            className="hover:text-ink-black transition-colors"
          >
            Integrations
          </a>
          <a
            href="#faq"
            className="hover:text-ink-black transition-colors"
          >
            FAQ
          </a>
        </nav>
      </div>

      {/* Right: GitHub Stars, Kaggle Pill, Start Repairing CTA, Settings */}
      <div className="flex items-center gap-3">
        {/* Active Backend Indicator Pill */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cream-surface border border-mist-divider text-xs font-mono text-slate-text"
          title={`Active Inference Provider: ${providerLabel}`}
        >
          <Cpu className="w-3.5 h-3.5 text-fog-text" />
          <span className="hidden md:inline text-fog-text">Backend:</span>
          <span className="font-semibold text-ink-black">{providerLabel}</span>
        </div>

        {/* GitHub Stars Pill (Convex Component 166) */}
        <a
          href="https://github.com/harshitxdev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper-white hover:bg-cream-surface border border-mist-divider text-xs font-mono text-ink-black transition-colors"
          title="View on GitHub"
        >
          <GithubIcon className="w-3.5 h-3.5 text-ink-black" />
          <span className="text-mist-divider">|</span>
          <Star className="w-3 h-3 text-canary-yellow fill-canary-yellow" />
          <span className="font-medium">2,480</span>
        </a>

        {/* Ghost CTA: Kaggle */}
        <a
          href="https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper-white hover:bg-cream-surface border border-mist-divider text-xs font-medium text-slate-text hover:text-ink-black transition-colors"
          title="View fine-tuned weights on Kaggle Models"
        >
          <span>Kaggle</span>
          <ExternalLink className="w-3 h-3 text-fog-text" />
        </a>

        {/* Filled Dark CTA: Start Repairing */}
        <a
          href="#studio"
          className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg bg-ink-black hover:bg-[#292929] text-paper-white text-xs font-medium transition-colors"
        >
          Start repairing
        </a>

        {/* Settings Drawer Toggle */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-paper-white hover:bg-cream-surface border border-mist-divider text-slate-text hover:text-ink-black transition-colors cursor-pointer"
          aria-label="Open Inference Settings"
          title="Inference Settings"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-fog-text" />
        </button>
      </div>
    </header>
  );
};

