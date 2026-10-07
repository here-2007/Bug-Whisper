import React, { useState } from 'react';
import { RotateCw, Check } from 'lucide-react';
import type { ConvexTodo } from '../../hooks/useConvexDemo';

interface ConvexTodoPreviewProps {
  todos: ConvexTodo[];
  onToggleTodo: (id: string) => void;
  onAddTodo: (text: string) => void;
  showBlockedHint: boolean;
}

export const ConvexTodoPreview: React.FC<ConvexTodoPreviewProps> = ({
  todos,
  onToggleTodo,
  onAddTodo,
  showBlockedHint,
}) => {
  const [inputText, setInputText] = useState('Clean bathroom and kitchen');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAddTodo(inputText);
      setInputText('');
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Work':
        return 'bg-[#512c61] text-[#e9c6f7] border border-[#6b3a80]';
      case 'Chores':
        return 'bg-[#7a541c] text-[#fde4a6] border border-[#966723]';
      default:
        return 'bg-[#2f332a] text-[#c7ccbf] border border-[#3e4438]';
    }
  };

  return (
    <div className="bg-[#181a16] rounded-xl border border-[#2e3128] overflow-hidden flex flex-col relative select-none">
      {/* Toast alert if trying to complete when disabled */}
      {showBlockedHint && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded bg-[#fc618d] text-[#141414] font-bold text-[11px] animate-bounce whitespace-nowrap">
          Nothing happens! Change to &apos;true&apos; in code ↖
        </div>
      )}

      {/* Header Bar */}
      <div className="h-9 bg-[#20231d] border-b border-[#2e3128] px-3.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
        </div>
        <div className="px-4 py-0.5 rounded bg-[#121410] border border-[#282c22] text-[11px] font-mono text-[#8a9082]">
          my-amazing-project.app
        </div>
        <div className="w-6" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="text-[11px] font-mono text-[#787e70] mb-3">
            Last categorized: 0s ago
          </div>

          <div className="space-y-2.5">
            {todos.map((todo) => (
              <div
                key={todo.id}
                onClick={() => onToggleTodo(todo.id)}
                className="flex items-center justify-between py-1 px-1 rounded hover:bg-[#20231d] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                      todo.completed
                        ? 'bg-[#1a73e8] text-white'
                        : 'border border-[#3d4135] group-hover:border-[#69bee2]'
                    }`}
                  >
                    {todo.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-xs font-sans transition-colors ${
                      todo.completed ? 'line-through text-[#6e7467]' : 'text-white'
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${getCategoryBadge(
                    todo.category
                  )}`}
                >
                  {todo.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="mt-4 pt-3 border-t border-[#2a2e24] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-1.5 rounded-lg bg-[#20231d] border border-[#2f332a] text-xs text-white placeholder-[#787e70] focus:outline-none focus:border-[#69bee2]"
          />
          <button
            type="button"
            onClick={() => setInputText('Clean bathroom and kitchen')}
            title="Reset text"
            className="p-1.5 rounded-lg bg-[#20231d] hover:bg-[#282c22] border border-[#2f332a] text-[#8e9385] hover:text-white transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};
