import React from 'react';
import { Play, RotateCw, Loader2, Share2, Check } from 'lucide-react';
import { BUG_PRESETS } from '../../constants/presets';

interface PlaygroundHeaderProps {
  onRun: () => void;
  onReset: () => void;
  onSelectPreset?: (presetId: string) => void;
  onShare?: () => void;
  selectedPresetId?: string;
  isShareCopied?: boolean;
  isExecuting: boolean;
  isExplaining?: boolean;
  status: string;
}

export const PlaygroundHeader: React.FC<PlaygroundHeaderProps> = ({
  onRun,
  onReset,
  onSelectPreset,
  onShare,
  selectedPresetId = 'default',
  isShareCopied = false,
  isExecuting,
  isExplaining = false,
  status,
}) => {
  const getStatusBadge = () => {
    if (isExecuting) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-[#322c15] text-[#f8e67a] border border-[#52451c]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f8e67a] animate-ping" />
          <span>Executing...</span>
        </span>
      );
    }
    if (isExplaining) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-[#351e18] text-[#ea6b42] border border-[#5a2c20]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ea6b42] animate-pulse" />
          <span>Diagnosing...</span>
        </span>
      );
    }
    if (status === 'error') {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-[#2b161b] text-[#fc618d] border border-[#52222c]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#fc618d]" />
          <span>Static Tracer Active</span>
        </span>
      );
    }
    if (status === 'loading') {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-[#322c15] text-[#f8e67a] border border-[#52451c]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f8e67a] animate-pulse" />
          <span>Loading Wasm...</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-[#1a291e] text-[#7bd88f] border border-[#27462e]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7bd88f]" />
        <span>Sandbox Ready</span>
      </span>
    );
  };

  return (
    <div className="w-full bg-[#181a16] border-b border-[#2d3128] px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 select-none flex-wrap sm:flex-nowrap">
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

      {/* Center: Interactive Bug Preset Selector */}
      {onSelectPreset && (
        <div className="flex items-center gap-1.5 shrink-0">
          <select
            value={selectedPresetId}
            onChange={(e) => onSelectPreset(e.target.value)}
            title="Load preset bug scenarios"
            className="bg-[#20221d] hover:bg-[#282b24] border border-[#2e3227] hover:border-[#3d4236] text-[#d8decb] text-[11px] font-mono px-2.5 py-1 rounded-lg outline-none cursor-pointer transition-colors max-w-[210px] sm:max-w-xs truncate"
          >
            <option value="default">Preset: Telemetry ZeroDivision</option>
            {BUG_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                Preset: {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {onShare && (
          <button
            type="button"
            onClick={onShare}
            title="Copy shareable link with current code"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#20221d] hover:bg-[#282b24] border border-[#2e3227] text-[#8e9385] hover:text-white text-xs font-mono transition-colors cursor-pointer"
          >
            {isShareCopied ? <Check className="w-3.5 h-3.5 text-[#7bd88f]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isShareCopied ? 'Link Copied!' : 'Share'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          title="Reset code snippet and clear output"
          className="p-1.5 rounded-lg bg-[#20221d] hover:bg-[#282b24] border border-[#2e3227] text-[#8e9385] hover:text-white transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onRun}
          disabled={isExecuting}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-mono font-medium transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
          <span>Run (Ctrl+Enter)</span>
        </button>
      </div>
    </div>
  );
};
