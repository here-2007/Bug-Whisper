import React, { useState } from 'react';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { HeroNavbar } from './HeroNavbar';
import { HeroWorkbench } from './HeroWorkbench';

export const HeroSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText('pip install bugwhisper');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      title: 'Deterministic by design',
      desc: 'From CPython AST parsing to isolated subprocess sandboxing, execute Python with mathematical precision. Tracebacks and focal scopes are extracted deterministically with zero hallucinations.',
      index: '01',
    },
    {
      title: 'Real-time fault sync',
      desc: 'Watch syntax validation and runtime tests react in milliseconds as code is edited. The fine-tuned 3B model synthesizes minimal AST patches and updates your diff in under 200ms.',
      index: '02',
    },
    {
      title: 'Zero-regression verifier',
      desc: 'Every candidate patch is verified in an isolated test harness before presenting the diff. Any proposal that causes regressions is eliminated before touching git history.',
      index: '03',
    },
  ];

  return (
    <section className="w-full px-3 sm:px-6 pt-3 pb-8 select-none">
      {/* Outer Giant Dark Hero Card */}
      <div className="max-w-[1460px] mx-auto bg-[#1c1e19] border border-[#2e3128] rounded-xl p-6 sm:p-8 lg:p-10 flex flex-col">
        {/* Top Navbar inside Hero Card */}
        <HeroNavbar />

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between pt-2">
            <div>
              {/* Display Headline */}
              <h1 className="text-4xl sm:text-5xl xl:text-[52px] font-bold text-white tracking-[-0.04em] leading-[1.08]">
                The runtime <br />
                platform that keeps <br />
                Python code in sync
              </h1>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 mt-6 mb-8">
                <a
                  href="#playground"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-neutral-100 text-[#141414] font-semibold text-xs transition-colors cursor-pointer"
                >
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#141414]" />
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#282c22] hover:bg-[#343a2c] border border-[#3c4232] font-mono text-xs text-[#d6dad0] transition-colors cursor-pointer group"
                  title="Copy pip install command"
                >
                  <span className="text-[#8e9385] select-none">&gt;</span>
                  <span>pip install bugwhisper</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-[#7bd88f] ml-1" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#8e9385] group-hover:text-white ml-1 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Vertical 3-Step Accordion */}
            <div className="border-t border-[#2e3128] pt-3 flex flex-col">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div key={step.title} className="border-b border-[#282c22] last:border-b-0 py-3">
                    <button
                      type="button"
                      onClick={() => setActiveStep(idx)}
                      className="w-full text-left font-semibold text-sm transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                          isActive
                            ? 'bg-[#de5d33]/20 text-[#de5d33] border-[#de5d33]/40'
                            : 'bg-[#282c22] text-[#8e9385] border-[#383e2e]'
                        }`}>
                          {step.index}
                        </span>
                        <span className={isActive ? 'text-white' : 'text-[#8e9385] hover:text-[#cfd3c7]'}>
                          {step.title}
                        </span>
                      </div>
                    </button>
                    {isActive && (
                      <p className="mt-2 text-xs text-[#9ba092] leading-relaxed pl-8">
                        {step.desc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Hero Python Workbench (7 cols) */}
          <div className="lg:col-span-7 w-full">
            <HeroWorkbench />
          </div>
        </div>
      </div>
    </section>
  );
};
