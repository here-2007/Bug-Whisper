import React, { useRef } from 'react';
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

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

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

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });
  };

  React.useEffect(() => {
    if (editorRef.current && highlightLine) {
      editorRef.current.revealLineInCenter(highlightLine);
      editorRef.current.setPosition({ lineNumber: highlightLine, column: 1 });
      editorRef.current.focus();
    }
  }, [highlightLine]);

  return (
    <div className="flex-1 flex flex-col bg-[#141414] border-r border-[#2d3128] overflow-hidden">
      {/* Editor Sub-Header */}
      <div className="h-8 bg-[#1e201b] border-b border-[#2d3128] px-3.5 flex items-center justify-between text-xs font-mono text-[#8e9385] select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 rounded bg-[#3776ab] text-[9px] font-bold text-[#ffd43b]">PY</span>
          <span className="text-[#d6dad0] font-medium">main.py</span>
          {highlightLine && (
            <span className="text-[10px] text-[#fc618d] bg-[#3a1a23] px-1.5 py-0.2 rounded">
              Line {highlightLine} exception
            </span>
          )}
        </div>
        <span className="text-[11px] text-[#64685b]">UTF-8 · Python</span>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 min-h-[380px] h-[400px]">
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
          }}
        />
      </div>
    </div>
  );
};
