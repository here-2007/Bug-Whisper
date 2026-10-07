import React from 'react';
import type { ConvexTodo } from '../../hooks/useConvexDemo';

interface ConvexDatabaseTableProps {
  todos: ConvexTodo[];
}

export const ConvexDatabaseTable: React.FC<ConvexDatabaseTableProps> = ({ todos }) => {
  return (
    <div className="bg-[#181a16] rounded-xl border border-[#2e3128] overflow-hidden flex flex-col select-none">
      {/* Header Bar with Convex Logo */}
      <div className="h-9 bg-[#20231d] border-b border-[#2e3128] px-3.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-0.5 rounded bg-[#121410] border border-[#282c22] text-[11px] font-mono text-[#8a9082]">
          <span className="w-2 h-2 rounded-full bg-[#de5d33]" />
          <span>dashboard.convex.dev</span>
        </div>
        <div className="w-6" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Table Description */}
        <div className="flex items-baseline gap-2 mb-3 font-mono">
          <span className="text-xs font-bold text-white">todos</span>
          <span className="text-[11px] text-[#787e70]">
            database table with {todos.length} documents
          </span>
        </div>

        {/* Table View */}
        <div className="w-full text-[11px] font-mono overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-12 text-[#64685b] pb-2 border-b border-[#282c22] font-medium">
            <span className="col-span-3">_id</span>
            <span className="col-span-3">text</span>
            <span className="col-span-2">category</span>
            <span className="col-span-2">completed</span>
            <span className="col-span-2 text-right">_creationTime</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#23261f]">
            {todos.slice(0, 3).map((todo, idx) => (
              <div
                key={todo.id}
                className="grid grid-cols-12 items-center py-2 text-[#d6dad0] hover:bg-[#1f221c] transition-colors"
              >
                <span className="col-span-3 text-[#787e70] truncate">{todo.shortId}</span>
                <span className="col-span-3 text-white truncate">&quot;{todo.text.slice(0, 7)}...&quot;</span>
                <span className="col-span-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      idx === 0
                        ? 'border border-[#386c47] bg-[#172c1c] text-[#80dc96]'
                        : 'text-[#8a9082]'
                    }`}
                  >
                    &quot;{todo.category}&quot;
                  </span>
                </span>
                <span
                  className={`col-span-2 font-semibold ${
                    todo.completed ? 'text-[#7bd88f]' : 'text-[#8a9082]'
                  }`}
                >
                  {String(todo.completed)}
                </span>
                <span className="col-span-2 text-right text-[#64685b] truncate">
                  4/30/202...
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
