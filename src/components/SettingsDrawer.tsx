import React, { useEffect, useState } from 'react';
import { X, RotateCcw, Check, Eye, EyeOff, Server, Terminal, Sparkles, Sliders } from 'lucide-react';
import {
  type InferenceSettings,
  PROVIDER_LABELS,
} from '../types/settings';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: InferenceSettings;
  onUpdateSettings: (updates: Partial<InferenceSettings>) => void;
  onResetSettings?: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  const [showHfToken, setShowHfToken] = useState(false);
  const [showCustomKey, setShowCustomKey] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Inference Settings">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-ink-black border-l border-graphite-border h-full flex flex-col z-10 text-ash-text overflow-hidden select-none">
        {/* Header */}
        <div className="px-6 py-5 border-b border-graphite-border flex items-center justify-between bg-charcoal-surface">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-signal-blue" />
            <div>
              <h2 className="text-sm font-semibold text-paper-white tracking-[-0.025em]">
                Inference Engine Settings
              </h2>
              <p className="text-[11px] font-mono text-fog-text">
                bug-whisper-qwen25-coder-3b
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-fog-text hover:text-paper-white hover:bg-ink-black border border-transparent hover:border-graphite-border transition-colors cursor-pointer"
            aria-label="Close settings drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-xs">
          {/* Section 1: Provider Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono uppercase tracking-[0.05em] text-[11px] text-fog-text font-medium">
                Inference Provider
              </span>
              <span className="text-[10px] font-mono text-mint-green bg-charcoal-surface px-2 py-0.5 rounded border border-graphite-border">
                {PROVIDER_LABELS[settings.provider]}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Option 1: Mock */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ provider: 'mock' })}
                className={`flex flex-col p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  settings.provider === 'mock'
                    ? 'border-signal-blue bg-[#1e2730] text-paper-white'
                    : 'border-graphite-border bg-charcoal-surface hover:border-fog-text text-ash-text'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-paper-white">
                    <Sparkles className="w-3.5 h-3.5 text-mint-green" />
                    <span>Mock Engine</span>
                  </div>
                  {settings.provider === 'mock' && (
                    <Check className="w-3.5 h-3.5 text-signal-blue" />
                  )}
                </div>
                <span className="text-[10px] text-fog-text leading-snug">
                  Instant simulated fixes for all presets (0ms latency, no key).
                </span>
              </button>

              {/* Option 2: Ollama */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ provider: 'ollama' })}
                className={`flex flex-col p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  settings.provider === 'ollama'
                    ? 'border-signal-blue bg-[#1e2730] text-paper-white'
                    : 'border-graphite-border bg-charcoal-surface hover:border-fog-text text-ash-text'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-paper-white">
                    <Terminal className="w-3.5 h-3.5 text-canary-yellow" />
                    <span>Local Ollama</span>
                  </div>
                  {settings.provider === 'ollama' && (
                    <Check className="w-3.5 h-3.5 text-signal-blue" />
                  )}
                </div>
                <span className="text-[10px] text-fog-text leading-snug">
                  Stream locally from http://localhost:11434 via Qwen model.
                </span>
              </button>

              {/* Option 3: Hugging Face */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ provider: 'huggingface' })}
                className={`flex flex-col p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  settings.provider === 'huggingface'
                    ? 'border-signal-blue bg-[#1e2730] text-paper-white'
                    : 'border-graphite-border bg-charcoal-surface hover:border-fog-text text-ash-text'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-paper-white">
                    <Server className="w-3.5 h-3.5 text-iris-violet" />
                    <span>Hugging Face</span>
                  </div>
                  {settings.provider === 'huggingface' && (
                    <Check className="w-3.5 h-3.5 text-signal-blue" />
                  )}
                </div>
                <span className="text-[10px] text-fog-text leading-snug">
                  Hosted HF Inference API calling model repository.
                </span>
              </button>

              {/* Option 4: Custom */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ provider: 'custom' })}
                className={`flex flex-col p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  settings.provider === 'custom'
                    ? 'border-signal-blue bg-[#1e2730] text-paper-white'
                    : 'border-graphite-border bg-charcoal-surface hover:border-fog-text text-ash-text'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-paper-white">
                    <Server className="w-3.5 h-3.5 text-hot-pink" />
                    <span>Custom / vLLM</span>
                  </div>
                  {settings.provider === 'custom' && (
                    <Check className="w-3.5 h-3.5 text-signal-blue" />
                  )}
                </div>
                <span className="text-[10px] text-fog-text leading-snug">
                  OpenAI-compatible chat completions or local vLLM.
                </span>
              </button>
            </div>
          </div>

          {/* Section 2: Provider Specific Configuration */}
          <div className="p-4 rounded-xl border border-graphite-border bg-charcoal-surface space-y-4">
            <span className="font-mono uppercase tracking-[0.05em] text-[11px] text-fog-text font-medium block">
              {settings.provider === 'mock'
                ? 'Mock Engine Details'
                : `${PROVIDER_LABELS[settings.provider]} Configuration`}
            </span>

            {/* Mock provider message */}
            {settings.provider === 'mock' && (
              <div className="text-[11px] text-fog-text leading-relaxed">
                <p>
                  The interactive mock engine intercepts execution errors deterministically and delivers high-fidelity Qwen remediations for all 7 catalog presets plus fallback exception heuristics.
                </p>
                <p className="mt-2 text-mint-green font-mono">
                  ✓ Ideal for zero-setup offline evaluation and browser testing.
                </p>
              </div>
            )}

            {/* Ollama Configuration */}
            {settings.provider === 'ollama' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-ash-text mb-1">
                    Ollama Base URL
                  </label>
                  <input
                    type="text"
                    value={settings.ollamaEndpoint}
                    onChange={(e) => onUpdateSettings({ ollamaEndpoint: e.target.value })}
                    placeholder="http://localhost:11434"
                    className="w-full px-3 py-1.5 rounded bg-ink-black border border-graphite-border text-paper-white font-mono text-xs focus:border-signal-blue focus:outline-none"
                  />
                  <p className="text-[10px] text-fog-text mt-1">
                    Note: Launch Ollama with <code className="text-canary-yellow">OLLAMA_ORIGINS="*"</code> to permit browser CORS requests.
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-ash-text mb-1">
                    Model Tag
                  </label>
                  <input
                    type="text"
                    value={settings.ollamaModel}
                    onChange={(e) => onUpdateSettings({ ollamaModel: e.target.value })}
                    placeholder="bug-whisper-qwen25-coder-3b"
                    className="w-full px-3 py-1.5 rounded bg-ink-black border border-graphite-border text-paper-white font-mono text-xs focus:border-signal-blue focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Hugging Face Configuration */}
            {settings.provider === 'huggingface' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-ash-text mb-1">
                    HF Endpoint
                  </label>
                  <input
                    type="text"
                    value={settings.hfEndpoint}
                    onChange={(e) => onUpdateSettings({ hfEndpoint: e.target.value })}
                    placeholder="https://api-inference.huggingface.co/models"
                    className="w-full px-3 py-1.5 rounded bg-ink-black border border-graphite-border text-paper-white font-mono text-xs focus:border-signal-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-ash-text mb-1">
                    Model Repository ID
                  </label>
                  <input
                    type="text"
                    value={settings.hfModel}
                    onChange={(e) => onUpdateSettings({ hfModel: e.target.value })}
                    placeholder="pernavjain/bug-whisper-qwen25-coder-3b"
                    className="w-full px-3 py-1.5 rounded bg-ink-black border border-graphite-border text-paper-white font-mono text-xs focus:border-signal-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-ash-text mb-1">
                    HF User Token (Bearer)
                  </label>
                  <div className="relative">
                    <input
                      type={showHfToken ? 'text' : 'password'}
                      value={settings.hfToken}
                      onChange={(e) => onUpdateSettings({ hfToken: e.target.value })}
                      placeholder="hf_..."
                      className="w-full px-3 py-1.5 pr-8 rounded bg-ink-black border border-graphite-border text-paper-white font-mono text-xs focus:border-signal-blue focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowHfToken(!showHfToken)}
                      className="absolute right-2 top-2 text-fog-text hover:text-paper-white"
                      tabIndex={-1}
                    >
                      {showHfToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Custom OpenAI/vLLM Configuration */}
            {settings.provider === 'custom' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-ash-text mb-1">
                    OpenAI / vLLM Endpoint
                  </label>
                  <input
                    type="text"
                    value={settings.customEndpoint}
                    onChange={(e) => onUpdateSettings({ customEndpoint: e.target.value })}
                    placeholder="http://localhost:8000/v1"
                    className="w-full px-3 py-1.5 rounded bg-ink-black border border-graphite-border text-paper-white font-mono text-xs focus:border-signal-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-ash-text mb-1">
                    Model Identifier
                  </label>
                  <input
                    type="text"
                    value={settings.customModel}
                    onChange={(e) => onUpdateSettings({ customModel: e.target.value })}
                    placeholder="bug-whisper-qwen25-coder-3b"
                    className="w-full px-3 py-1.5 rounded bg-ink-black border border-graphite-border text-paper-white font-mono text-xs focus:border-signal-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-ash-text mb-1">
                    API Key (optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showCustomKey ? 'text' : 'password'}
                      value={settings.customApiKey}
                      onChange={(e) => onUpdateSettings({ customApiKey: e.target.value })}
                      placeholder="sk-..."
                      className="w-full px-3 py-1.5 pr-8 rounded bg-ink-black border border-graphite-border text-paper-white font-mono text-xs focus:border-signal-blue focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomKey(!showCustomKey)}
                      className="absolute right-2 top-2 text-fog-text hover:text-paper-white"
                      tabIndex={-1}
                    >
                      {showCustomKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Model Hyperparameters */}
          <div className="p-4 rounded-xl border border-graphite-border bg-charcoal-surface space-y-4">
            <span className="font-mono uppercase tracking-[0.05em] text-[11px] text-fog-text font-medium block">
              Inference Hyperparameters
            </span>

            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-ash-text">Temperature</span>
                <span className="text-canary-yellow">{settings.temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={settings.temperature}
                onChange={(e) => onUpdateSettings({ temperature: parseFloat(e.target.value) })}
                className="w-full accent-signal-blue cursor-pointer"
              />
              <span className="text-[10px] text-fog-text block">
                0.1 recommended for deterministic syntax correction.
              </span>
            </div>

            {/* Max Tokens */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-ash-text">Max Tokens</span>
                <span className="text-canary-yellow">{settings.maxTokens}</span>
              </div>
              <input
                type="range"
                min="128"
                max="2048"
                step="64"
                value={settings.maxTokens}
                onChange={(e) => onUpdateSettings({ maxTokens: parseInt(e.target.value, 10) })}
                className="w-full accent-signal-blue cursor-pointer"
              />
              <span className="text-[10px] text-fog-text block">
                Aligned with SFT training distribution (768 max length).
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-graphite-border bg-charcoal-surface flex items-center justify-between">
          <button
            type="button"
            onClick={onResetSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-graphite-border hover:border-fog-text text-fog-text hover:text-paper-white text-xs font-mono transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-paper-white text-ink-black hover:bg-cream-surface text-xs font-medium tracking-tight transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
