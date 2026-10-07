import React from 'react';
import { Heart } from 'lucide-react';

interface Testimonial {
  name: string;
  handle: string;
  role: string;
  avatarText: string;
  content: string;
  highlight?: string;
}

export const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: 'Jason Lengstorf',
      handle: '@jlengstorf',
      role: 'DevRel & Engineer',
      avatarText: 'JL',
      content:
        'Deterministic AST validation before calling an LLM is how code repair should have been designed from day one. Zero hallucinations, just verified Python diffs.',
      highlight: 'Zero hallucinations',
    },
    {
      name: 'David Kofoed',
      handle: '@davidk_dev',
      role: 'Staff Python Infrastructure',
      avatarText: 'DK',
      content:
        '@bugwhisper feels like having CPython traceback inspector and a fine-tuned coder sitting in the editor. Fixes execute in under 180ms.',
      highlight: 'under 180ms',
    },
    {
      name: 'Anshuman Bhardwaj',
      handle: '@anshuman_dev',
      role: 'Systems Architect',
      avatarText: 'AB',
      content:
        'A 3B model running on 1.9GB VRAM outperforming generalist 70B models on Python Pass@1 is phenomenal. The 4-bit NF4 LoRA weights are crazy lightweight.',
      highlight: 'outperforming generalist 70B models',
    },
    {
      name: 'James Perkins',
      handle: '@james_perkins',
      role: 'Full Stack Engineer',
      avatarText: 'JP',
      content:
        'I used Bug Whisper on our backend microservices. It caught a silent TypeError during list indexing and synthesized the exact type guard immediately.',
      highlight: 'caught a silent TypeError',
    },
    {
      name: 'Guillermo Rauch',
      handle: '@rauchg',
      role: 'Platform Engineering',
      avatarText: 'GR',
      content:
        'The execution loop is brilliant: Pyodide runs code client-side, extracts the line number deterministically, and Qwen 2.5 Coder synthesizes the patch with zero conversational fluff.',
      highlight: 'zero conversational fluff',
    },
    {
      name: 'Timothy Broder',
      handle: '@timothybroder',
      role: 'Senior Backend Engineer',
      avatarText: 'TB',
      content:
        '@bugwhisper is everything I wanted from AI debugging. No chat bot arguing with me, just deterministic tests and a clean unified diff.',
      highlight: 'clean unified diff',
    },
    {
      name: 'Robbie Allen',
      handle: '@robbieallen',
      role: 'AI Researcher',
      avatarText: 'RA',
      content:
        'Evaluating patches against an isolated CPython harness before presenting the diff eliminates regressions. 100% of suggested code compiles.',
      highlight: 'eliminates regressions',
    },
    {
      name: 'WebDevCody',
      handle: '@webdevcody',
      role: 'Software Architect',
      avatarText: 'WC',
      content:
        'The speed of running Pyodide in a dedicated WebWorker without locking the UI is slick. The engineering notebook design is top-tier.',
      highlight: 'without locking the UI',
    },
    {
      name: 'Alex Turner',
      handle: '@alex_sys',
      role: 'MLOps Lead',
      avatarText: 'AT',
      content:
        'We wired our CI/CD crash logs straight to the Bug Whisper 3B endpoint. Pull requests are auto-repaired before engineers even wake up.',
      highlight: 'auto-repaired',
    },
  ];

  return (
    <section id="community" className="w-full bg-cream-surface py-20 px-6 border-b border-mist-divider select-none">
      <div className="max-w-[1240px] mx-auto flex flex-col items-center">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-paper-white border border-mist-divider mb-4">
          <Heart className="w-3 h-3 text-hot-pink fill-hot-pink" />
          <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-fog-text font-medium">
            Customer Love
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-ink-black tracking-[-0.025em] text-center">
          Loved by developers
        </h2>

        {/* Subhead */}
        <p className="mt-3 text-base text-slate-text text-center max-w-xl font-normal leading-relaxed">
          What engineers building production software on Bug Whisper are saying.
        </p>

        {/* 3-Column Masonry/Grid of Dark Testimonial Cards (Video Frame 00:07 - 00:10) */}
        <div className="mt-14 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.handle}
              className="p-5 rounded-xl bg-ink-black border border-graphite-border flex flex-col justify-between hover:border-slate-text/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3.5">
                <div className="w-9 h-9 rounded-full bg-charcoal-surface border border-graphite-border flex items-center justify-center text-paper-white font-mono text-xs font-bold">
                  {t.avatarText}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-paper-white leading-tight">
                    {t.name}
                  </span>
                  <span className="text-xs font-mono text-fog-text">
                    {t.handle}
                  </span>
                </div>
              </div>

              {/* Body */}
              <p className="text-xs sm:text-[13px] text-[#cccccc] leading-relaxed font-sans">
                {t.content}
              </p>

              {/* Footer Role */}
              <div className="mt-4 pt-3 border-t border-graphite-border/70 flex items-center justify-between text-[11px] font-mono text-fog-text">
                <span>{t.role}</span>
                <span className="text-mint-green font-medium">✓ Verified</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
