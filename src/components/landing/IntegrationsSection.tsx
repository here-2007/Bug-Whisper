import React from 'react';
import {
  Flame,
  Zap,
  CheckCircle2,
  Box,
  Sliders,
  Cpu,
  Layers,
  ExternalLink,
} from 'lucide-react';

const PixelHeart: React.FC = () => (
  <span className="inline-flex items-center mx-2 align-middle">
    <svg width="20" height="16" viewBox="0 0 7 6" className="fill-[#de5d33]">
      <rect x="1" y="0" width="2" height="1" />
      <rect x="4" y="0" width="2" height="1" />
      <rect x="0" y="1" width="7" height="2" />
      <rect x="1" y="3" width="5" height="1" />
      <rect x="2" y="4" width="3" height="1" />
      <rect x="3" y="5" width="1" height="1" />
    </svg>
  </span>
);

const HuggingFaceIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm-3.665-6.61a.584.584 0 0 1-.365-.138c-.378-.303-3.177-2.613-3.177-4.996 0-1.579 1.139-2.73 2.535-2.73 1.094 0 1.954.71 2.316 1.636a2.915 2.915 0 0 1 4.712 0c.362-.927 1.222-1.636 2.316-1.636 1.396 0 2.535 1.15 2.535 2.73 0 2.383-2.8 4.693-3.177 4.996a.579.579 0 0 1-.722 0c-.378-.303-3.178-2.613-3.178-4.996 0-1.579-1.139-2.73-2.534-2.73-1.396 0-2.536 1.15-2.536 2.73 0 2.383 2.799 4.693 3.177 4.996a.576.576 0 0 1 .098.138z" />
  </svg>
);

const TECH_STACK = [
  {
    name: 'Soup',
    category: 'LoRA SFT Engine',
    docsUrl: 'https://github.com/trysoup/soup',
    icon: Layers,
    iconColor: 'text-[#de5d33]',
  },
  {
    name: 'PyTorch',
    category: 'Tensors & CUDA Autograd',
    docsUrl: 'https://pytorch.org/docs/',
    icon: Flame,
    iconColor: 'text-[#ee4c2c]',
  },
  {
    name: 'Transformers',
    category: 'Model Architectures & Tokenizers',
    docsUrl: 'https://huggingface.co/docs/transformers',
    icon: Cpu,
    iconColor: 'text-[#f59e0b]',
  },
  {
    name: 'Hugging Face',
    category: 'TRL & Hub Ecosystem',
    docsUrl: 'https://huggingface.co/docs',
    icon: HuggingFaceIcon,
    iconColor: 'text-[#d97706]',
  },
  {
    name: 'Docker',
    category: 'Containerized Sandboxes',
    docsUrl: 'https://docs.docker.com/',
    icon: Box,
    iconColor: 'text-[#2496ed]',
  },
  {
    name: 'Gradio',
    category: 'Interactive ML Demos',
    docsUrl: 'https://www.gradio.app/docs',
    icon: Sliders,
    iconColor: 'text-[#ea580c]',
  },
  {
    name: 'FastAPI',
    category: 'Inference Engine API',
    docsUrl: 'https://fastapi.tiangolo.com/',
    icon: Zap,
    iconColor: 'text-[#05998b]',
  },
  {
    name: 'Pytest',
    category: 'Deterministic Verification Harness',
    docsUrl: 'https://docs.pytest.org/',
    icon: CheckCircle2,
    iconColor: 'text-[#0a9edc]',
  },
];

export const IntegrationsSection: React.FC = () => {
  return (
    <section className="w-full py-16 lg:py-24 px-6 select-none bg-[#f6f6f6]" id="integrations">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Heading & CTAs */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded border border-[#dfdacd] bg-white w-fit">
            <span className="text-[10px] font-mono uppercase tracking-[0.05em] text-[#63665c] font-semibold">
              TECH STACK
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#141414] tracking-[-0.035em] leading-[1.1]">
            Bug Whisper <PixelHeart /> core tech stack
          </h2>

          <p className="text-sm sm:text-base text-[#55584e] leading-relaxed max-w-lg">
            Engineered with declarative LoRA fine-tuning, PyTorch tensor execution, and deterministic Pytest harnesses to deliver instant, verifiable Python error remediation.
          </p>

          <div className="pt-2">
            <a
              href="#playground"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#20221e] hover:bg-[#2e3129] text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Open Studio ↘
            </a>
          </div>
        </div>

        {/* Right Column: 8 Tech Stack Cards with Docs Redirection */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {TECH_STACK.map((tech) => {
              const Icon = tech.icon;
              return (
                <a
                  key={tech.name}
                  href={tech.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#e5e5e5] hover:border-[#38383a] transition-all cursor-pointer group"
                  title={`Open ${tech.name} documentation`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg bg-[#f6f6f6] border border-[#e5e5e5] flex items-center justify-center shrink-0 ${tech.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-[#141414] group-hover:text-black tracking-tight truncate">
                        {tech.name}
                      </span>
                      <span className="text-[11px] font-mono text-[#8e9385] truncate">
                        {tech.category}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#b0b5a8] group-hover:text-[#141414] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
