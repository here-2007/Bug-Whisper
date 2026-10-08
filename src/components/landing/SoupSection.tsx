import React from 'react';
import { Layers, Cpu, Sparkles, ExternalLink, ArrowRight, Zap } from 'lucide-react';
import { SoupYamlCard } from './SoupYamlCard';

const STATS = [
  { label: 'Trainable Params', value: '14.7M (0.48%)' },
  { label: 'Real Error Commits', value: '9,340 pairs' },
  { label: 'VRAM Footprint', value: '1.9 GB (4-bit)' },
  { label: 'Training Steps', value: '584 steps (1 ep)' },
  { label: 'LoRA Adapter Size', value: '29.5 MB' },
  { label: 'Inference Latency', value: '< 200ms' },
];

const HIGHLIGHTS = [
  {
    step: '01',
    title: 'Declarative soup.yaml',
    desc: 'Eliminates hundreds of lines of PyTorch and TRL boilerplate. LoRA rank, alpha, and targets declared in one structured recipe.',
    icon: Layers,
  },
  {
    step: '02',
    title: 'Response-Only Loss Masking',
    desc: 'Loss is computed strictly on corrected Python code fences, preserving base model prompt comprehension and zero-shot reasoning.',
    icon: Sparkles,
  },
  {
    step: '03',
    title: 'Unsloth Fast Backend',
    desc: 'Leverages fused Triton and CUDA kernels with zero dropout for 2–5x training speedups on consumer GPUs without OOM crashes.',
    icon: Zap,
  },
];

export const SoupSection: React.FC = () => {
  return (
    <section id="soup" className="w-full px-3 sm:px-6 py-16 select-none bg-[#f6f6f6] border-b border-[#e5e5e5]">
      {/* Eyebrow & Title */}
      <div className="max-w-[1460px] mx-auto flex flex-col items-center text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded border border-[#dfdacd] bg-white mb-3">
          <Cpu className="w-3 h-3 text-[#de5d33]" />
          <span className="text-[10px] font-mono uppercase tracking-[0.05em] text-[#63665c] font-semibold">
            FINE-TUNING ENGINE · SOUP-CLI
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#141414] tracking-[-0.035em]">
          Trained with Soup: Fast, Declarative LoRA
        </h2>

        <p className="mt-2 text-sm sm:text-base text-[#55584e] max-w-2xl font-normal leading-relaxed">
          How Bug Whisper used <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#eae7dc] text-[#141414]">soup-cli</code> with Unsloth and Hugging Face TRL to fine-tune Qwen 2.5 Coder 3B on 9,340 real git error-traceback pairs with zero fluff.
        </p>

        {/* Metric Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-4xl">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#e5e5e5] flex items-center gap-2 text-xs font-mono"
            >
              <span className="text-[#8e9385] text-[11px]">{s.label}:</span>
              <span className="font-bold text-[#141414]">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Left explanation & Right soup.yaml code card */}
      <div className="max-w-[1460px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Why Soup in Bug Whisper */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="p-6 sm:p-7 rounded-xl bg-white border border-[#e5e5e5] flex flex-col justify-between h-full gap-5">
            <div className="flex flex-col gap-3">
              <h3 className="text-base sm:text-lg font-bold text-[#141414] tracking-tight">
                Why Bug Whisper Built on Soup
              </h3>
              <p className="text-xs sm:text-[13px] text-[#55584e] leading-relaxed">
                Fine-tuning small code models often requires complex multi-node harnesses or verbose Hugging Face scripts. <span className="font-semibold text-[#141414]">Soup</span> streamlines the entire SFT workflow into an open-source, reproducible command-line tool.
              </p>
            </div>

            {/* Architectural Pillars */}
            <div className="space-y-3 py-3 border-y border-[#f0eee6] text-xs text-[#55584e]">
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#de5d33] mt-1.5 shrink-0" />
                <span><strong className="text-[#141414]">Single Config:</strong> Defined model, dataset, hyperparameters, and target projection layers (<code className="font-mono text-[11px]">q, k, v, o</code>) in a single YAML file.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7bd88f] mt-1.5 shrink-0" />
                <span><strong className="text-[#141414]">Zero Memory Spikes:</strong> Layer streaming and 4-bit NF4 base quantization enabled training on standard consumer GPUs with zero OOM errors.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f8e67a] mt-1.5 shrink-0" />
                <span><strong className="text-[#141414]">Response-Only Masking:</strong> Gradient loss isolates diff patches (<code className="font-mono text-[11px]">train_on_responses_only: true</code>), eliminating conversational hallucination.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] mt-1.5 shrink-0" />
                <span><strong className="text-[#141414]">Portable 29.5MB Output:</strong> Exported clean safetensors weights ready for instant deployment in Ollama, Kaggle, or serverless workers.</span>
              </div>
            </div>

            {/* Telemetry / Training Spec Mini-Grid */}
            <div className="p-3.5 rounded-lg bg-[#fbfbfa] border border-[#ebe8df] grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div>
                <div className="text-[10px] text-[#8e9385] uppercase tracking-wider">Hardware</div>
                <div className="font-semibold text-[#141414] text-[11px] mt-0.5">1x Tesla T4</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8e9385] uppercase tracking-wider">Train Duration</div>
                <div className="font-semibold text-[#141414] text-[11px] mt-0.5">14.2 min</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8e9385] uppercase tracking-wider">Eval Loss</div>
                <div className="font-semibold text-[#141414] text-[11px] mt-0.5">0.412 <span className="text-[#7bd88f] text-[10px]">(-68%)</span></div>
              </div>
              <div>
                <div className="text-[10px] text-[#8e9385] uppercase tracking-wider">Context Window</div>
                <div className="font-semibold text-[#141414] text-[11px] mt-0.5">768 tokens</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8e9385] uppercase tracking-wider">Quantization</div>
                <div className="font-semibold text-[#141414] text-[11px] mt-0.5">4-bit NF4</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8e9385] uppercase tracking-wider">Effective Batch</div>
                <div className="font-semibold text-[#141414] text-[11px] mt-0.5">16 (8 x 2 ga)</div>
              </div>
            </div>

            {/* Links */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <a
                href="https://www.kaggle.com/models/pernavjain/bug-whisper-qwen25-coder-3b"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#20221e] hover:bg-[#2e3129] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Kaggle Weights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com/MakazhanAlpamys/Soup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-50 border border-[#dfdacd] text-xs font-medium text-[#141414] transition-colors"
              >
                <span>soup-cli GitHub</span>
                <ExternalLink className="w-3 h-3 text-[#8e9385]" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: soup.yaml Code Card */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <SoupYamlCard />
        </div>
      </div>

      {/* 3 Pipeline Cards */}
      <div className="max-w-[1460px] mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {HIGHLIGHTS.map((h) => {
          const Icon = h.icon;
          return (
            <div
              key={h.step}
              className="p-5 rounded-xl bg-white border border-[#e5e5e5] flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-lg bg-[#f6f6f6] border border-[#e5e5e5] flex items-center justify-center text-[#de5d33]">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono font-bold text-[#8e9385]">{h.step}</span>
              </div>
              <h4 className="text-sm font-bold text-[#141414]">{h.title}</h4>
              <p className="text-xs text-[#55584e] leading-relaxed">{h.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
