export type PyodideStatus = 'idle' | 'loading' | 'ready' | 'running' | 'error';

export interface ExecutionRequest {
  type: 'RUN';
  id: string;
  code: string;
}

export interface InitRequest {
  type: 'INIT';
}

export interface ResetRequest {
  type: 'RESET';
}

export type WorkerInboundMessage = InitRequest | ExecutionRequest | ResetRequest;

export interface ExecutionResult {
  id: string;
  success: boolean;
  stdout: string;
  stderr: string;
  errorType: string | null;
  errorMessage: string | null;
  lineNumber: number | null;
  traceback: string;
  executionTimeMs: number;
  isTimeout?: boolean;
}

export interface StatusMessage {
  type: 'STATUS';
  status: PyodideStatus;
  message?: string;
}

export interface RunCompleteMessage {
  type: 'RUN_COMPLETE';
  result: ExecutionResult;
}

export type WorkerOutboundMessage = StatusMessage | RunCompleteMessage;

export interface UsePyodideReturn {
  status: PyodideStatus;
  isExecuting: boolean;
  lastResult: ExecutionResult | null;
  runCode: (code: string) => Promise<ExecutionResult>;
  clearOutput: () => void;
}
