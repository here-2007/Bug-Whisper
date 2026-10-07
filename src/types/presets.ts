export type PresetCategory = 'Runtime' | 'Type' | 'Logic' | 'Syntax';

export interface BugPreset {
  id: string;
  name: string;
  exceptionType: string;
  category: PresetCategory;
  badgeColor: string;
  summary: string;
  buggyCode: string;
  expectedStderr: string;
  offendingLine: number;
  fixedCode: string;
  explanation: string;
}
