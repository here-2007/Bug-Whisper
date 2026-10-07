import { PRESETS_ORACLE } from './presets-oracle';

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

export interface InferenceRequest {
  code: string;
  stderr: string;
  presetId?: string;
  onChunk?: (chunk: string) => void;
}

/**
 * Deterministic Mock Inference Engine.
 * Provides immediate fixes for presets and common Python bug heuristics.
 */
export async function executeMockInference(request: InferenceRequest): Promise<string> {
  const { code, presetId, onChunk } = request;

  let fixedCode = '';

  // 1. Direct preset ID resolution
  if (presetId) {
    const found = PRESETS_ORACLE.find((p) => p.id === presetId);
    if (found) {
      fixedCode = found.fixedCode;
    }
  }

  // 2. Signature match resolution if presetId not specified
  if (!fixedCode) {
    if (code.includes('get_user_role')) {
      fixedCode = PRESETS_ORACLE.find((p) => p.id === 'index-error')!.fixedCode;
    } else if (code.includes('fetch_user_profile')) {
      fixedCode = PRESETS_ORACLE.find((p) => p.id === 'nonetype-subscript')!.fixedCode;
    } else if (code.includes('register_event')) {
      fixedCode = PRESETS_ORACLE.find((p) => p.id === 'mutable-default')!.fixedCode;
    } else if (code.includes('get_config_timeout')) {
      fixedCode = PRESETS_ORACLE.find((p) => p.id === 'key-error')!.fixedCode;
    } else if (code.includes('calculate_throughput')) {
      fixedCode = PRESETS_ORACLE.find((p) => p.id === 'zero-division')!.fixedCode;
    } else if (code.includes('increment_counter')) {
      fixedCode = PRESETS_ORACLE.find((p) => p.id === 'unbound-local')!.fixedCode;
    } else if (code.includes('validate_payload')) {
      fixedCode = PRESETS_ORACLE.find((p) => p.id === 'syntax-error')!.fixedCode;
    }
  }

  // 3. Heuristic repair resolution for arbitrary code
  if (!fixedCode) {
    if (request.stderr.includes('SyntaxError') || (!request.stderr && (code.includes('def ') || code.includes('if ')))) {
      // Fix missing colons
      const lines = code.split('\n');
      const fixedLines = lines.map((line) => {
        const trimmed = line.trim();
        if (
          (trimmed.startsWith('def ') ||
            trimmed.startsWith('if ') ||
            trimmed.startsWith('for ') ||
            trimmed.startsWith('while ') ||
            trimmed.startsWith('class ') ||
            trimmed.startsWith('elif ') ||
            trimmed.startsWith('else')) &&
          !trimmed.endsWith(':')
        ) {
          return line + ':';
        }
        return line;
      });
      fixedCode = fixedLines.join('\n');
    } else if (request.stderr.includes('ZeroDivisionError') || code.includes('/')) {
      // Wrap division with zero check preserving indentation
      fixedCode = code.replace(
        /([ \t]*)return\s+([a-zA-Z0-9_]+)\s*\/\s*([a-zA-Z0-9_]+)/g,
        '$1if $3 == 0:\n$1    return 0.0\n$1return $2 / $3'
      );
    } else if (request.stderr.includes('KeyError')) {
      // Replace dict[key] with dict.get(key, default)
      fixedCode = code.replace(/\[(["'][a-zA-Z0-9_-]+["'])\]/g, '.get($1, None)');
    } else {
      // Fallback: return original code with error comment
      fixedCode = `# Remediated code\n${code}`;
    }
  }

  // Simulate streaming chunks
  if (onChunk && fixedCode) {
    const chunkSize = 20;
    for (let i = 0; i < fixedCode.length; i += chunkSize) {
      onChunk(fixedCode.slice(i, i + chunkSize));
    }
  }

  return fixedCode;
}
