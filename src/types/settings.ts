export type ProviderType = 'mock' | 'ollama' | 'huggingface' | 'custom';

export interface InferenceSettings {
  provider: ProviderType;
  ollamaEndpoint: string;
  ollamaModel: string;
  hfEndpoint: string;
  hfModel: string;
  hfToken: string;
  customEndpoint: string;
  customModel: string;
  customApiKey: string;
  temperature: number;
  maxTokens: number;
}

export const DEFAULT_INFERENCE_SETTINGS: InferenceSettings = {
  provider: 'mock',
  ollamaEndpoint: 'http://localhost:11434',
  ollamaModel: 'bug-whisper-qwen25-coder-3b',
  hfEndpoint: 'https://api-inference.huggingface.co/models',
  hfModel: 'pernavjain/bug-whisper-qwen25-coder-3b',
  hfToken: '',
  customEndpoint: 'http://localhost:8000/v1',
  customModel: 'bug-whisper-qwen25-coder-3b',
  customApiKey: '',
  temperature: 0.1,
  maxTokens: 768,
};

export const PROVIDER_LABELS: Record<ProviderType, string> = {
  mock: 'Interactive Mock',
  ollama: 'Local Ollama',
  huggingface: 'Hugging Face Hub',
  custom: 'Custom OpenAI / vLLM',
};

export const PROVIDER_SHORT_LABELS: Record<ProviderType, string> = {
  mock: 'Mock',
  ollama: 'Ollama',
  huggingface: 'HF',
  custom: 'Custom',
};
