import * as fs from 'node:fs';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as PresetsOracle from './presets-oracle';
import * as PromptOracle from './prompt-oracle';
import * as InferenceOracle from './inference-oracle';
import * as DiffOracle from './diff-oracle';

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

export async function loadPresetsModule(): Promise<{
  BUG_PRESETS: any[];
  isRealImplementation: boolean;
}> {
  const targetPath = path.join(ROOT_DIR, 'src', 'constants', 'presets.ts');
  if (fs.existsSync(targetPath)) {
    try {
      const mod = await import(pathToFileURL(targetPath).href);
      if (mod.BUG_PRESETS) {
        return { BUG_PRESETS: mod.BUG_PRESETS, isRealImplementation: true };
      }
    } catch {
      // Fall through to oracle
    }
  }
  return { BUG_PRESETS: PresetsOracle.PRESETS_ORACLE, isRealImplementation: false };
}

export async function loadPromptModule(): Promise<{
  SYSTEM_PROMPT: string;
  buildUserPrompt: (code: string, stderr: string) => string;
  formatRawChatML: (code: string, stderr: string) => string;
  extractPythonCode: (rawResponse: string) => string;
  isRealImplementation: boolean;
}> {
  const possiblePaths = [
    path.join(ROOT_DIR, 'src', 'services', 'prompt.ts'),
    path.join(ROOT_DIR, 'src', 'utils', 'prompt.ts'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const mod = await import(pathToFileURL(p).href);
        if (typeof mod.buildUserPrompt === 'function') {
          return {
            SYSTEM_PROMPT: mod.SYSTEM_PROMPT || PromptOracle.SYSTEM_PROMPT,
            buildUserPrompt: mod.buildUserPrompt,
            formatRawChatML: mod.formatRawChatML || PromptOracle.formatRawChatML,
            extractPythonCode: mod.extractPythonCode || PromptOracle.extractPythonCode,
            isRealImplementation: true,
          };
        }
      } catch {
        // Fall through
      }
    }
  }

  return {
    SYSTEM_PROMPT: PromptOracle.SYSTEM_PROMPT,
    buildUserPrompt: PromptOracle.buildUserPrompt,
    formatRawChatML: PromptOracle.formatRawChatML,
    extractPythonCode: PromptOracle.extractPythonCode,
    isRealImplementation: false,
  };
}

export async function loadInferenceModule(): Promise<{
  executeMockInference: (req: any, settings?: any) => Promise<string>;
  DEFAULT_INFERENCE_SETTINGS: any;
  isRealImplementation: boolean;
}> {
  const targetPath = path.join(ROOT_DIR, 'src', 'services', 'inference.ts');
  if (fs.existsSync(targetPath)) {
    try {
      const mod = await import(pathToFileURL(targetPath).href);
      if (typeof mod.requestRemediation === 'function' || typeof mod.executeMockInference === 'function') {
        const execFn = mod.executeMockInference || ((req: any) => mod.requestRemediation(req, mod.DEFAULT_INFERENCE_SETTINGS));
        return {
          executeMockInference: execFn,
          DEFAULT_INFERENCE_SETTINGS: mod.DEFAULT_INFERENCE_SETTINGS || InferenceOracle.DEFAULT_INFERENCE_SETTINGS,
          isRealImplementation: true,
        };
      }
    } catch {
      // Fall through
    }
  }

  return {
    executeMockInference: InferenceOracle.executeMockInference,
    DEFAULT_INFERENCE_SETTINGS: InferenceOracle.DEFAULT_INFERENCE_SETTINGS,
    isRealImplementation: false,
  };
}

export async function loadDiffModule(): Promise<{
  generateUnifiedDiff: (orig: string, fixed: string, filename?: string) => string;
  isRealImplementation: boolean;
}> {
  const possiblePaths = [
    path.join(ROOT_DIR, 'src', 'utils', 'diff.ts'),
    path.join(ROOT_DIR, 'src', 'services', 'diff.ts'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const mod = await import(pathToFileURL(p).href);
        if (typeof mod.generateUnifiedDiff === 'function') {
          return {
            generateUnifiedDiff: mod.generateUnifiedDiff,
            isRealImplementation: true,
          };
        }
      } catch {
        // Fall through
      }
    }
  }

  return {
    generateUnifiedDiff: DiffOracle.generateUnifiedDiff,
    isRealImplementation: false,
  };
}
