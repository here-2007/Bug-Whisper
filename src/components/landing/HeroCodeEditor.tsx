import React from 'react';
import { Sparkles, Check, AlertTriangle } from 'lucide-react';

interface HeroCodeEditorProps {
  isPatched: boolean;
  onTogglePatch: () => void;
}

export const HeroCodeEditor: React.FC<HeroCodeEditorProps> = ({ isPatched, onTogglePatch }) => {
  return (
    <div className="flex-1 bg-[#141414] rounded-xl border border-[#38383a] overflow-hidden flex flex-col font-mono text-[12px] sm:text-[13px] leading-[1.5] select-text relative">
      {/* Editor Header Bar with Traffic Dots & Tabs */}
      <div className="h-9 bg-[#20231d] border-b border-[#2e3128] px-3.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fc618d]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f8e67a]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#7bd88f]" />
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141414] border border-[#2e3128] text-white">
            <span className="px-1 py-0.2 rounded bg-[#3776ab] text-[9px] font-bold text-[#ffd43b]">PY</span>
            <span className="text-xs font-mono text-[#d6dad0]">pipeline.py</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[#83887a] hover:text-[#b8bcb0] transition-colors cursor-pointer">
            <span className="px-1 py-0.2 rounded bg-[#1f6b78] text-[9px] font-bold text-white">PY</span>
            <span className="text-xs font-mono">models.py</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onTogglePatch}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-sans font-medium transition-all cursor-pointer ${
            isPatched
              ? 'bg-[#1c3524] text-[#86e39d] border border-[#295434]'
              : 'bg-[#fc618d]/20 text-[#fc618d] border border-[#fc618d]/40 hover:bg-[#fc618d]/30'
          }`}
        >
          {isPatched ? (
            <>
              <Check className="w-3 h-3 text-[#7bd88f]" />
              <span>Patched (Reset)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-[#fc618d]" />
              <span>Try fix (3B Synth)</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Body */}
      <div className="p-4 sm:p-5 relative overflow-x-auto text-[#d6dad0] min-h-[380px]">
        <div className="space-y-[2px]">
          <div className="flex items-center">
            <span className="w-7 text-right pr-3 select-none text-[#64685b] shrink-0">1</span>
            <span className="pl-1"><span className="text-[#e26d9b]">from</span> typing <span className="text-[#e26d9b]">import</span> List, Dict, Optional</span>
          </div>
          <div className="flex items-center">
            <span className="w-7 text-right pr-3 select-none text-[#64685b] shrink-0">2</span>
            <span className="pl-1"><span className="text-[#e26d9b]">import</span> time</span>
          </div>
          <div className="flex items-center">
            <span className="w-7 text-right pr-3 select-none text-[#64685b] shrink-0">3</span>
          </div>
          <div className="flex items-center">
            <span className="w-7 text-right pr-3 select-none text-[#64685b] shrink-0">4</span>
            <span className="pl-1"><span className="text-[#e26d9b]">def</span> <span className="text-[#69bee2]">calculate_batch_rate</span>(items: List[dict], elapsed_seconds: float) -&gt; float:</span>
          </div>
          <div className="flex items-center">
            <span className="w-7 text-right pr-3 select-none text-[#64685b] shrink-0">5</span>
            <span className="pl-7 text-[#d89f72]">&quot;&quot;&quot;Calculate throughput items/second over elapsed window.&quot;&quot;&quot;</span>
          </div>
          <div className="flex items-center">
            <span className="w-7 text-right pr-3 select-none text-[#64685b] shrink-0">6</span>
            <span className="pl-7 text-[#7d8274]"># Evaluating with elapsed_seconds=0 raises ZeroDivisionError</span>
          </div>
          <div className="flex items-center">
            <span className="w-7 text-right pr-3 select-none text-[#64685b] shrink-0">7</span>
            <span className="pl-7 text-[#7d8274]"># Synthesized deterministic guard below:</span>
          </div>

          {isPatched ? (
            <>
              <div onClick={onTogglePatch} className="flex items-center py-0.5 rounded bg-[#7bd88f]/10 text-[#7bd88f] cursor-pointer hover:bg-[#7bd88f]/20 transition-colors">
                <span className="w-7 text-right pr-3 select-none text-[#7bd88f]/70 shrink-0 font-bold">8</span>
                <span className="pl-7 font-bold text-[#7bd88f] flex items-center gap-2">
                  <span>if elapsed_seconds &lt;= 0:</span>
                  <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-[#7bd88f]/20 text-[#7bd88f] border border-[#7bd88f]/40">+guard</span>
                </span>
              </div>
              <div className="flex items-center py-0.5 bg-[#7bd88f]/10 text-[#7bd88f]">
                <span className="w-7 text-right pr-3 select-none text-[#7bd88f]/70 shrink-0 font-bold">9</span>
                <span className="pl-12"><span className="text-[#e26d9b]">return</span> <span className="text-[#69bee2]">0.0</span></span>
              </div>
            </>
          ) : (
            <div onClick={onTogglePatch} className="flex items-center py-0.5 rounded bg-[#fc618d]/15 text-[#fc618d] cursor-pointer hover:bg-[#fc618d]/25 transition-colors group">
              <span className="w-7 text-right pr-3 select-none text-[#fc618d]/70 shrink-0 font-bold">8</span>
              <span className="pl-7 font-bold flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#fc618d]" />
                <span className="underline decoration-dotted"># [Bug Whisper Warning: unguarded division below]</span>
                <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-white text-[#141414] group-hover:scale-105 transition-transform">Fix ↗</span>
              </span>
            </div>
          )}

          <div className="flex items-center">
            <span className="w-7 text-right pr-3 select-none text-[#64685b] shrink-0">{isPatched ? '10' : '9'}</span>
            <span className="pl-7"><span className="text-[#e26d9b]">return</span> round(len(items) / elapsed_seconds, <span className="text-[#69bee2]">2</span>)</span>
          </div>
          <div className="flex items-center">
            <span className="w-7 text-right pr-3 select-none text-[#64685b] shrink-0">{isPatched ? '11' : '10'}</span>
          </div>
          <div className="flex items-center">
            <span className="w-7 text-right pr-3 select-none text-[#64685b] shrink-0">12</span>
            <span className="pl-1 flex items-center gap-1.5 text-[#8e9385]">
              <span className="text-[#e26d9b]">def</span> <span className="text-[#69bee2]">process_queue</span>(queue_id: str) -&gt; <span className="text-[#a599e9]">None</span>:
              <span className="px-1.5 py-0.2 rounded bg-[#2e3128] text-[10px] text-[#8e9385]">...</span>
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-7 text-right pr-3 select-none text-[#64685b] shrink-0">18</span>
            <span className="pl-1 flex items-center gap-1.5 text-[#8e9385]">
              <span className="text-[#e26d9b]">def</span> <span className="text-[#69bee2]">handle_exception</span>(exc: Exception) -&gt; dict:
              <span className="px-1.5 py-0.2 rounded bg-[#2e3128] text-[10px] text-[#8e9385]">...</span>
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-7 text-right pr-3 select-none text-[#64685b] shrink-0">25</span>
            <span className="pl-1 flex items-center gap-1.5 text-[#8e9385]">
              <span className="text-[#e26d9b]">def</span> <span className="text-[#69bee2]">verify_traceback</span>(tb: str) -&gt; bool:
              <span className="px-1.5 py-0.2 rounded bg-[#2e3128] text-[10px] text-[#8e9385]">...</span>
            </span>
          </div>
        </div>

        <div
          className="mt-6 h-20 rounded border border-[#262822] pointer-events-none opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.05) 10px, rgba(255, 255, 255, 0.05) 20px)',
          }}
        />
      </div>
    </div>
  );
};
