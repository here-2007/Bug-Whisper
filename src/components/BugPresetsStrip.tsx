import React from 'react';
import type { BugPreset, PresetCategory } from '../types/presets';
import { BUG_PRESETS } from '../constants/presets';

interface BugPresetsStripProps {
  presets?: BugPreset[];
  activePresetId?: string | null;
  onSelectPreset: (preset: BugPreset) => void;
}

const CATEGORY_COLORS: Record<PresetCategory, { text: string; bg: string; border: string }> = {
  Runtime: {
    text: '#fc618d',
    bg: 'rgba(252, 97, 141, 0.12)',
    border: 'rgba(252, 97, 141, 0.28)',
  },
  Type: {
    text: '#948ae3',
    bg: 'rgba(148, 138, 227, 0.12)',
    border: 'rgba(148, 138, 227, 0.28)',
  },
  Logic: {
    text: '#f8e67a',
    bg: 'rgba(248, 230, 122, 0.15)',
    border: 'rgba(248, 230, 122, 0.35)',
  },
  Syntax: {
    text: '#de5d33',
    bg: 'rgba(222, 93, 51, 0.12)',
    border: 'rgba(222, 93, 51, 0.28)',
  },
};

export const BugPresetsStrip: React.FC<BugPresetsStripProps> = ({
  presets = BUG_PRESETS,
  activePresetId = null,
  onSelectPreset,
}) => {
  return (
    <div className="w-full bg-cream-surface border-b border-mist-divider px-6 py-2.5 flex items-center gap-3 overflow-x-auto select-none">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] font-mono uppercase tracking-[0.05em] text-fog-text font-semibold">
          Presets:
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {presets.map((preset) => {
          const isActive = activePresetId === preset.id;
          const catStyle = CATEGORY_COLORS[preset.category];

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              title={`${preset.name}: ${preset.summary}`}
              className={`group flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-mono transition-all cursor-pointer border ${
                isActive
                  ? 'bg-charcoal-surface border-graphite-border text-paper-white'
                  : 'bg-paper-white hover:bg-[#fafafa] border-mist-divider text-slate-text hover:text-ink-black'
              }`}
            >
              {/* Category Micro Badge */}
              <span
                className="text-[9px] font-mono uppercase tracking-[0.05em] px-1.5 py-0.2 rounded border font-medium"
                style={{
                  color: catStyle.text,
                  backgroundColor: catStyle.bg,
                  borderColor: catStyle.border,
                }}
              >
                {preset.category}
              </span>

              {/* Exception / Preset Name */}
              <span className={`font-medium ${isActive ? 'text-paper-white' : 'text-ink-black'}`}>
                {preset.name.split(':')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
