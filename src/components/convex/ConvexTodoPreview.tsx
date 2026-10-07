import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';
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

  return (
    <div className="p-4 bg-[#141414] border-b border-[#38383a] flex flex-col justify-between relative select-none">
      
      {/* Blocked Hint Floating Toast */}
      {showBlockedHint && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-lg bg-[#fc618d] text-[#141414] font-bold text-xs shadow-lg animate-bounce">
          Nothing happens! Change to &apos;true&apos; in code ↗
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-[#6d6d70] pb-2 border-b border-[#38383a]/60">
        <span className="text-[#a9a9ac]">my-streaming-project.convex</span>
        <span>Last sync: just now</span>
      </div>

      {/* Todo List Items */}
      <div className="py-3 space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            onClick={() => onToggleTodo(todo.id)}
            className="flex items-center gap-2.5 text-xs font-sans text-[#e5e5e5] cursor-pointer hover:text-white transition-colors"
          >
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                todo.completed
                  ? 'bg-[#69bee2] border-[#69bee2] text-[#141414]'
                  : 'border-[#4f4f52] bg-transparent'
              }`}
            >
              {todo.completed && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className={todo.completed ? 'line-through text-[#6d6d70]' : ''}>
              {todo.text}
            </span>
          </div>
        ))}
      </div>

      {/* Add Todo Input Row */}
      <form onSubmit={handleSubmit} className="mt-2 pt-2 border-t border-[#38383a]/60 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="New task..."
          className="flex-1 px-2.5 py-1.5 rounded bg-[#292929] border border-[#38383a] text-xs text-white placeholder-[#6d6d70] focus:outline-none focus:border-[#69bee2]"
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
