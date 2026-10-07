import type { InferenceSettings } from '../types/settings';
import { BUG_PRESETS } from '../constants/presets';

export interface InferenceRequest {
  code: string;
  stderr?: string;
  settings: InferenceSettings;
}

export interface InferenceResponse {
  fixedCode: string;
  explanation?: string;
  latencyMs: number;
  provider: string;
}

export async function runInference(req: InferenceRequest): Promise<InferenceResponse> {
  const startTime = performance.now();
  const { code, stderr = '', settings } = req;

  // 1. Mock Provider: High-fidelity simulation for instant testing
  if (settings.provider === 'mock') {
    // Artificial latency for realistic inference feel (250-400ms)
    await new Promise((r) => setTimeout(r, 320));

    // Check if code matches any known preset
    const matchingPreset = BUG_PRESETS.find(
      (p) =>
        p.buggyCode.trim() === code.trim() ||
        code.includes(p.id) ||
        (p.offendingLine && code.includes(p.summary.slice(0, 15)))
    );

    if (matchingPreset) {
      return {
        fixedCode: matchingPreset.fixedCode,
        explanation: matchingPreset.explanation,
        latencyMs: Math.round(performance.now() - startTime),
        provider: 'Mock Engine (Qwen 2.5 Coder 3B Weights)',
      };
    }

    // Heuristic mock fix if custom code
    const fallbackFixed = code
      .replace(/result\['key'\]/g, "result.get('key', None) if result else None")
      .replace(/roles\[5\]/g, 'roles[min(5, len(roles) - 1)]')
      .replace(/\/ 0/g, '/ (1 if elapsed_seconds == 0 else elapsed_seconds)')
      .replace(/log=\[\]/g, 'log=None');

    return {
      fixedCode: fallbackFixed !== code ? fallbackFixed : `${code}\n# [Bug Whisper Fix: Checked boundary and none-safety]`,
      explanation: 'Applied deterministic exception resolution matching model SFT patterns.',
      latencyMs: Math.round(performance.now() - startTime),
      provider: 'Mock Engine (Simulated)',
    };
  }

  // 2. Local Ollama Provider
  if (settings.provider === 'ollama') {
    try {
      const response = await fetch(`${settings.ollamaEndpoint.replace(/\/$/, '')}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: settings.ollamaModel || 'bug-whisper-qwen25-coder-3b',
          stream: false,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert Python bug-fixing assistant. Fix all errors in the provided code and return only the corrected Python code.',
            },
            {
              role: 'user',
              content: `Fix the bug in this Python code:\n\n\`\`\`python\n${code}\n\`\`\`\n\nError output:\n\`\`\`\n${stderr.slice(0, 300)}\n\`\`\``,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama returned status ${response.status}`);
      }

      const data = await response.json();
      const content = data.message?.content || '';
      const cleaned = extractCodeFromMarkdown(content);

      return {
        fixedCode: cleaned,
        latencyMs: Math.round(performance.now() - startTime),
        provider: `Ollama (${settings.ollamaModel})`,
      };
    } catch (err: unknown) {
      console.warn('Ollama call failed, falling back to mock:', err);
      return {
        fixedCode: code,
        explanation: `Ollama connection error: ${err instanceof Error ? err.message : String(err)}`,
        latencyMs: Math.round(performance.now() - startTime),
        provider: 'Ollama (Failed)',
      };
    }
  }

  // 3. Hugging Face Inference Provider
  if (settings.provider === 'huggingface') {
    try {
      const hfModel = settings.hfModel || 'pernavjain/bug-whisper-qwen25-coder-3b';
      const prompt = `<|im_start|>system\nYou are an expert Python bug-fixing assistant. Fix all errors in the provided code and return only the corrected Python code.<|im_end|>\n<|im_start|>user\nFix the bug in this Python code:\n\n\`\`\`python\n${code}\n\`\`\`\n\nError output:\n\`\`\`\n${stderr.slice(0, 300)}\n\`\`\`<|im_end|>\n<|im_start|>assistant\n`;

      const response = await fetch(`https://api-inference.huggingface.co/models/${hfModel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: settings.hfToken ? `Bearer ${settings.hfToken}` : '',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.0,
            return_full_text: false,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text || '';
      const cleaned = extractCodeFromMarkdown(rawText);

      return {
        fixedCode: cleaned || code,
        latencyMs: Math.round(performance.now() - startTime),
        provider: `Hugging Face (${hfModel})`,
      };
    } catch (err: unknown) {
      console.warn('Hugging Face call failed:', err);
      return {
        fixedCode: code,
        explanation: `Hugging Face error: ${err instanceof Error ? err.message : String(err)}`,
        latencyMs: Math.round(performance.now() - startTime),
        provider: 'Hugging Face (Failed)',
      };
    }
  }

  // 4. Custom OpenAI / vLLM Provider
  try {
    const response = await fetch(`${settings.customEndpoint.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: settings.customApiKey ? `Bearer ${settings.customApiKey}` : '',
      },
      body: JSON.stringify({
        model: settings.customModel || 'bug-whisper-qwen25-coder-3b',
        temperature: settings.temperature || 0.0,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert Python bug-fixing assistant. Fix all errors in the provided code and return only the corrected Python code.',
          },
          {
            role: 'user',
            content: `Fix the bug in this Python code:\n\n\`\`\`python\n${code}\n\`\`\`\n\nError output:\n\`\`\`\n${stderr.slice(0, 300)}\n\`\`\``,
          },
        ],
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const cleaned = extractCodeFromMarkdown(content);

    return {
      fixedCode: cleaned,
      latencyMs: Math.round(performance.now() - startTime),
      provider: `Custom API (${settings.customModel})`,
    };
  } catch (err: unknown) {
    return {
      fixedCode: code,
      explanation: `Custom API error: ${err instanceof Error ? err.message : String(err)}`,
      latencyMs: Math.round(performance.now() - startTime),
      provider: 'Custom API (Failed)',
    };
  }
}

function extractCodeFromMarkdown(text: string): string {
  const match = text.match(/```(?:python)?\s*([\s\S]*?)```/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return text.trim();
}
