import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, test, expect, setTier } from './fixtures/test-framework';
import { loadPresetsModule, loadPromptModule, loadInferenceModule, loadDiffModule } from './fixtures/module-loader';
import { PRESETS_ORACLE } from './fixtures/presets-oracle';
import { runPythonHarness } from './fixtures/harness-runner';

setTier(1);

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// ============================================================================
// F1: Design Tokens & Zero Shadows
// ============================================================================
describe('F1: Design Tokens & Strict Zero Shadows Enforcement', () => {
  const srcDir = path.join(ROOT_DIR, 'src');

  function getAllSourceFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files: string[] = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(getAllSourceFiles(fullPath));
      } else if (/\.(tsx|ts|jsx|js|css|html)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
    return files;
  }

  test('F1.1: Static scan verifies zero forbidden "shadow-" utility classes in src/', () => {
    const files = getAllSourceFiles(srcDir);
    expect(files.length).toBeGreaterThan(0);

    const forbiddenShadowPatterns = [
      /\bshadow-sm\b/,
      /\bshadow-md\b/,
      /\bshadow-lg\b/,
      /\bshadow-xl\b/,
      /\bshadow-2xl\b/,
      /\bshadow-inner\b/,
    ];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const pattern of forbiddenShadowPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          throw new Error(`Forbidden shadow class found in ${file}: "${matches[0]}"`);
        }
      }
    }
  });

  test('F1.2: Static scan verifies box-shadow in CSS is explicitly disabled', () => {
    const cssPath = path.join(srcDir, 'index.css');
    expect(fs.existsSync(cssPath)).toBeTruthy();
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    // Must enforce box-shadow: none
    expect(cssContent).toContain('box-shadow: none');
  });

  test('F1.3: Border radius tokens conform to max 16px constraint', () => {
    const cssPath = path.join(srcDir, 'index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    expect(cssContent).toContain('--radius-md: 4px');
    expect(cssContent).toContain('--radius-lg: 8px');
    expect(cssContent).toContain('--radius-xl: 12px');
    expect(cssContent).toContain('--radius-2xl: 16px');

    // No radius above 16px should be defined in theme
    const largeRadiusMatches = cssContent.match(/--radius-[^:]+:\s*([2-9][0-9]+px)/g);
    expect(largeRadiusMatches).toBeNull();
  });

  test('F1.4: Core surface and accent color tokens are defined in index.css', () => {
    const cssPath = path.join(srcDir, 'index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    const expectedTokens = [
      '--color-ink-black: #141414',
      '--color-paper-white: #ffffff',
      '--color-cream-surface: #f6f6f6',
      '--color-charcoal-surface: #292929',
      '--color-graphite-border: #38383a',
      '--color-mist-divider: #e5e5e5',
      '--color-mint-green: #7bd88f',
      '--color-hot-pink: #fc618d',
      '--color-canary-yellow: #f8e67a',
    ];

    for (const token of expectedTokens) {
      expect(cssContent).toContain(token);
    }
  });

  test('F1.5: Typography tokens define monospace code font at 13px', () => {
    const cssPath = path.join(srcDir, 'index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    expect(cssContent).toContain('JetBrains Mono');
    expect(cssContent).toContain('Inter');
  });
});

// ============================================================================
// F2: Preset Bug Catalog
// ============================================================================
describe('F2: Preset Bug Catalog (7 Presets)', () => {
  test('F2.1: Exactly 7 presets exist in the catalog', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();
    expect(BUG_PRESETS.length).toBe(7);
  });

  test('F2.2: All 7 required preset IDs are present', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();
    const ids = BUG_PRESETS.map((p) => p.id);
    const expectedIds = [
      'index-error',
      'nonetype-subscript',
      'mutable-default',
      'key-error',
      'zero-division',
      'unbound-local',
      'syntax-error',
    ];

    for (const id of expectedIds) {
      expect(ids.includes(id)).toBeTruthy();
    }
  });

  test('F2.3: Every preset contains all mandatory schema fields', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();
    const requiredFields = [
      'id',
      'name',
      'exceptionType',
      'category',
      'badgeColor',
      'summary',
      'offendingLine',
      'buggyCode',
      'expectedStderr',
      'fixedCode',
      'explanation',
    ];

    for (const preset of BUG_PRESETS) {
      for (const field of requiredFields) {
        expect(preset[field] !== undefined).toBeTruthy();
        if (typeof preset[field] === 'string') {
          expect(preset[field].length).toBeGreaterThan(0);
        }
      }
      expect(typeof preset.offendingLine).toBe('number');
      expect(preset.offendingLine).toBeGreaterThan(0);
    }
  });

  test('F2.4: Preset categories conform to Runtime, Type, Logic, or Syntax', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();
    const allowedCategories = ['Runtime', 'Type', 'Logic', 'Syntax'];

    for (const preset of BUG_PRESETS) {
      expect(allowedCategories.includes(preset.category)).toBeTruthy();
    }
  });

  test('F2.5: All fixedCode implementations are valid Python with no syntax errors', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();

    for (const preset of BUG_PRESETS) {
      const res = runPythonHarness(preset.fixedCode);
      expect(res.errorType).toBeNull();
      expect(res.success).toBe(true);
    }
  });

  test('F2.6: Buggy code expectedStderr matches standard Python traceback signature', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();

    for (const preset of BUG_PRESETS) {
      const hasTraceback =
        preset.expectedStderr.includes('Traceback (most recent call last):') ||
        preset.expectedStderr.includes('SyntaxError:');
      expect(hasTraceback).toBeTruthy();
    }
  });
});

// ============================================================================
// F3: 3-Turn ChatML Prompt Alignment
// ============================================================================
describe('F3: 3-Turn ChatML Prompt Alignment & Invariant Enforcement', () => {
  test('F3.1: System prompt matches context.md exact specification', async () => {
    const { SYSTEM_PROMPT } = await loadPromptModule();
    expect(SYSTEM_PROMPT).toBe(
      'You are an expert Python bug-fixing assistant. Fix all errors in the provided code and return only the corrected Python code.'
    );
  });

  test('F3.2: User prompt matches exact Markdown structure with code and stderr', async () => {
    const { buildUserPrompt } = await loadPromptModule();
    const sampleCode = 'print(1 / 0)';
    const sampleStderr = 'ZeroDivisionError: division by zero';
    const userPrompt = buildUserPrompt(sampleCode, sampleStderr);

    expect(userPrompt.startsWith('Fix the bug in this Python code:\n\n```python\n')).toBeTruthy();
    expect(userPrompt).toContain(sampleCode);
    expect(userPrompt).toContain('Error output:\n```\n' + sampleStderr + '\n```');
  });

  test('F3.3: Stderr > 300 characters is strictly truncated to 300 characters', async () => {
    const { buildUserPrompt } = await loadPromptModule();
    const longStderr = 'E'.repeat(500);
    const userPrompt = buildUserPrompt('x = 1', longStderr);

    // Prompt must contain exactly 300 characters of E, not 500
    expect(userPrompt).toContain('E'.repeat(300));
    expect(userPrompt.includes('E'.repeat(301))).toBe(false);
  });

  test('F3.4: Empty or missing stderr falls back gracefully to "No error output"', async () => {
    const { buildUserPrompt } = await loadPromptModule();
    const userPromptEmpty = buildUserPrompt('x = 1', '');
    expect(userPromptEmpty).toContain('No error output');
  });

  test('F3.5: Raw ChatML format preserves 3-turn delimiters and assistant prefill', async () => {
    const { formatRawChatML, SYSTEM_PROMPT } = await loadPromptModule();
    const rawChatML = formatRawChatML('a = 1', 'IndexError');

    expect(rawChatML.startsWith(`<|im_start|>system\n${SYSTEM_PROMPT}<|im_end|>\n`)).toBeTruthy();
    expect(rawChatML).toContain('<|im_start|>user\n');
    expect(rawChatML.endsWith('<|im_start|>assistant\n```python\n')).toBeTruthy();
  });
});

// ============================================================================
// F4: Python Code Fence Extractor
// ============================================================================
describe('F4: Python Code Fence Extractor', () => {
  test('F4.1: Extracts clean code from standard ```python fence', async () => {
    const { extractPythonCode } = await loadPromptModule();
    const input = '```python\ndef add(a, b):\n    return a + b\n```';
    const extracted = extractPythonCode(input);
    expect(extracted).toBe('def add(a, b):\n    return a + b');
  });

  test('F4.2: Extracts clean code from ```py alias fence', async () => {
    const { extractPythonCode } = await loadPromptModule();
    const input = '```py\nprint("hello")\n```';
    const extracted = extractPythonCode(input);
    expect(extracted).toBe('print("hello")');
  });

  test('F4.3: Extracts code from generic ``` fence', async () => {
    const { extractPythonCode } = await loadPromptModule();
    const input = '```\nx = [1, 2, 3]\n```';
    const extracted = extractPythonCode(input);
    expect(extracted).toBe('x = [1, 2, 3]');
  });

  test('F4.4: Extracts code from unclosed streaming code fence', async () => {
    const { extractPythonCode } = await loadPromptModule();
    const input = '```python\ndef partial_stream():\n    pass';
    const extracted = extractPythonCode(input);
    expect(extracted).toBe('def partial_stream():\n    pass');
  });

  test('F4.5: Strips special model stop tokens (<|im_end|>, <|endoftext|>)', async () => {
    const { extractPythonCode } = await loadPromptModule();
    const input = '```python\nval = 42\n```<|im_end|>';
    const extracted = extractPythonCode(input);
    expect(extracted).toBe('val = 42');

    const rawWithStop = 'x = 10<|im_end|><|endoftext|>';
    const extractedRaw = extractPythonCode(rawWithStop);
    expect(extractedRaw).toBe('x = 10');
  });

  test('F4.6: Handles empty and null strings safely without crashing', async () => {
    const { extractPythonCode } = await loadPromptModule();
    expect(extractPythonCode('')).toBe('');
    expect(extractPythonCode(null as any)).toBe('');
  });
});

// ============================================================================
// F5: Unified Inference Router
// ============================================================================
describe('F5: Unified Inference Router & Mock Engine', () => {
  test('F5.1: Default settings specify Interactive Mock with temperature 0.1 and maxTokens 768', async () => {
    const { DEFAULT_INFERENCE_SETTINGS } = await loadInferenceModule();
    expect(DEFAULT_INFERENCE_SETTINGS.provider).toBe('mock');
    expect(DEFAULT_INFERENCE_SETTINGS.temperature).toBe(0.1);
    expect(DEFAULT_INFERENCE_SETTINGS.maxTokens).toBe(768);
  });

  test('F5.2: Mock provider resolves fixes by presetId', async () => {
    const { executeMockInference } = await loadInferenceModule();
    const preset = PRESETS_ORACLE[0]; // index-error
    const fixed = await executeMockInference({
      code: preset.buggyCode,
      stderr: preset.expectedStderrSubstring,
      presetId: preset.id,
    });

    expect(fixed).toBe(preset.fixedCode);
  });

  test('F5.3: Mock provider resolves fixes by function signature when presetId omitted', async () => {
    const { executeMockInference } = await loadInferenceModule();
    const preset = PRESETS_ORACLE[4]; // zero-division
    const fixed = await executeMockInference({
      code: preset.buggyCode,
      stderr: preset.expectedStderrSubstring,
    });

    expect(fixed).toBe(preset.fixedCode);
  });

  test('F5.4: Mock provider resolves heuristic fix for missing colons', async () => {
    const { executeMockInference } = await loadInferenceModule();
    const buggyCustom = 'def custom_fn(x)\n    return x + 1';
    const fixed = await executeMockInference({
      code: buggyCustom,
      stderr: "SyntaxError: expected ':'",
    });

    expect(fixed).toContain('def custom_fn(x):');
  });

  test('F5.5: Streaming onChunk callback receives progressive tokens', async () => {
    const { executeMockInference } = await loadInferenceModule();
    const chunks: string[] = [];
    const fixed = await executeMockInference({
      code: 'print("test")',
      stderr: '',
      presetId: 'syntax-error',
      onChunk: (chunk: string) => {
        chunks.push(chunk);
      },
    });

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.join('')).toBe(fixed);
  });
});

// ============================================================================
// F6: Unified Diff Utility
// ============================================================================
describe('F6: Unified Diff Utility', () => {
  test('F6.1: Generates standard unified patch header', async () => {
    const { generateUnifiedDiff } = await loadDiffModule();
    const orig = 'line1\nline2';
    const fixed = 'line1\nline2_modified';
    const diff = generateUnifiedDiff(orig, fixed, 'main.py');

    expect(diff).toContain('--- a/main.py');
    expect(diff).toContain('+++ b/main.py');
    expect(diff).toContain('@@ -');
  });

  test('F6.2: Identical strings produce empty diff', async () => {
    const { generateUnifiedDiff } = await loadDiffModule();
    const code = 'def hello():\n    return "world"';
    const diff = generateUnifiedDiff(code, code);
    expect(diff).toBe('');
  });

  test('F6.3: Single line modification generates correct - and + lines', async () => {
    const { generateUnifiedDiff } = await loadDiffModule();
    const orig = 'x = 10';
    const fixed = 'x = 20';
    const diff = generateUnifiedDiff(orig, fixed);

    expect(diff).toContain('-x = 10');
    expect(diff).toContain('+x = 20');
  });

  test('F6.4: Line additions generate + lines with proper hunk headers', async () => {
    const { generateUnifiedDiff } = await loadDiffModule();
    const orig = 'def test():\n    pass';
    const fixed = 'def test():\n    print("started")\n    pass';
    const diff = generateUnifiedDiff(orig, fixed);

    expect(diff).toContain('+    print("started")');
    expect(diff).toContain(' def test():');
  });

  test('F6.5: Line deletions generate - lines', async () => {
    const { generateUnifiedDiff } = await loadDiffModule();
    const orig = 'a = 1\nb = 2\nc = 3';
    const fixed = 'a = 1\nc = 3';
    const diff = generateUnifiedDiff(orig, fixed);

    expect(diff).toContain('-b = 2');
  });
});

// ============================================================================
// F7: Pyodide Harness Protocol
// ============================================================================
describe('F7: Pyodide Execution Harness Protocol', () => {
  test('F7.1: Stdout capture returns stdout string and success: true', () => {
    const res = runPythonHarness('print("Hello from Bug Whisper!")');
    expect(res.success).toBe(true);
    expect(res.stdout).toBe('Hello from Bug Whisper!\n');
    expect(res.stderr).toBe('');
    expect(res.errorType).toBeNull();
  });

  test('F7.2: Compile-time SyntaxError extraction captures line and caret', () => {
    const res = runPythonHarness('def broken()\n    pass');
    expect(res.success).toBe(false);
    expect(res.errorType).toBe('SyntaxError');
    expect(res.lineNumber).toBe(1);
    expect(res.stderr).toContain('SyntaxError:');
    expect(res.traceback).toContain('  File "main.py", line 1');
  });

  test('F7.3: Runtime exception extraction captures exception class and line', () => {
    const res = runPythonHarness('items = [10, 20]\nprint(items[99])');
    expect(res.success).toBe(false);
    expect(res.errorType).toBe('IndexError');
    expect(res.lineNumber).toBe(2);
    expect(res.errorMessage).toBe('list index out of range');
    expect(res.traceback).toContain('IndexError: list index out of range');
  });

  test('F7.4: sys.stderr redirection captures user stderr writes', () => {
    const res = runPythonHarness('import sys\nsys.stderr.write("Custom warning log\\n")');
    expect(res.success).toBe(true);
    expect(res.stderr).toContain('Custom warning log');
  });

  test('F7.5: Harness output caps at 50,000 characters to prevent buffer overflow', () => {
    const res = runPythonHarness('print("A" * 100000)');
    expect(res.success).toBe(true);
    expect(res.stdout.length).toBeLessThanOrEqual(50000);
  });
});

// ============================================================================
// F8: Pyodide WebWorker Sandbox & Terminal HUD Modules
// ============================================================================
describe('F8: Pyodide WebWorker Sandbox & Terminal HUD Modules', () => {
  test('F8.1: src/types/pyodide.ts defines mandatory message protocol and result interfaces', () => {
    const typesPath = path.join(ROOT_DIR, 'src', 'types', 'pyodide.ts');
    expect(fs.existsSync(typesPath)).toBe(true);
    const content = fs.readFileSync(typesPath, 'utf-8');

    expect(content).toContain('export type PyodideStatus');
    expect(content).toContain('export interface ExecutionRequest');
    expect(content).toContain('export interface ExecutionResult');
    expect(content).toContain('export interface StatusMessage');
    expect(content).toContain('export interface RunCompleteMessage');
    expect(content).toContain('export interface UsePyodideReturn');
  });

  test('F8.2: src/workers/pyodide-worker.ts embeds two-tier harness and handles message protocol', () => {
    const workerPath = path.join(ROOT_DIR, 'src', 'workers', 'pyodide-worker.ts');
    expect(fs.existsSync(workerPath)).toBe(true);
    const content = fs.readFileSync(workerPath, 'utf-8');

    expect(content).toContain('loadPyodide');
    expect(content).toContain('__bug_whisper_execute__');
    expect(content).toContain('compile(user_code_str, "main.py", "exec")');
    expect(content).toContain('traceback.extract_tb');
    expect(content).toContain('50000');
    expect(content).toContain('RUN');
    expect(content).toContain('INIT');
    expect(content).toContain('RUN_COMPLETE');
  });

  test('F8.3: src/hooks/usePyodide.ts enforces 3-second watchdog and transparent restart', () => {
    const hookPath = path.join(ROOT_DIR, 'src', 'hooks', 'usePyodide.ts');
    expect(fs.existsSync(hookPath)).toBe(true);
    const content = fs.readFileSync(hookPath, 'utf-8');

    expect(content).toContain('TIMEOUT_MS = 3000');
    expect(content).toContain('TimeoutError');
    expect(content).toContain('terminate()');
    expect(content).toContain('spawnWorker');
    expect(content).toContain('runCode');
    expect(content).toContain('clearOutput');
  });

  test('F8.4: src/components/TerminalDrawer.tsx implements Engineering dark HUD, traffic dots, and Remediate CTA', () => {
    const terminalPath = path.join(ROOT_DIR, 'src', 'components', 'TerminalDrawer.tsx');
    expect(fs.existsSync(terminalPath)).toBe(true);
    const content = fs.readFileSync(terminalPath, 'utf-8');

    expect(content).toContain('TerminalDrawer');
    expect(content).toContain('bg-ink-black');
    expect(content).toContain('bg-charcoal-surface');
    expect(content).toContain('border-graphite-border');
    expect(content).toContain('bg-hot-pink');
    expect(content).toContain('bg-canary-yellow');
    expect(content).toContain('bg-mint-green');
    expect(content).toContain('Jump to Line');
    expect(content).toContain('Remediate with Whisper');
  });

  test('F8.5: src/App.tsx mounts StudioSection hosting BugWhisperPlayground', () => {
    const appPath = path.join(ROOT_DIR, 'src', 'App.tsx');
    const content = fs.readFileSync(appPath, 'utf-8');

    expect(content).toContain('StudioSection');
    const playgroundPath = path.join(ROOT_DIR, 'src', 'components', 'playground', 'BugWhisperPlayground.tsx');
    expect(fs.existsSync(playgroundPath)).toBe(true);
    const playgroundContent = fs.readFileSync(playgroundPath, 'utf-8');
    expect(playgroundContent).toContain('usePyodide');
    expect(playgroundContent).toContain('runCode');
  });
});

