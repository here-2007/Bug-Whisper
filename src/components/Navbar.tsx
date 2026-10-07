import React from 'react';
import { SlidersHorizontal, ExternalLink, Cpu } from 'lucide-react';
import {
  type ProviderType,
  PROVIDER_SHORT_LABELS,
} from '../types/settings';

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
    <header className="h-16 w-full bg-paper-white border-b border-mist-divider px-6 flex items-center justify-between select-none">
      {/* Left: Wordmark & Tagline */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-ink-black flex items-center justify-center text-paper-white font-mono font-bold text-sm">
            BW
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-ink-black tracking-[-0.025em] leading-tight">
              Bug Whisper
            </span>
          </div>
        </div>

        <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-[0.05em] px-2 py-0.5 rounded bg-cream-surface border border-mist-divider text-fog-text">
          Qwen 2.5 Coder 3B Studio
        </span>
      </div>

      {/* Center & Right: Model Pill, Backend Pill, Kaggle Link, Settings Button */}
      <div className="flex items-center gap-2.5">
        {/* Model Badge Pill */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-surface border border-graphite-border text-ash-text text-xs font-mono"
          title="Fine-tuned bug-whisper-qwen25-coder-3b"
        >
          <span className="w-2 h-2 rounded-full bg-mint-green animate-pulse" />
          <span className="text-[#e5e5e5] font-medium">Qwen 2.5 Coder 3B · 4bit-bnb</span>
        </div>

        {/* Active Backend Indicator Pill */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream-surface border border-mist-divider text-xs font-mono text-slate-text"
          title={`Active Inference Provider: ${providerLabel}`}
        >
          <Cpu className="w-3.5 h-3.5 text-fog-text" />
          <span className="text-fog-text">Backend:</span>
          <span className="font-semibold text-ink-black">{providerLabel}</span>
        </div>

        {/* Kaggle Link Pill */}
        <a
          href="https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper-white hover:bg-cream-surface border border-mist-divider text-xs font-medium text-slate-text hover:text-ink-black transition-colors"
          title="View fine-tuned weights on Kaggle Models"
        >
          <span>Kaggle Model</span>
          <ExternalLink className="w-3 h-3 text-fog-text" />
        </a>

        {/* Settings Drawer Toggle Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-paper-white hover:bg-cream-surface border border-mist-divider text-xs font-medium text-ink-black transition-colors cursor-pointer"
          aria-label="Open Inference Settings"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-fog-text" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </header>
  );
};
