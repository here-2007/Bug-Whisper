import { describe, test, expect, setTier } from './fixtures/test-framework';
import { loadPresetsModule, loadInferenceModule, loadDiffModule } from './fixtures/module-loader';
import { runPythonHarness } from './fixtures/harness-runner';

setTier(4);

// ============================================================================
// W1: Real-World 7 Classic Bug Workload Remediation & Execution Suite
// ============================================================================
describe('W1: Real-World Workload Execution — All 7 Classic Bugs', () => {
  test('W1.1: Workload 1 — IndexError: List Out of Bounds remediation and verification', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();
    const { executeMockInference } = await loadInferenceModule();
    const { generateUnifiedDiff } = await loadDiffModule();

    const preset = BUG_PRESETS.find((p) => p.id === 'index-error')!;

    // 1. Execute buggy code in real Python runtime
    const buggyRun = runPythonHarness(preset.buggyCode);
    expect(buggyRun.success).toBe(false);
    expect(buggyRun.errorType).toBe('IndexError');
    expect(buggyRun.stderr).toContain('IndexError: list index out of range');

    // 2. Synthesize fix via inference engine
    const fixedCode = await executeMockInference({
      code: preset.buggyCode,
      stderr: buggyRun.stderr,
      presetId: preset.id,
    });
    expect(fixedCode).toContain('if 0 <= index < len(roles):');

    // 3. Diff verification
    const diff = generateUnifiedDiff(preset.buggyCode, fixedCode);
    expect(diff).toContain('+    if 0 <= index < len(roles):');

    // 4. Execute fixed code in real Python runtime
    const fixedRun = runPythonHarness(fixedCode);
    expect(fixedRun.success).toBe(true);
    expect(fixedRun.errorType).toBeNull();
    expect(fixedRun.stdout).toContain('Role: guest');
  });

  test('W1.2: Workload 2 — TypeError: NoneType Subscript remediation and verification', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();
    const { executeMockInference } = await loadInferenceModule();
    const { generateUnifiedDiff } = await loadDiffModule();

    const preset = BUG_PRESETS.find((p) => p.id === 'nonetype-subscript')!;

    // 1. Execute buggy code
    const buggyRun = runPythonHarness(preset.buggyCode);
    expect(buggyRun.success).toBe(false);
    expect(buggyRun.errorType).toBe('TypeError');
    expect(buggyRun.stderr).toContain("'NoneType' object is not subscriptable");

    // 2. Inference fix
    const fixedCode = await executeMockInference({
      code: preset.buggyCode,
      stderr: buggyRun.stderr,
      presetId: preset.id,
    });
    expect(fixedCode).toContain('if profile is None:');

    // 3. Diff check
    const diff = generateUnifiedDiff(preset.buggyCode, fixedCode);
    expect(diff).toContain('+    if profile is None:');

    // 4. Fixed code execution
    const fixedRun = runPythonHarness(fixedCode);
    expect(fixedRun.success).toBe(true);
    expect(fixedRun.stdout).toContain('User email: noreply@example.com');
  });

  test('W1.3: Workload 3 — Logic: Mutable Default Argument remediation and verification', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();
    const { executeMockInference } = await loadInferenceModule();
    const { generateUnifiedDiff } = await loadDiffModule();

    const preset = BUG_PRESETS.find((p) => p.id === 'mutable-default')!;

    // 1. Execute buggy code
    const buggyRun = runPythonHarness(preset.buggyCode);
    expect(buggyRun.success).toBe(false);
    expect(buggyRun.errorType).toBe('AssertionError');
    expect(buggyRun.errorMessage).toContain('Expected 1 item, got 2');

    // 2. Inference fix
    const fixedCode = await executeMockInference({
      code: preset.buggyCode,
      stderr: buggyRun.stderr,
      presetId: preset.id,
    });
    expect(fixedCode).toContain('log=None');

    // 3. Diff check
    const diff = generateUnifiedDiff(preset.buggyCode, fixedCode);
    expect(diff).toContain('-def register_event(event_name, log=[]):');
    expect(diff).toContain('+def register_event(event_name, log=None):');

    // 4. Fixed code execution
    const fixedRun = runPythonHarness(fixedCode);
    expect(fixedRun.success).toBe(true);
    expect(fixedRun.stdout).toContain('All assertions passed!');
  });

  test('W1.4: Workload 4 — KeyError: Missing Dictionary Key remediation and verification', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();
    const { executeMockInference } = await loadInferenceModule();
    const { generateUnifiedDiff } = await loadDiffModule();

    const preset = BUG_PRESETS.find((p) => p.id === 'key-error')!;

    // 1. Execute buggy code
    const buggyRun = runPythonHarness(preset.buggyCode);
    expect(buggyRun.success).toBe(false);
    expect(buggyRun.errorType).toBe('KeyError');
    expect(buggyRun.errorMessage).toContain('timeout_seconds');

    // 2. Inference fix
    const fixedCode = await executeMockInference({
      code: preset.buggyCode,
      stderr: buggyRun.stderr,
      presetId: preset.id,
    });
    expect(fixedCode).toContain('.get("timeout_seconds", 30)');

    // 3. Diff check
    const diff = generateUnifiedDiff(preset.buggyCode, fixedCode);
    expect(diff).toContain('+    return config.get("timeout_seconds", 30)');

    // 4. Fixed code execution
    const fixedRun = runPythonHarness(fixedCode);
    expect(fixedRun.success).toBe(true);
    expect(fixedRun.stdout).toContain('Timeout: 30s');
  });

  test('W1.5: Workload 5 — ZeroDivisionError: Division by Zero remediation and verification', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();
    const { executeMockInference } = await loadInferenceModule();
    const { generateUnifiedDiff } = await loadDiffModule();

    const preset = BUG_PRESETS.find((p) => p.id === 'zero-division')!;

    // 1. Execute buggy code
    const buggyRun = runPythonHarness(preset.buggyCode);
    expect(buggyRun.success).toBe(false);
    expect(buggyRun.errorType).toBe('ZeroDivisionError');

    // 2. Inference fix
    const fixedCode = await executeMockInference({
      code: preset.buggyCode,
      stderr: buggyRun.stderr,
      presetId: preset.id,
    });
    expect(fixedCode).toContain('elapsed_seconds <= 0');

    // 3. Diff check
    const diff = generateUnifiedDiff(preset.buggyCode, fixedCode);
    expect(diff).toContain('+    if elapsed_seconds <= 0:');

    // 4. Fixed code execution
    const fixedRun = runPythonHarness(fixedCode);
    expect(fixedRun.success).toBe(true);
    expect(fixedRun.stdout).toContain('Throughput: inf B/s');
  });

  test('W1.6: Workload 6 — UnboundLocalError: Scoped Assignment remediation and verification', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();
    const { executeMockInference } = await loadInferenceModule();
    const { generateUnifiedDiff } = await loadDiffModule();

    const preset = BUG_PRESETS.find((p) => p.id === 'unbound-local')!;

    // 1. Execute buggy code
    const buggyRun = runPythonHarness(preset.buggyCode);
    expect(buggyRun.success).toBe(false);
    expect(buggyRun.errorType).toBe('UnboundLocalError');

    // 2. Inference fix
    const fixedCode = await executeMockInference({
      code: preset.buggyCode,
      stderr: buggyRun.stderr,
      presetId: preset.id,
    });
    expect(fixedCode).toContain('global counter');

    // 3. Diff check
    const diff = generateUnifiedDiff(preset.buggyCode, fixedCode);
    expect(diff).toContain('+    global counter');

    // 4. Fixed code execution
    const fixedRun = runPythonHarness(fixedCode);
    expect(fixedRun.success).toBe(true);
    expect(fixedRun.stdout).toContain('Result: 11');
  });

  test('W1.7: Workload 7 — SyntaxError: Missing Colon remediation and verification', async () => {
    const { BUG_PRESETS } = await loadPresetsModule();
    const { executeMockInference } = await loadInferenceModule();
    const { generateUnifiedDiff } = await loadDiffModule();

    const preset = BUG_PRESETS.find((p) => p.id === 'syntax-error')!;

    // 1. Execute buggy code (compile time syntax failure)
    const buggyRun = runPythonHarness(preset.buggyCode);
    expect(buggyRun.success).toBe(false);
    expect(buggyRun.errorType).toBe('SyntaxError');
    expect(buggyRun.lineNumber).toBe(1);

    // 2. Inference fix
    const fixedCode = await executeMockInference({
      code: preset.buggyCode,
      stderr: buggyRun.stderr,
      presetId: preset.id,
    });
    expect(fixedCode).toContain('def validate_payload(data):');

    // 3. Diff check
    const diff = generateUnifiedDiff(preset.buggyCode, fixedCode);
    expect(diff).toContain('-def validate_payload(data)');
    expect(diff).toContain('+def validate_payload(data):');

    // 4. Fixed code execution
    const fixedRun = runPythonHarness(fixedCode);
    expect(fixedRun.success).toBe(true);
    expect(fixedRun.stdout).toContain('Valid: False');
  });
});
