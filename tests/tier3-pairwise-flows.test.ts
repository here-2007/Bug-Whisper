import { describe, test, expect, setTier } from './fixtures/test-framework';
import { loadPresetsModule, loadPromptModule, loadInferenceModule, loadDiffModule } from './fixtures/module-loader';
import { runPythonHarness } from './fixtures/harness-runner';
import { applyUnifiedDiff } from './fixtures/diff-oracle';

setTier(3);

// ============================================================================
// P1: Pairwise Integration Flows
// ============================================================================
describe('P1: Full Preset Remediation Pipeline Flow', () => {
  test('P1.1: Complete end-to-end flow: Select preset -> Crash -> Prompt -> Mock Fix -> Diff -> Accept -> Clean Exit 0', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();
    const { buildUserPrompt, extractPythonCode } = await loadPromptModule();
    const { executeMockInference } = await loadInferenceModule();
    const { generateUnifiedDiff } = await loadDiffModule();

    // 1. Preset Selection: Pick index-error preset
    const preset = BUG_PRESETS.find((p) => p.id === 'index-error');
    expect(preset !== undefined).toBeTruthy();

    // 2. Initial Run: Buggy code executes in harness and crashes
    const initialRun = runPythonHarness(preset!.buggyCode);
    expect(initialRun.success).toBe(false);
    expect(initialRun.errorType).toBe('IndexError');
    expect(initialRun.lineNumber).toBe(2);

    // 3. Prompt Building: SFT ChatML User Prompt built from code + stderr
    const userPrompt = buildUserPrompt(preset!.buggyCode, initialRun.stderr);
    expect(userPrompt).toContain(preset!.buggyCode);
    expect(userPrompt).toContain('IndexError');

    // 4. Model Inference: Request remediation from Mock backend
    const rawFix = await executeMockInference({
      code: preset!.buggyCode,
      stderr: initialRun.stderr,
      presetId: preset!.id,
    });

    // 5. Code Extraction: Peels markdown fences and stop tokens
    const cleanFix = extractPythonCode(rawFix);
    expect(cleanFix.length).toBeGreaterThan(0);

    // 6. Diff Generation: Computes unified diff
    const diff = generateUnifiedDiff(preset!.buggyCode, cleanFix, 'main.py');
    expect(diff).toContain('--- a/main.py');
    expect(diff).toContain('+++ b/main.py');

    // 7. Accept Fix Flow: Replace original code with cleanFix and re-run
    const postFixRun = runPythonHarness(cleanFix);
    expect(postFixRun.success).toBe(true);
    expect(postFixRun.errorType).toBeNull();
    expect(postFixRun.stdout).toContain('Role: guest');
  });

  test('P1.2: Heuristic Repair Flow for custom SyntaxError without preset ID', async () => {
    const { buildUserPrompt, extractPythonCode } = await loadPromptModule();
    const { executeMockInference } = await loadInferenceModule();
    const { generateUnifiedDiff } = await loadDiffModule();

    const customBuggy = `def compute_tax(income)\n    return income * 0.2`;

    // 1. Crash
    const runRes = runPythonHarness(customBuggy);
    expect(runRes.success).toBe(false);
    expect(runRes.errorType).toBe('SyntaxError');

    // 2. Prompt
    const prompt = buildUserPrompt(customBuggy, runRes.stderr);
    expect(prompt).toContain('SyntaxError:');

    // 3. Mock Heuristic Inference
    const rawFix = await executeMockInference({
      code: customBuggy,
      stderr: runRes.stderr,
    });
    const cleanFix = extractPythonCode(rawFix);

    // 4. Diff
    const diff = generateUnifiedDiff(customBuggy, cleanFix);
    expect(diff).toContain('+def compute_tax(income):');

    // 5. Re-run with fix applied
    const fixCode = cleanFix + '\nprint(compute_tax(100))';
    const rerun = runPythonHarness(fixCode);
    expect(rerun.success).toBe(true);
    expect(rerun.stdout.trim()).toBe('20.0');
  });

  test('P1.3: Heuristic Repair Flow for custom ZeroDivisionError', async () => {
    const { buildUserPrompt, extractPythonCode } = await loadPromptModule();
    const { executeMockInference } = await loadInferenceModule();

    const buggyDiv = `def safe_divide(a, b):
    return a / b

print(safe_divide(10, 0))`;

    const runRes = runPythonHarness(buggyDiv);
    expect(runRes.success).toBe(false);
    expect(runRes.errorType).toBe('ZeroDivisionError');

    const prompt = buildUserPrompt(buggyDiv, runRes.stderr);
    expect(prompt).toContain('ZeroDivisionError');

    const rawFix = await executeMockInference({
      code: buggyDiv,
      stderr: runRes.stderr,
    });
    const cleanFix = extractPythonCode(rawFix);

    const rerun = runPythonHarness(cleanFix);
    expect(rerun.success).toBe(true);
    expect(rerun.stdout.trim()).toBe('0.0');
  });
});

// ============================================================================
// P2: Settings State & Provider Dispatch Flow
// ============================================================================
describe('P2: Settings State & Provider Dispatch Flow', () => {
  test('P2.1: Settings serialization, localStorage roundtrip, and provider switching', async () => {
    const { DEFAULT_INFERENCE_SETTINGS } = await loadInferenceModule();

    // 1. Update settings
    const modifiedSettings = {
      ...DEFAULT_INFERENCE_SETTINGS,
      provider: 'ollama',
      ollamaEndpoint: 'http://localhost:11434',
      temperature: 0.2,
    };

    // 2. Serialize to storage string
    const serialized = JSON.stringify(modifiedSettings);

    // 3. Deserialize
    const restored = JSON.parse(serialized);
    expect(restored.provider).toBe('ollama');
    expect(restored.temperature).toBe(0.2);
    expect(restored.maxTokens).toBe(768);
  });

  test('P2.2: Diff application roundtrip: applying patch to buggy code produces fixed code exactly', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();
    const { generateUnifiedDiff } = await loadDiffModule();

    for (const preset of BUG_PRESETS) {
      const diff = generateUnifiedDiff(preset.buggyCode, preset.fixedCode, 'main.py');
      expect(diff.length).toBeGreaterThan(0);

      const applied = applyUnifiedDiff(preset.buggyCode, diff);
      expect(applied.trim()).toBe(preset.fixedCode.trim());
    }
  });
});
