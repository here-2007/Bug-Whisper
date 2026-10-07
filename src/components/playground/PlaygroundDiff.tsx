import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Check, Copy, CheckCheck, Split, Columns } from 'lucide-react';

interface PlaygroundDiffProps {
  originalCode: string;
  fixedCode: string;
  onAcceptFix: (code: string) => void;
  latencyMs?: number;
}

export const PlaygroundDiff: React.FC<PlaygroundDiffProps> = ({
  originalCode,
  fixedCode,
  onAcceptFix,
  latencyMs = 180,
}) => {
  const [copied, setCopied] = useState(false);
  const [sideBySide, setSideBySide] = useState(true);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasDiff = originalCode.trim() !== fixedCode.trim();

  return (
    <div className="flex-1 flex flex-col bg-[#141414] overflow-hidden font-mono text-xs">
      {/* Diff Toolbar */}
      <div className="h-8 bg-[#1e201b] border-b border-[#2d3128] px-3.5 flex items-center justify-between text-[#8e9385] select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[#d6dad0] font-medium">Patch Synthesized</span>
          <span className="text-[10px] text-[#7bd88f] bg-[#1a2f20] px-1.5 py-0.2 rounded border border-[#274b33]">
            {latencyMs}ms · 3B SFT
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSideBySide(!sideBySide)}
            className="flex items-center gap-1 text-[11px] text-[#8e9385] hover:text-white px-2 py-0.5 rounded cursor-pointer"
            title="Toggle split view"
          >
            {sideBySide ? <Columns className="w-3 h-3" /> : <Split className="w-3 h-3" />}
            <span>{sideBySide ? 'Split' : 'Inline'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-[#8e9385] hover:text-white px-2 py-0.5 rounded bg-[#20231d] border border-[#2e3128] cursor-pointer"
          >
            {copied ? <CheckCheck className="w-3 h-3 text-[#7bd88f]" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={() => onAcceptFix(fixedCode)}
            disabled={!hasDiff}
            className="flex items-center gap-1 px-3 py-1 rounded bg-white hover:bg-neutral-100 text-[#141414] text-[11px] font-bold cursor-pointer transition-colors disabled:opacity-40"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Accept Fix</span>
          </button>
        </div>
      </div>

      {/* Diff Editor */}
      <div className="flex-1 min-h-[340px] h-[360px]">
        {hasDiff ? (
          <DiffEditor
            height="100%"
            language="python"
            original={originalCode}
            modified={fixedCode}
            theme="vs-dark"
            options={{
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              renderSideBySide: sideBySide,
              readOnly: true,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
            }}
          />
        ) : (
          <div className="p-8 text-center text-[#7d8274] italic">
            No patch synthesized yet. Click &apos;Heal with 3B&apos; to generate a minimal AST remediation.
          </div>
        )}
      </div>
    </div>
  );
};
