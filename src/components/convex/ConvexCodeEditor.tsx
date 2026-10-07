import React from 'react';

interface ConvexCodeEditorProps {
  isPatched: boolean;
  onTogglePatch: () => void;
}

export const ConvexCodeEditor: React.FC<ConvexCodeEditorProps> = ({
  isPatched,
  onTogglePatch,
}) => {
  return (
    <div className="flex-1 bg-[#181a16] rounded-xl border border-[#2e3128] overflow-hidden flex flex-col font-mono text-[12px] sm:text-[13px] leading-[1.45] select-text relative">
      {/* Editor Header Bar with Traffic Dots & Tabs */}
      <div className="h-9 bg-[#20231d] border-b border-[#2e3128] px-3.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          {/* Traffic Dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3d4135]" />
          </div>

          {/* Active Tab */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181a16] border border-[#2e3128] text-white">
            <span className="px-1 py-0.2 rounded bg-[#3776ab] text-[9px] font-bold text-[#ffd43b]">PY</span>
            <span className="text-xs font-mono text-[#d6dad0]">pipeline.py</span>
          </div>

          {/* Inactive Tab */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[#83887a] hover:text-[#b8bcb0] transition-colors cursor-pointer">
            <span className="px-1 py-0.2 rounded bg-[#1f6b78] text-[9px] font-bold text-white">PY</span>
            <span className="text-xs font-mono">models.py</span>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div className="p-4 sm:p-5 relative overflow-x-auto text-[#d6dad0] min-h-[380px]">
        {/* Floating "Try it out!" Badge */}
        <button
          type="button"
          onClick={onTogglePatch}
          aria-label="Toggle Python bug fix patch"
          className="absolute left-1 sm:left-2 top-[164px] sm:top-[168px] z-20 flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-neutral-100 text-[#141414] font-sans font-bold text-xs rounded-full cursor-pointer transition-transform active:scale-95 border border-white"
        >
          <span>Try it out!</span>
          <span className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-[#141414] ml-0.5" />
        </button>

        {/* Python Code Lines */}
        <div className="space-y-[2px]">
          <div><span className="text-[#64685b] select-none inline-block w-6"> 1</span> <span className="text-[#e26d9b]">from</span> typing <span className="text-[#e26d9b]">import</span> List, Dict, Optional</div>
          <div><span className="text-[#64685b] select-none inline-block w-6"> 2</span> <span className="text-[#e26d9b]">import</span> time</div>
          <div><span className="text-[#64685b] select-none inline-block w-6"> 3</span></div>
          <div><span className="text-[#64685b] select-none inline-block w-6"> 4</span><span className="text-[#888d80] select-none mr-1">˅</span><span className="text-[#e26d9b]">def</span> <span className="text-[#69bee2]">calculate_batch_rate</span>(items: List[dict], elapsed_seconds: float) -&gt; float:</div>
          <div><span className="text-[#64685b] select-none inline-block w-6"> 5</span>     <span className="text-[#d89f72]">&quot;&quot;&quot;Calculate throughput items/second over elapsed window.&quot;&quot;&quot;</span></div>
          <div><span className="text-[#64685b] select-none inline-block w-6"> 6</span><span className="text-[#888d80] select-none mr-1">˅</span>    <span className="text-[#7d8274]"># Try evaluating with elapsed_seconds=0 -- ZeroDivisionError!</span></div>
          <div><span className="text-[#64685b] select-none inline-block w-6"> 7</span>     <span className="text-[#7d8274]"># Click &apos;Try it out!&apos; to synthesize minimal deterministic guard:</span></div>
          
          {/* Interactive Line 8 & 9 */}
          {isPatched ? (
            <>
              <div
                onClick={onTogglePatch}
                className="cursor-pointer inline-flex items-center px-1.5 py-0.5 rounded bg-[#7bd88f]/20 text-[#7bd88f] transition-colors"
              >
                <span className="text-[#64685b] select-none inline-block w-6 text-left"> 8</span>
                <span className="ml-4 font-bold text-[#7bd88f]">if elapsed_seconds &lt;= 0:</span>
              </div>
              <div><span className="text-[#64685b] select-none inline-block w-6"> 9</span>         <span className="text-[#e26d9b]">return</span> <span className="text-[#69bee2]">0.0</span></div>
            </>
          ) : (
            <div
              onClick={onTogglePatch}
              className="cursor-pointer inline-flex items-center px-1.5 py-0.5 rounded bg-[#e26d9b]/20 text-[#e26d9b] transition-colors"
            >
              <span className="text-[#64685b] select-none inline-block w-6 text-left"> 8</span>
              <span className="ml-4 font-bold underline decoration-dotted text-[#e26d9b]"># [Bug Whisper Warning: unguarded division below]</span>
            </div>
          )}

          <div><span className="text-[#64685b] select-none inline-block w-6">10</span>     <span className="text-[#e26d9b]">return</span> round(len(items) / elapsed_seconds, <span className="text-[#69bee2]">2</span>)</div>
          <div><span className="text-[#64685b] select-none inline-block w-6">11</span></div>
          <div><span className="text-[#64685b] select-none inline-block w-6">12</span></div>
          <div><span className="text-[#64685b] select-none inline-block w-6">15</span><span className="text-[#888d80] select-none mr-1">&gt;</span><span className="text-[#e26d9b]">def</span> <span className="text-[#69bee2]">process_queue</span>(queue_id: str) -&gt; <span className="text-[#a599e9]">None</span>: <span className="px-1 py-0.5 rounded bg-[#2e3128] text-[10px] text-[#8e9385]">...</span></div>
          <div><span className="text-[#64685b] select-none inline-block w-6">21</span></div>
          <div><span className="text-[#64685b] select-none inline-block w-6">22</span><span className="text-[#888d80] select-none mr-1">&gt;</span><span className="text-[#e26d9b]">def</span> <span className="text-[#69bee2]">handle_exception</span>(exc: Exception) -&gt; dict: <span className="px-1 py-0.5 rounded bg-[#2e3128] text-[10px] text-[#8e9385]">...</span></div>
          <div><span className="text-[#64685b] select-none inline-block w-6">33</span></div>
          <div><span className="text-[#64685b] select-none inline-block w-6">34</span><span className="text-[#888d80] select-none mr-1">&gt;</span><span className="text-[#e26d9b]">def</span> <span className="text-[#69bee2]">verify_traceback</span>(tb: str) -&gt; bool: <span className="px-1 py-0.5 rounded bg-[#2e3128] text-[10px] text-[#8e9385]">...</span></div>
          <div><span className="text-[#64685b] select-none inline-block w-6">40</span></div>
        </div>

        {/* Diagonal Hatch Pattern at the bottom */}
        <div
          className="mt-6 h-28 rounded border border-[#262822] pointer-events-none opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.05) 10px, rgba(255, 255, 255, 0.05) 20px)',
          }}
        />
      </div>
    </div>
  );
};
