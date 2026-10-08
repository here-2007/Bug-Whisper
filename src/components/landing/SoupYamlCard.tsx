import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

const SOUP_YAML_CONTENT = `# soup.yaml — Bug Whisper LoRA Fine-Tuning Recipe
base_model: "unsloth/Qwen2.5-Coder-3B-Instruct-bnb-4bit"
task: "sft"
backend: "unsloth"

lora:
  r: 16
  alpha: 32
  dropout: 0.0
  target_modules: ["q_proj", "k_proj", "v_proj", "o_proj"]

training:
  dataset: "pernavjain/python-errors" # 9,340 filtered commits
  epochs: 1                            # 584 steps (prevents forgetting)
  batch_size: 8
  gradient_accumulation_steps: 2       # Effective batch size = 16
  learning_rate: 2e-4
  lr_scheduler_type: "cosine"
  warmup_ratio: 0.05
  train_on_responses_only: true        # Loss masked to code fixes
  max_seq_length: 768

export:
  format: "safetensors"
  output_dir: "./bug-whisper-lora"     # Compact 29.5MB adapter`;

export const SoupYamlCard: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SOUP_YAML_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-xl bg-[#141414] border border-[#38383a] overflow-hidden flex flex-col font-mono text-xs select-text">
      {/* 32px Tab Header Bar with Traffic Lights */}
      <div className="h-[32px] min-h-[32px] bg-[#292929] border-b border-[#38383a] px-3.5 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fc618d]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f8e67a]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#7bd88f]" />
          </div>
          <div className="flex items-center gap-1.5 ml-2 text-[#a0a599] text-[11px]">
            <Terminal className="w-3 h-3 text-[#de5d33]" />
            <span>soup.yaml</span>
            <span className="text-[10px] text-[#63685b] hidden sm:inline">· SFT Recipe</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-[#8e9385] hover:text-white px-2 py-0.5 rounded bg-[#1e201b] border border-[#383c31] hover:border-[#4d5343] transition-colors cursor-pointer"
          title="Copy soup.yaml"
        >
          {copied ? <Check className="w-3 h-3 text-[#7bd88f]" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Editor Body */}
      <div className="p-4 sm:p-5 overflow-x-auto text-[12px] sm:text-[13px] leading-[1.5] text-[#d6dad0] bg-[#141414] [scrollbar-width:thin]">
        <pre className="font-mono">
          <code>
            <span className="text-[#64685b]"># soup.yaml — Bug Whisper LoRA Fine-Tuning Recipe</span>{'\n'}
            <span className="text-[#9cdcfe]">base_model</span>: <span className="text-[#ce9178]">&quot;unsloth/Qwen2.5-Coder-3B-Instruct-bnb-4bit&quot;</span>{'\n'}
            <span className="text-[#9cdcfe]">task</span>: <span className="text-[#ce9178]">&quot;sft&quot;</span>{'\n'}
            <span className="text-[#9cdcfe]">backend</span>: <span className="text-[#ce9178]">&quot;unsloth&quot;</span>{'\n\n'}
            <span className="text-[#4ec9b0]">lora</span>:{'\n'}
            {'  '}<span className="text-[#9cdcfe]">r</span>: <span className="text-[#b5cea8]">16</span>{'\n'}
            {'  '}<span className="text-[#9cdcfe]">alpha</span>: <span className="text-[#b5cea8]">32</span>{'\n'}
            {'  '}<span className="text-[#9cdcfe]">dropout</span>: <span className="text-[#b5cea8]">0.0</span> <span className="text-[#64685b]"># preserves fused CUDA kernels</span>{'\n'}
            {'  '}<span className="text-[#9cdcfe]">target_modules</span>: [<span className="text-[#ce9178]">&quot;q_proj&quot;</span>, <span className="text-[#ce9178]">&quot;k_proj&quot;</span>, <span className="text-[#ce9178]">&quot;v_proj&quot;</span>, <span className="text-[#ce9178]">&quot;o_proj&quot;</span>]{'\n\n'}
            <span className="text-[#4ec9b0]">training</span>:{'\n'}
            {'  '}<span className="text-[#9cdcfe]">dataset</span>: <span className="text-[#ce9178]">&quot;pernavjain/python-errors&quot;</span> <span className="text-[#64685b]"># 9,340 filtered commits</span>{'\n'}
            {'  '}<span className="text-[#9cdcfe]">epochs</span>: <span className="text-[#b5cea8]">1</span> <span className="text-[#64685b]"># 584 steps (prevents forgetting)</span>{'\n'}
            {'  '}<span className="text-[#9cdcfe]">batch_size</span>: <span className="text-[#b5cea8]">8</span>{'\n'}
            {'  '}<span className="text-[#9cdcfe]">gradient_accumulation_steps</span>: <span className="text-[#b5cea8]">2</span> <span className="text-[#64685b]"># Effective batch size = 16</span>{'\n'}
            {'  '}<span className="text-[#9cdcfe]">learning_rate</span>: <span className="text-[#b5cea8]">2e-4</span>{'\n'}
            {'  '}<span className="text-[#9cdcfe]">lr_scheduler_type</span>: <span className="text-[#ce9178]">&quot;cosine&quot;</span>{'\n'}
            {'  '}<span className="text-[#9cdcfe]">train_on_responses_only</span>: <span className="text-[#569cd6]">true</span> <span className="text-[#64685b]"># mask prompt loss</span>{'\n'}
            {'  '}<span className="text-[#9cdcfe]">max_seq_length</span>: <span className="text-[#b5cea8]">768</span>{'\n\n'}
            <span className="text-[#4ec9b0]">export</span>:{'\n'}
            {'  '}<span className="text-[#9cdcfe]">format</span>: <span className="text-[#ce9178]">&quot;safetensors&quot;</span>{'\n'}
            {'  '}<span className="text-[#9cdcfe]">output_dir</span>: <span className="text-[#ce9178]">&quot;./bug-whisper-lora&quot;</span> <span className="text-[#64685b]"># ~29.5MB adapter</span>
          </code>
        </pre>
      </div>
    </div>
  );
};
