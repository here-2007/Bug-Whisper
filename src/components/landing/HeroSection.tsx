import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HeroNavbar } from './HeroNavbar';
import { HeroWorkbench } from './HeroWorkbench';

export const HeroSection: React.FC = () => {
  return (
    <section className="w-full pb-8 select-none">
      {/* Full-width top HeroNavbar with 0 whitespace on top, left, or right */}
      <header className="w-full bg-[#1c1e19] border-b border-[#2e3128] px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
        <div className="max-w-[1460px] mx-auto">
          <HeroNavbar />
        </div>
      </header>

      {/* Hero Partition: 2-Section Grid with Thin Background Gap */}
      <div className="w-full px-3 sm:px-6 pt-2.5 sm:pt-3">
        <div className="max-w-[1460px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 items-stretch">
          {/* Left Section Card: Headline, Studio CTA, Fine-Tuning Info */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#1c1e19] border border-[#2e3128] rounded-xl p-6 sm:p-8">
            {/* Headline and Spaced CTA */}
            <div className="flex flex-col justify-center my-auto py-2 sm:py-4">
              <h1 className="text-4xl sm:text-5xl xl:text-[52px] font-bold text-white tracking-[-0.04em] leading-[1.08]">
                The runtime <br />
                platform that keeps <br />
                Python code in sync
              </h1>

              {/* Generous breathing space between headline and Open Studio button */}
              <div className="mt-10 sm:mt-12">
                <a
                  href="#playground"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-neutral-100 text-[#141414] font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>PlayGround</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#141414]" />
                </a>
              </div>
            </div>

            {/* Theme-Blended Fine-Tuned using Soup Feature Card */}
            <div className="mt-6">
              <div className="p-4 sm:p-5 rounded-xl bg-[#141414] border border-[#2e3128] flex flex-col gap-3">
                {/* Header row: subtle badge and dark-blended SOUP button */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#de5d33]" />
                    <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-[#a0a599] font-medium">
                      Fine-Tuned using Soup
                    </span>
                  </div>

                  {/* Sleek Theme-Blended SOUP CTA Button */}
                  <a
                    href="#soup"
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22251d] hover:bg-[#2c3125] border border-[#383e2e] hover:border-[#4d553f] text-white text-xs font-mono font-medium tracking-tight transition-all cursor-pointer shadow-none shrink-0"
                    title="Jump to Trained with Soup section"
                  >
                    <span className="text-white">SOUP</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#de5d33] group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>

                {/* Technical description */}
                <p className="text-xs sm:text-[13px] text-[#9ba092] leading-relaxed">
                  Trained on <span className="text-white font-medium">9,340 real git commit-error pairs</span> using <code className="font-mono text-xs text-[#ffd43b] bg-[#1a1c17] px-1.5 py-0.5 rounded border border-[#2e3128]">soup-cli</code> + Unsloth. Response-only loss masking isolates AST diff patches with zero hallucinated fluff.
                </p>

                {/* Metric & Architecture Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#1a1c17] border border-[#2e3128] text-[#cfd3c7]">
                    Qwen 2.5 Coder 3B
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#1a1c17] border border-[#2e3128] text-[#7bd88f]">
                    14.7M LoRA params
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#1a1c17] border border-[#2e3128] text-[#8e9385]">
                    &lt; 200ms latency
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section Card: Hero Python Workbench */}
          <div className="lg:col-span-7 flex flex-col justify-center bg-[#1c1e19] border border-[#2e3128] rounded-xl p-5 sm:p-7 lg:p-8">
            <HeroWorkbench />
          </div>
        </div>
      </div>
    </section>
  );
};
