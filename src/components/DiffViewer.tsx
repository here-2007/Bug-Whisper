import React, { useState } from 'react';
import { DiffEditor, type DiffOnMount } from '@monaco-editor/react';
import { Check, Copy, CheckCheck, Split, Columns } from 'lucide-react';

interface DiffViewerProps {
  originalCode: string;
  fixedCode: string;
  onAcceptFix: (fixedCode: string) => void;
  latencyMs?: number | null;
  providerLabel?: string;
  className?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalCode,
  fixedCode,
  onAcceptFix,
  latencyMs,
  providerLabel = 'Qwen 2.5 Coder 3B',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [renderSideBySide, setRenderSideBySide] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleMount: DiffOnMount = (_, monaco) => {
    monaco.editor.setTheme('vs-dark');
  };

  const hasDiff = originalCode.trim() !== fixedCode.trim();

  return (
    <div
      className={`rounded-xl bg-ink-black border border-graphite-border flex flex-col overflow-hidden ${className}`}
    >
      {/* 32px Tab Bar */}
      <div className="h-8 bg-charcoal-surface px-4 flex items-center justify-between border-b border-graphite-border select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-ash-text">
            Remediation Diff · {providerLabel}
          </span>
          {latencyMs != null && (
            <span className="text-[10px] font-mono text-mint-green bg-ink-black px-2 py-0.5 rounded border border-graphite-border">
              {latencyMs}ms
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Side-by-Side vs Inline */}
          <button
            type="button"
            onClick={() => setRenderSideBySide(!renderSideBySide)}
            className="flex items-center gap-1 text-[11px] font-mono text-fog-text hover:text-ash-text px-2 py-0.5 rounded hover:bg-ink-black transition-colors cursor-pointer"
            title={renderSideBySide ? 'Switch to inline diff view' : 'Switch to split side-by-side view'}
          >
            {renderSideBySide ? <Columns className="w-3 h-3" /> : <Split className="w-3 h-3" />}
            <span className="hidden sm:inline">{renderSideBySide ? 'Split' : 'Inline'}</span>
          </button>

          {/* Copy Fixed Code */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-mono text-ash-text hover:text-paper-white px-2 py-0.5 rounded bg-ink-black border border-graphite-border hover:border-fog-text transition-colors cursor-pointer"
            title="Copy fixed Python code to clipboard"
          >
            {copied ? (
              <>
                <CheckCheck className="w-3 h-3 text-mint-green" />
                <span className="text-mint-green">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-ash-text" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Accept Fix CTA */}
          <button
            type="button"
            onClick={() => onAcceptFix(fixedCode)}
            disabled={!hasDiff}
            className="flex items-center gap-1.5 text-xs font-mono font-semibold text-ink-black bg-paper-white hover:bg-cream-surface disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1 rounded-lg transition-colors cursor-pointer"
            title="Apply this remediation directly into the active editor"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5] text-ink-black" />
            <span>Accept Fix</span>
          </button>
        </div>
      </div>

      {/* Monaco Diff Editor Body */}
      <div className="flex-1 w-full min-h-[320px] bg-ink-black">
        <DiffEditor
          height="100%"
          language="python"
          original={originalCode}
          modified={fixedCode}
          onMount={handleMount}
          options={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            renderSideBySide,
            readOnly: true,
            renderIndicators: true,
            originalEditable: false,
            padding: { top: 12, bottom: 12 },
          }}
          loading={
            <div className="flex items-center justify-center h-full text-xs font-mono text-fog-text">
              Loading Monaco Diff Engine...
            </div>
          }
        />
      </div>
    </div>
  );
};
