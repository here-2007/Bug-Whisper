import React from 'react';
import { Play, Sparkles, RotateCw, Loader2 } from 'lucide-react';
import { BUG_PRESETS } from '../../constants/presets';
import type { BugPreset } from '../../types/presets';

interface PlaygroundHeaderProps {
  activePresetId: string;
  onSelectPreset: (preset: BugPreset) => void;
  onRun: () => void;
  onHeal: () => void;
  onReset: () => void;
  isExecuting: boolean;
  isFixing: boolean;
  status: string;
}

export const PlaygroundHeader: React.FC<PlaygroundHeaderProps> = ({
  activePresetId,
  onSelectPreset,
  onRun,
  onHeal,
  onReset,
  isExecuting,
  isFixing,
  status,
}) => {
  const getStatusBadge = () => {
    if (isFixing) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-[#351e18] text-[#ea6b42] border border-[#5a2c20]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ea6b42] animate-pulse" />
          <span>Synthesizing...</span>
        </span>
      );
    }
    if (isExecuting) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-[#322c15] text-[#f8e67a] border border-[#52451c]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f8e67a] animate-ping" />
          <span>Executing...</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-[#1a291e] text-[#7bd88f] border border-[#27462e]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7bd88f]" />
        <span>{status === 'loading' ? 'Loading Wasm' : 'Sandbox Ready'}</span>
      </span>
    );
  };

  return (
    <div className="w-full bg-[#181a16] border-b border-[#2d3128] px-4 py-2.5 flex items-center justify-between gap-3 select-none flex-wrap lg:flex-nowrap">
      {/* Left: Traffic Lights, Title & Status */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#fc618d]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#f8e67a]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#7bd88f]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-white tracking-tight">
            bug-whisper · python 3.12
          </span>
          {getStatusBadge()}
        </div>
      </div>

      {/* Center: Presets Quick Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
        <span className="text-[10px] font-mono uppercase text-[#6f7566] mr-1 hidden xl:inline">
          Presets:
        </span>
        {BUG_PRESETS.slice(0, 5).map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer border ${
                isActive
                  ? 'bg-[#262c21] text-[#9cdcfe] border-[#3b4731]'
                  : 'bg-[#1e201b] text-[#8e9385] hover:text-white border-[#2d3128] hover:border-[#3d4236]'
              }`}
            >
              {preset.exceptionType}
            </button>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onReset}
          title="Reset to initial preset"
          className="p-1.5 rounded-lg bg-[#20221d] hover:bg-[#282b24] border border-[#2e3227] text-[#8e9385] hover:text-white transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onRun}
          disabled={isExecuting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-mono font-medium transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
          <span>Run (Ctrl+Enter)</span>
        </button>

        <button
          type="button"
          onClick={onHeal}
          disabled={isFixing}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#de5d33] hover:bg-[#eb6a40] text-white text-xs font-mono font-medium transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isFixing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>Heal with 3B</span>
        </button>
      </div>
    </div>
  );
};
