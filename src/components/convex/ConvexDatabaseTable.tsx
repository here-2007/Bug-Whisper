import React from 'react';
import type { ConvexTodo } from '../../hooks/useConvexDemo';

interface ConvexDatabaseTableProps {
  todos: ConvexTodo[];
}

export const ConvexDatabaseTable: React.FC<ConvexDatabaseTableProps> = ({ todos }) => {
  return (
    <div className="p-4 bg-[#141414] flex flex-col justify-between select-none overflow-x-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-[#6d6d70] pb-2 mb-2 border-b border-[#38383a]/60">
        <span className="text-[#a9a9ac]">dashboard.convex.dev</span>
        <span className="text-[11px] text-[#6d6d70]">
          todos Database table with {todos.length} documents
        </span>
      </div>

      {/* Table Content */}
      <div className="w-full text-[11px] font-mono">
        <div className="grid grid-cols-12 text-[#6d6d70] border-b border-[#38383a]/40 pb-1 mb-1.5 font-medium">
          <span className="col-span-2">_id</span>
          <span className="col-span-4">text</span>
          <span className="col-span-2">category</span>
          <span className="col-span-2">completed</span>
          <span className="col-span-2 text-right">_creationTime</span>
        </div>

        <div className="space-y-1">
          {todos.slice(0, 4).map((todo) => (
            <div
              key={todo.id}
              className="grid grid-cols-12 text-[#e5e5e5] items-center py-0.5 hover:bg-[#292929]/40 rounded transition-colors"
            >
              <span className="col-span-2 text-[#6d6d70] truncate">{todo.id}</span>
              <span className="col-span-4 text-white truncate">{todo.text}</span>
              <span className="col-span-2 text-[#948ae3]">'{todo.category}'</span>
              <span
                className={`col-span-2 font-semibold ${
                  todo.completed ? 'text-[#7bd88f]' : 'text-[#fc618d]'
                }`}
              >
                {String(todo.completed)}
              </span>
              <span className="col-span-2 text-right text-[#6d6d70] truncate text-[10px]">
                {todo.creationTime.split(',')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
