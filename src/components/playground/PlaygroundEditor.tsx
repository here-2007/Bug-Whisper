import React, { useRef, useEffect } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';

interface PlaygroundEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  highlightLine?: number | null;
}

export const PlaygroundEditor: React.FC<PlaygroundEditorProps> = ({
  code,
  onChange,
  onRun,
  highlightLine,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme('playground-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'd7d7d7', background: '141414' },
        { token: 'keyword', foreground: 'fc618d', fontStyle: 'bold' },
        { token: 'keyword.python', foreground: 'fc618d', fontStyle: 'bold' },
        { token: 'type', foreground: '948ae3' },
        { token: 'string', foreground: 'e3d0df' },
        { token: 'number', foreground: 'f8e67a' },
        { token: 'comment', foreground: '6d6d70', fontStyle: 'italic' },
        { token: 'operator', foreground: '69bee2' },
      ],
      colors: {
        'editor.background': '#141414',
        'editor.foreground': '#d7d7d7',
        'editor.lineHighlightBackground': '#1b1d19',
        'editorLineNumber.foreground': '#4f5247',
        'editorLineNumber.activeForeground': '#a9a9ac',
        'editorCursor.foreground': '#69bee2',
      },
    });

    monaco.editor.setTheme('playground-dark');
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onRun);
  };

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (highlightLine && highlightLine > 0) {
      editor.revealLineInCenter(highlightLine);
      editor.setPosition({ lineNumber: highlightLine, column: 1 });
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
        {
          range: new monaco.Range(highlightLine, 1, highlightLine, 1),
          options: {
            isWholeLine: true,
            className: 'bg-[#3d1a24]/50 border-l-2 border-[#fc618d]',
          },
        },
      ]);
    } else {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
    }
  }, [highlightLine]);

  return (
    <div className="flex-1 h-full flex flex-col bg-[#141414] overflow-hidden select-text">
      {/* Editor Sub-Header: Exactly 40px */}
      <div className="h-[40px] min-h-[40px] bg-[#1a1c17] border-b border-[#2d3128] px-3.5 flex items-center justify-between text-xs font-mono text-[#8e9385] select-none shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141414] border border-[#2d3128] text-white shrink-0">
            <span className="px-1.5 py-0.5 rounded bg-[#3776ab] text-[9px] font-bold text-[#ffd43b]">
              PY
            </span>
            <span className="text-[#d6dad0] font-medium text-xs">main.py</span>
          </div>
          {highlightLine && (
            <span className="text-[10px] text-[#fc618d] bg-[#3a1a23] border border-[#5a2030] px-2 py-0.5 rounded font-mono truncate">
              Line {highlightLine} exception
            </span>
          )}
        </div>
        <span className="text-[11px] text-[#64685b] shrink-0 hidden sm:inline">Python 3.12 · UTF-8</span>
      </div>

      {/* Editor Body */}
      <div className="flex-1 w-full h-[calc(100%-40px)] min-h-[360px] overflow-hidden">
        <Editor
          height="100%"
          language="python"
          value={code}
          onChange={(val) => onChange(val || '')}
          onMount={handleMount}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 20,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 12, bottom: 12 },
            overviewRulerLanes: 0,
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
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
    </div>
  );
};
