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
    <path d="M12.025 1.13c-5.77 0-10.449 4.647-10.449 10.378 0 1.112.178 2.181.503 3.185.064-.222.203-.444.416-.577a.96.96 0 0 1 .524-.15c.293 0 .584.124.84.284.278.173.48.408.71.694.226.282.458.611.684.951v-.014c.017-.324.106-.622.264-.874s.403-.487.762-.543c.3-.047.596.06.787.203s.31.313.4.467c.15.257.212.468.233.542.01.026.653 1.552 1.657 2.54.616.605 1.01 1.223 1.082 1.912.055.537-.096 1.059-.38 1.572.637.121 1.294.187 1.967.187.657 0 1.298-.063 1.921-.178-.287-.517-.44-1.041-.384-1.581.07-.69.465-1.307 1.081-1.913 1.004-.987 1.647-2.513 1.657-2.539.021-.074.083-.285.233-.542.09-.154.208-.323.4-.467a1.08 1.08 0 0 1 .787-.203c.359.056.604.29.762.543s.247.55.265.874v.015c.225-.34.457-.67.683-.952.23-.286.432-.52.71-.694.257-.16.547-.284.84-.285a.97.97 0 0 1 .524.151c.228.143.373.388.43.625l.006.04a10.3 10.3 0 0 0 .534-3.273c0-5.731-4.678-10.378-10.449-10.378M8.327 6.583a1.5 1.5 0 0 1 .713.174 1.487 1.487 0 0 1 .617 2.013c-.183.343-.762-.214-1.102-.094-.38.134-.532.914-.917.71a1.487 1.487 0 0 1 .69-2.803m7.486 0a1.487 1.487 0 0 1 .689 2.803c-.385.204-.536-.576-.916-.71-.34-.12-.92.437-1.103.094a1.487 1.487 0 0 1 .617-2.013 1.5 1.5 0 0 1 .713-.174m-10.68 1.55a.96.96 0 1 1 0 1.921.96.96 0 0 1 0-1.92m13.838 0a.96.96 0 1 1 0 1.92.96.96 0 0 1 0-1.92M8.489 11.458c.588.01 1.965 1.157 3.572 1.164 1.607-.007 2.984-1.155 3.572-1.164.196-.003.305.12.305.454 0 .886-.424 2.328-1.563 3.202-.22-.756-1.396-1.366-1.63-1.32q-.011.001-.02.006l-.044.026-.01.008-.03.024q-.018.017-.035.036l-.032.04a1 1 0 0 0-.058.09l-.014.025q-.049.088-.11.19a1 1 0 0 1-.083.116 1.2 1.2 0 0 1-.173.18q-.035.029-.075.058a1.3 1.3 0 0 1-.251-.243 1 1 0 0 1-.076-.107c-.124-.193-.177-.363-.337-.444-.034-.016-.104-.008-.2.022q-.094.03-.216.087-.06.028-.125.063l-.13.074q-.067.04-.136.086a3 3 0 0 0-.135.096 3 3 0 0 0-.26.219 2 2 0 0 0-.12.121 2 2 0 0 0-.106.128l-.002.002a2 2 0 0 0-.09.132l-.001.001a1.2 1.2 0 0 0-.105.212q-.013.036-.024.073c-1.139-.875-1.563-2.317-1.563-3.203 0-.334.109-.457.305-.454m.836 10.354c.824-1.19.766-2.082-.365-3.194-1.13-1.112-1.789-2.738-1.789-2.738s-.246-.945-.806-.858-.97 1.499.202 2.362c1.173.864-.233 1.45-.685.64-.45-.812-1.683-2.896-2.322-3.295s-1.089-.175-.938.647 2.822 2.813 2.562 3.244-1.176-.506-1.176-.506-2.866-2.567-3.49-1.898.473 1.23 2.037 2.16c1.564.932 1.686 1.178 1.464 1.53s-3.675-2.511-4-1.297c-.323 1.214 3.524 1.567 3.287 2.405-.238.839-2.71-1.587-3.216-.642-.506.946 3.49 2.056 3.522 2.064 1.29.33 4.568 1.028 5.713-.624m5.349 0c-.824-1.19-.766-2.082.365-3.194-1.13-1.112-1.789-2.738-1.789-2.738s.246-.945.806-.858.97 1.499-.202 2.362c-1.173.864.233 1.45.685.64.451-.812 1.683-2.896 2.322-3.295s1.089-.175.938.647-2.822 2.813-2.562 3.244-1.176-.506-1.176-.506-2.866-2.567-3.49-1.898-.473 1.23-2.037 2.16c-1.564.932-1.686 1.178-1.464 1.53s3.675-2.511 4-1.297c.323 1.214-3.524 1.567-3.287 2.405.238.839 2.71-1.587 3.216-.642.506.946-3.49 2.056-3.522 2.064-1.29.33-4.568 1.028-5.713-.624" />
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
