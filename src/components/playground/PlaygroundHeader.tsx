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
  return (
    <div className="w-full bg-[#1b1d19] border-b border-[#2d3128] px-4 py-3 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Left: Traffic Lights & Title & Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#fc618d]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#f8e67a]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#7bd88f]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-white tracking-tight">
            playground · Python 3.12 Wasm
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#242721] text-[#9ba092] border border-[#373c30]">
            {status === 'ready' ? '● Sandbox Ready' : status === 'loading' ? '○ Loading Wasm...' : '● Sandbox Active'}
          </span>
        </div>
      </div>

      {/* Center: Presets Quick Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        <span className="text-[10px] font-mono uppercase text-[#7d8274] mr-1 hidden sm:inline">Presets:</span>
        {BUG_PRESETS.slice(0, 5).map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#2e3328] text-white border-[#4d5442]'
                  : 'bg-[#22251f] text-[#9ba092] hover:text-white border-[#32362b] hover:border-[#444a3b]'
              }`}
            >
              {preset.exceptionType}
            </button>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          title="Reset to default code"
          className="p-1.5 rounded-lg bg-[#22251f] hover:bg-[#2b2f27] border border-[#32362b] text-[#9ba092] hover:text-white transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onRun}
          disabled={isExecuting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-mono font-semibold transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isExecuting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white" />
          )}
          <span>Run (Ctrl+↵)</span>
        </button>

        <button
          type="button"
          onClick={onHeal}
          disabled={isFixing}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#de5d33] hover:bg-[#ea6b42] text-white text-xs font-mono font-semibold transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isFixing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>Heal with 3B</span>
        </button>
      </div>
    </div>
  );
};
