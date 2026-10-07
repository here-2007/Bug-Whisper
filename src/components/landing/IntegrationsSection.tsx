import React from 'react';
import {
  Zap,
  CheckCircle2,
  Flame,
  Layers,
  FlaskConical,
  Workflow,
  Code2,
  Box,
  Binary,
} from 'lucide-react';

const PixelHeart: React.FC = () => (
  <span className="inline-flex items-center mx-2.5 align-middle">
    <svg width="22" height="18" viewBox="0 0 7 6" className="fill-[#de5d33]">
      <rect x="1" y="0" width="2" height="1" />
      <rect x="4" y="0" width="2" height="1" />
      <rect x="0" y="1" width="7" height="2" />
      <rect x="1" y="3" width="5" height="1" />
      <rect x="2" y="4" width="3" height="1" />
      <rect x="3" y="5" width="1" height="1" />
    </svg>
  </span>
);

const PYTHON_FRAMEWORKS = [
  { name: 'FastAPI', icon: Zap, iconColor: 'text-[#05998b]' },
  { name: 'PyTest', icon: CheckCircle2, iconColor: 'text-[#0a9edc]' },
  { name: 'PyTorch', icon: Flame, iconColor: 'text-[#ee4c2c]' },
  { name: 'Django', icon: Layers, iconColor: 'text-[#092e20]' },
  { name: 'Flask', icon: FlaskConical, iconColor: 'text-[#141414]' },
  { name: 'Celery', icon: Workflow, iconColor: 'text-[#378147]' },
  { name: 'VS Code', icon: Code2, iconColor: 'text-[#007acc]' },
  { name: 'Docker', icon: Box, iconColor: 'text-[#2496ed]' },
  { name: 'PyO3 / Rust', icon: Binary, iconColor: 'text-[#dea584]' },
];

export const IntegrationsSection: React.FC = () => {
  return (
    <section className="w-full py-16 lg:py-24 px-6 select-none bg-[#f6f6f6]" id="integrations">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Heading & CTAs */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded border border-[#dfdacd] bg-white w-fit">
            <span className="text-[10px] font-mono uppercase tracking-[0.05em] text-[#63665c] font-semibold">
              INTEGRATIONS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#141414] tracking-[-0.035em] leading-[1.1]">
            Bug Whisper <PixelHeart /> your favorite tools
          </h2>

          <p className="text-sm sm:text-base text-[#55584e] leading-relaxed max-w-lg">
            Connect deterministic bug repair to your CI pipelines, editor actions, and Python framework workflows.
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

        {/* Right Column: 3x3 Python Frameworks Grid */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PYTHON_FRAMEWORKS.map((fw) => {
              const Icon = fw.icon;
              return (
                <div
                  key={fw.name}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#e5e5e5] hover:border-[#38383a] transition-all cursor-pointer group"
                >
                  <div className={`w-8 h-8 rounded-lg bg-[#f6f6f6] border border-[#e5e5e5] flex items-center justify-center shrink-0 ${fw.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-[#141414] group-hover:text-black">
                    {fw.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
