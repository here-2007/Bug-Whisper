import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';

interface EcosystemItem {
  name: string;
  category: string;
  badge: string;
}

export const IntegrationsSection: React.FC = () => {
  const ecosystems: EcosystemItem[] = [
    { name: 'Python 3.10+', category: 'CPython Runtime', badge: 'Native AST' },
    { name: 'PyTorch', category: 'Deep Learning', badge: 'Tensor Tracing' },
    { name: 'FastAPI', category: 'Web Framework', badge: 'HTTP Interceptor' },
    { name: 'JupyterLab', category: 'Notebooks', badge: 'Cell Auto-Repair' },
    { name: 'VS Code', category: 'IDE Extension', badge: 'LSP Protocol' },
    { name: 'Docker', category: 'Containers', badge: 'Isolated Sandbox' },
    { name: 'Hugging Face', category: 'Model Hub', badge: 'Transformers' },
    { name: 'Ray', category: 'Distributed Computing', badge: 'Worker Telemetry' },
    { name: 'GitHub Actions', category: 'CI/CD Pipelines', badge: 'Auto PR Healing' },
  ];

  return (
    <section id="integrations" className="w-full bg-cream-surface py-20 px-6 border-b border-mist-divider select-none">
      <div className="max-w-[1240px] mx-auto flex flex-col items-center">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-paper-white border border-mist-divider mb-4">
          <Layers className="w-3 h-3 text-fog-text" />
          <span className="text-[11px] font-mono uppercase tracking-[0.05em] text-fog-text font-medium">
            Integrations
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-ink-black tracking-[-0.025em] text-center">
          Bug Whisper ❤️ your favorite ecosystems
        </h2>

        {/* Subhead */}
        <p className="mt-3 text-base text-slate-text text-center max-w-xl font-normal leading-relaxed">
          Connect deterministic code repair to your client libraries and production workflows.
        </p>

        {/* Action Button */}
        <div className="mt-6">
          <a
            href="https://github.com/harshitxdev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ink-black hover:bg-[#292929] text-paper-white font-medium text-sm transition-colors cursor-pointer"
          >
            <span>Explore SDKs</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Ecosystem Grid Cards (Video Frame 00:11) */}
        <div className="mt-14 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ecosystems.map((eco) => (
            <div
              key={eco.name}
              className="p-5 rounded-xl bg-paper-white border border-mist-divider hover:border-slate-text/40 transition-colors flex items-center justify-between"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-ink-black tracking-tight">
                  {eco.name}
                </span>
                <span className="text-xs text-fog-text font-normal">
                  {eco.category}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cream-surface border border-mist-divider text-slate-text">
                {eco.badge}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
