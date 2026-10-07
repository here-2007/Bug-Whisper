import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ConvexCodeEditorProps {
  isPatched: boolean;
  onTogglePatch: () => void;
}

export const ConvexCodeEditor: React.FC<ConvexCodeEditorProps> = ({
  isPatched,
  onTogglePatch,
}) => {
  return (
    <div className="flex-1 p-5 font-mono text-[13px] leading-[1.45] text-[#d7d7d7] bg-[#141414] relative select-text overflow-x-auto">
      
      {/* Floating "Try it out" Callout pointing to Line 10 */}
      <button
        type="button"
        onClick={onTogglePatch}
        className="absolute left-2 sm:left-4 top-[170px] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffffff] border border-[#e5e5e5] text-[#141414] text-[11px] font-sans font-bold z-20 cursor-pointer hover:bg-[#f6f6f6] transition-transform active:scale-95"
        title="Click to toggle if (false) / if (true)"
      >
        <span className="w-2 h-2 rounded-full bg-[#fc618d] animate-ping" />
        <span>Try it out</span>
        <ArrowRight className="w-3 h-3 text-[#141414]" />
      </button>

      <div className="space-y-0.5">
        <div><span className="text-[#6d6d70] select-none mr-4"> 1</span><span className="text-[#fc618d]">import</span> &#123; <span className="text-[#948ae3]">mutation</span>, <span className="text-[#948ae3]">query</span> &#125; <span className="text-[#fc618d]">from</span> <span className="text-[#e3d0df]">"./_generated/server"</span>;</div>
        <div><span className="text-[#6d6d70] select-none mr-4"> 2</span><span className="text-[#fc618d]">import</span> &#123; <span className="text-[#948ae3]">v</span> &#125; <span className="text-[#fc618d]">from</span> <span className="text-[#e3d0df]">"convex/values"</span>;</div>
        <div><span className="text-[#6d6d70] select-none mr-4"> 3</span></div>
        <div><span className="text-[#6d6d70] select-none mr-4"> 4</span><span className="text-[#fc618d]">export const</span> <span className="text-[#f8e67a]">setCompleted</span> = <span className="text-[#948ae3]">mutation</span>(&#123;</div>
        <div><span className="text-[#6d6d70] select-none mr-4"> 5</span>  args: &#123; id: <span className="text-[#948ae3]">v</span>.id(<span className="text-[#e3d0df]">"todos"</span>), completed: <span className="text-[#948ae3]">v</span>.boolean() &#125;,</div>
        <div><span className="text-[#6d6d70] select-none mr-4"> 6</span>  handler: <span className="text-[#fc618d]">async</span> (ctx, args) =&gt; &#123;</div>
        <div><span className="text-[#6d6d70] select-none mr-4"> 7</span>    <span className="text-[#6d6d70]">// Try checking a todo—nothing happens!</span></div>
        <div><span className="text-[#6d6d70] select-none mr-4"> 8</span>    <span className="text-[#6d6d70]">// Change this to 'true' and try again.</span></div>
        
        {/* Line 9: The interactive editable condition */}
        <div
          onClick={onTogglePatch}
          className={`py-0.5 px-2 rounded cursor-pointer transition-colors ${
            isPatched
              ? 'bg-[#7bd88f]/20 border border-[#7bd88f]/40'
              : 'bg-[#fc618d]/20 border border-[#fc618d]/40'
          }`}
          title="Click to toggle code execution"
        >
          <span className="text-[#6d6d70] select-none mr-3"> 9</span>
          <span className="text-[#fc618d]">if</span> (
          <span className={`font-bold underline decoration-dotted ${isPatched ? 'text-[#7bd88f]' : 'text-[#fc618d]'}`}>
            {isPatched ? 'true' : 'false'}
          </span>
          ) &#123;
        </div>

        <div><span className="text-[#6d6d70] select-none mr-4">10</span>      <span className="text-[#fc618d]">await</span> ctx.db.patch(args.id, &#123; completed: args.completed &#125;);</div>
        <div><span className="text-[#6d6d70] select-none mr-4">11</span>    &#125;</div>
        <div><span className="text-[#6d6d70] select-none mr-4">12</span>  &#125;,</div>
        <div><span className="text-[#6d6d70] select-none mr-4">13</span>&#125;);</div>
        <div><span className="text-[#6d6d70] select-none mr-4">14</span></div>
        <div><span className="text-[#6d6d70] select-none mr-4">15</span><span className="text-[#fc618d]">export const</span> <span className="text-[#f8e67a]">list</span> = <span className="text-[#948ae3]">query</span>(&#123;</div>
        <div><span className="text-[#6d6d70] select-none mr-4">16</span>  handler: <span className="text-[#fc618d]">async</span> (ctx) =&gt; &#123;</div>
        <div><span className="text-[#6d6d70] select-none mr-4">17</span>    <span className="text-[#fc618d]">return await</span> ctx.db.query(<span className="text-[#e3d0df]">"todos"</span>).collect();</div>
        <div><span className="text-[#6d6d70] select-none mr-4">18</span>  &#125;,</div>
        <div><span className="text-[#6d6d70] select-none mr-4">19</span>&#125;);</div>
      </div>
    </div>
  );
};
