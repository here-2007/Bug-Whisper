import React, { useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Play, Loader2 } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  isExecuting?: boolean;
  highlightLine?: number | null;
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  onRun,
  isExecuting = false,
  highlightLine = null,
  className = '',
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define the Dark Code Theme
    monaco.editor.defineTheme('notebook-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'd7d7d7', background: '141414' },
        { token: 'keyword', foreground: 'fc618d', fontStyle: 'bold' },
        { token: 'keyword.python', foreground: 'fc618d', fontStyle: 'bold' },
        { token: 'type', foreground: '948ae3' },
        { token: 'class', foreground: '948ae3' },
        { token: 'string', foreground: 'e3d0df' },
        { token: 'number', foreground: 'f8e67a' },
        { token: 'constant', foreground: 'f8e67a' },
        { token: 'comment', foreground: '6d6d70', fontStyle: 'italic' },
        { token: 'operator', foreground: '69bee2' },
        { token: 'delimiter', foreground: 'a9a9ac' },
      ],
      colors: {
        'editor.background': '#141414',
        'editor.foreground': '#d7d7d7',
        'editor.lineHighlightBackground': '#1f1f1f',
        'editorLineNumber.foreground': '#4f4f52',
        'editorLineNumber.activeForeground': '#a9a9ac',
        'editorCursor.foreground': '#69bee2',
        'editor.selectionBackground': '#2a3b5c',
        'editor.inactiveSelectionBackground': '#1e283d',
      },
    });

    monaco.editor.setTheme('notebook-dark');

    // Add Ctrl+Enter / Cmd+Enter run command
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });
  };

  // Jump to failing line if provided
  React.useEffect(() => {
    if (editorRef.current && highlightLine) {
      editorRef.current.revealLineInCenter(highlightLine);
      editorRef.current.setPosition({ lineNumber: highlightLine, column: 1 });
      editorRef.current.focus();
    }
  }, [highlightLine]);

  return (
    <div
      className={`rounded-xl bg-ink-black border border-graphite-border flex flex-col overflow-hidden ${className}`}
    >
      {/* 32px Tab Bar */}
      <div className="h-8 bg-charcoal-surface px-4 flex items-center justify-between border-b border-graphite-border select-none shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-hot-pink" />
          <span className="w-2.5 h-2.5 rounded-full bg-canary-yellow" />
          <span className="w-2.5 h-2.5 rounded-full bg-mint-green" />
          <span className="ml-3 text-xs font-mono text-ash-text">main.py</span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-mono text-fog-text">Python 3.12 (Wasm)</span>

          {/* Primary Signal Blue CTA on Dark Frame */}
          <button
            type="button"
            onClick={onRun}
            disabled={isExecuting}
            className="flex items-center gap-1.5 text-xs font-mono font-semibold text-ink-black bg-signal-blue hover:bg-[#85ceec] disabled:opacity-50 px-3 py-1 rounded-lg transition-colors cursor-pointer"
            title="Execute Python in Pyodide Wasm Sandbox (Ctrl+Enter)"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-ink-black" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current text-ink-black" />
                <span>Run &amp; Whisper</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real Monaco Editor Body */}
      <div className="flex-1 w-full min-h-[320px] bg-ink-black">
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={value}
          onChange={(newVal) => onChange(newVal ?? '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            padding: { top: 12, bottom: 12 },
            lineNumbers: 'on',
            folding: true,
            renderLineHighlight: 'line',
          }}
          loading={
            <div className="flex items-center justify-center h-full text-xs font-mono text-fog-text">
              Loading Monaco Editor...
            </div>
          }
        />
      </div>
    </div>
  );
};
