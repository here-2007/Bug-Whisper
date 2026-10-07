/**
 * SFT ChatML Prompt Oracle & Response Code Extractor.
 * Strictly aligned with context.md training profile and length distribution.
 */

export const SYSTEM_PROMPT =
  'You are an expert Python bug-fixing assistant. Fix all errors in the provided code and return only the corrected Python code.';

/**
 * Builds user turn prompt preserving exact training formatting.
 * Strictly truncates stderr to 300 characters to match SFT length distribution.
 */
export function buildUserPrompt(code: string, stderr: string): string {
  const truncatedStderr = stderr ? stderr.slice(0, 300).trim() : 'No error output';
  return `Fix the bug in this Python code:\n\n\`\`\`python\n${code.trim()}\n\`\`\`\n\nError output:\n\`\`\`\n${truncatedStderr}\n\`\`\``;
}

/**
 * Formats full raw ChatML prompt for endpoints requiring raw text.
 */
export function formatRawChatML(code: string, stderr: string): string {
  return `<|im_start|>system\n${SYSTEM_PROMPT}<|im_end|>\n<|im_start|>user\n${buildUserPrompt(code, stderr)}<|im_end|>\n<|im_start|>assistant\n\`\`\`python\n`;
}

/**
 * Deterministically extracts clean Python code from model responses.
 * Handles markdown fences, unclosed streaming fences, and special stop tokens.
 */
export function extractPythonCode(rawResponse: string): string {
  if (!rawResponse) return '';

  // 1. Full python markdown block
  const pyBlockMatch = rawResponse.match(/```(?:python|py)\r?\n([\s\S]*?)```/i);
  if (pyBlockMatch && pyBlockMatch[1] !== undefined) {
    return pyBlockMatch[1].trim();
  }

  // 2. Generic markdown code block
  const genericMatch = rawResponse.match(/```\r?\n([\s\S]*?)```/);
  if (genericMatch && genericMatch[1] !== undefined) {
    return genericMatch[1].trim();
  }

  // 3. Unclosed streaming code fence (e.g. ```python\n...)
  const unclosedMatch = rawResponse.match(/```(?:python|py)?\r?\n([\s\S]*)$/i);
  if (unclosedMatch && unclosedMatch[1] !== undefined) {
    return unclosedMatch[1].replace(/<\|im_end\|>|<\|endoftext\|>/g, '').trim();
  }

  // 4. Raw code fallback: strip stop tokens
  return rawResponse
    .replace(/<\|im_start|>assistant\r?\n?/g, '')
    .replace(/<\|im_end\|>|<\|endoftext\|>/g, '')
    .trim();
}
