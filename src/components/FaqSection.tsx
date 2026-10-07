import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'How does Bug Whisper differ from general-purpose models like GPT-4 or Claude?',
      answer:
        'General-purpose models often hallucinate runtime execution or rewrite entire files unnecessarily when a bug occurs. Bug Whisper couples deterministic runtime execution (CPython/Pyodide) with a specialized 3B coder model fine-tuned strictly on Python error git commits, resulting in targeted, surgical diffs without conversational filler.',
    },
    {
      question: 'Why does Bug Whisper strictly enforce the 3-turn ChatML prompt structure?',
      answer:
        'The model was fine-tuned with response-only loss strictly on `<|im_start|>assistant\\n```python\\n{corrected_code}\\n```<|im_end|>`. Asking for conversational explanations or modifying the system prompt forces the model out of its fine-tuned parameter distribution. Keeping the prompt format exact guarantees peak accuracy and deterministic syntax output.',
    },
    {
      question: 'Can Bug Whisper run completely offline on a developer machine?',
      answer:
        'Yes. The 3B model is quantized in 4-bit NormalFloat (NF4) bitsandbytes and can also be exported to GGUF (Q4_K_M ~ 2.1 GB). It runs at 40+ tokens per second on standard laptop CPUs using Ollama (`ollama run bug-whisper-qwen25-coder-3b`) or llama.cpp without an internet connection.',
    },
    {
      question: 'How does the in-browser sandbox protect against infinite loops and dangerous code?',
      answer:
        'Python executes in a dedicated WebWorker via Pyodide (Wasm) isolated from both the server and the browser UI thread. The execution runtime enforces a 3-second watchdog timer that automatically terminates long-running operations or infinite loops, and WebAssembly cannot access the host filesystem or private network APIs.',
    },
    {
      question: 'What are the context window limits of Bug Whisper v1?',
      answer:
        'The v1 model was fine-tuned on CommitPack filtered to 768 tokens (1,800 characters) to ensure high-density training over individual functions and scripts. For production projects with large files, passing the specific failing function and its error traceback yields the highest accuracy.',
    },
  ];

  return (
    <section className="w-full bg-cream-surface py-16 px-6 border-b border-mist-divider">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.05em] text-fog-text">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-bold text-ink-black tracking-[-0.025em]">
            Technical Details &amp; Capabilities
          </h2>
        </div>

        {/* Convex Accordion Rows (Component 242) */}
        <div className="flex flex-col border-t border-mist-divider">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-mist-divider py-5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-lg font-bold text-ink-black tracking-tight group-hover:text-slate-text transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-text shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-ink-black' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-3 pr-8">
                    <p className="text-[15px] text-slate-text leading-relaxed font-normal">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
