import React from 'react';
import { ConvexCodeEditor } from './ConvexCodeEditor';
import { ConvexTodoPreview } from './ConvexTodoPreview';
import { ConvexDatabaseTable } from './ConvexDatabaseTable';
import { useConvexDemo } from '../../hooks/useConvexDemo';

export const ConvexHeroWorkbench: React.FC = () => {
  const {
    isPatched,
    togglePatched,
    todos,
    toggleTodo,
    addTodo,
    showBlockedHint,
  } = useConvexDemo();

  return (
    <div className="w-full rounded-2xl bg-[#141414] border border-[#38383a] overflow-hidden select-none">
      {/* Workbench Tab Header with Traffic Light Dots */}
      <div className="h-10 bg-[#292929] border-b border-[#38383a] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#fc618d]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#f8e67a]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#7bd88f]" />
          <div className="ml-3 px-3 py-1 rounded-t-md bg-[#141414] text-xs font-mono text-[#e5e5e5] border-t border-x border-[#38383a]">
            my-streaming-project.convex
          </div>
        </div>
        <div className="text-[11px] font-mono text-[#6d6d70]">
          TypeScript 5.4 · Realtime
        </div>
      </div>

      {/* Grid Interior: Left Code Editor / Right Stacked Preview & DB Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left Sub-panel: Code Editor */}
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-[#38383a] flex flex-col">
          <ConvexCodeEditor
            isPatched={isPatched}
            onTogglePatch={togglePatched}
          />
        </div>

        {/* Right Sub-panel: Stacked Todo App + Database Table */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#141414]">
          <ConvexTodoPreview
            todos={todos}
            onToggleTodo={toggleTodo}
            onAddTodo={addTodo}
            showBlockedHint={showBlockedHint}
          />
          <ConvexDatabaseTable todos={todos} />
        </div>
      </div>
    </div>
  );
};
