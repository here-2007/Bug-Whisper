import React from 'react';
import { DiffEditor } from '@monaco-editor/react';

interface PlaygroundDiffProps {
  originalCode: string;
  fixedCode: string;
  sideBySide?: boolean;
}

export const PlaygroundDiff: React.FC<PlaygroundDiffProps> = ({
  originalCode,
  fixedCode,
  sideBySide = true,
}) => {
  const hasDiff = Boolean(fixedCode && originalCode.trim() !== fixedCode.trim());

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-[#141414] overflow-hidden font-mono text-xs select-text">
      {hasDiff ? (
        <div className="flex-1 w-full h-full overflow-hidden">
          <DiffEditor
            height="100%"
            language="python"
            original={originalCode}
            modified={fixedCode}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              renderSideBySide: sideBySide,
              readOnly: true,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
              padding: { top: 12, bottom: 12 },
              overviewRulerLanes: 0,
              overviewRulerBorder: false,
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                verticalScrollbarSize: 6,
                horizontalScrollbarSize: 6,
                alwaysConsumeMouseWheel: false,
                useShadows: false,
              },
            }}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2">
          <div className="text-sm font-semibold text-[#8e9385]">No Patch Synthesized</div>
          <p className="text-xs text-[#64685b] max-w-sm">
            Click &apos;Heal with 3B&apos; or select an error preset to generate a verified, minimal code diff.
          </p>
        </div>
      )}
    </div>
  );
};
