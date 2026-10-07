export interface TestCase {
  tier: number;
  suiteName: string;
  testName: string;
  fn: () => void | Promise<void>;
}

export interface TestResult {
  tier: number;
  suiteName: string;
  testName: string;
  passed: boolean;
  durationMs: number;
  error?: Error;
}

export const registeredSuites: {
  tier: number;
  name: string;
  tests: { name: string; fn: () => void | Promise<void> }[];
}[] = [];

let currentTier = 1;
let currentSuite: {
  tier: number;
  name: string;
  tests: { name: string; fn: () => void | Promise<void> }[];
} | null = null;

export function setTier(tier: number) {
  currentTier = tier;
}

export function describe(name: string, fn: () => void) {
  const previousSuite = currentSuite;
  currentSuite = {
    tier: currentTier,
    name,
    tests: [],
  };
  registeredSuites.push(currentSuite);
  fn();
  currentSuite = previousSuite;
}

export function test(name: string, fn: () => void | Promise<void>) {
  if (!currentSuite) {
    currentSuite = {
      tier: currentTier,
      name: 'Default Suite',
      tests: [],
    };
    registeredSuites.push(currentSuite);
  }
  currentSuite.tests.push({ name, fn });
}

export function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected: any) {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(expected);
      if (a !== b) {
        throw new Error(`Expected equality:\nExpected: ${b}\nReceived: ${a}`);
      }
    },
    toContain(expectedSubstring: string) {
      if (typeof actual !== 'string' && !Array.isArray(actual)) {
        throw new Error(`Expected string or array, received ${typeof actual}`);
      }
      if (!actual.includes(expectedSubstring)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(expectedSubstring)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy, received ${JSON.stringify(actual)}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy, received ${JSON.stringify(actual)}`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null, received ${JSON.stringify(actual)}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (typeof actual !== 'number' || actual <= expected) {
        throw new Error(`Expected ${actual} > ${expected}`);
      }
    },
    toBeLessThan(expected: number) {
      if (typeof actual !== 'number' || actual >= expected) {
        throw new Error(`Expected ${actual} < ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number) {
      if (typeof actual !== 'number' || actual < expected) {
        throw new Error(`Expected ${actual} >= ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected: number) {
      if (typeof actual !== 'number' || actual > expected) {
        throw new Error(`Expected ${actual} <= ${expected}`);
      }
    },
    toMatch(regex: RegExp) {
      if (typeof actual !== 'string' || !regex.test(actual)) {
        throw new Error(`Expected "${actual}" to match regex ${regex}`);
      }
    },
    toThrow() {
      if (typeof actual !== 'function') {
        throw new Error('Expected a function to test for throw');
      }
      let threw = false;
      try {
        actual();
      } catch {
        threw = true;
      }
      if (!threw) {
        throw new Error('Expected function to throw, but it did not throw');
      }
    },
  };
}
