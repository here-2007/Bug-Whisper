import { registeredSuites, TestResult } from './fixtures/test-framework';

async function main() {
  console.log('\n===============================================================');
  console.log('  BUG WHISPER WEB STUDIO — 4-TIER E2E TEST SUITE RUNNER');
  console.log('===============================================================\n');

  // Load all test tier suites
  await import('./tier1-feature-coverage.test');
  await import('./tier2-boundary-corner.test');
  await import('./tier3-pairwise-flows.test');
  await import('./tier4-real-world-workloads.test');

  // Parse CLI args
  const args = process.argv.slice(2);
  let tierFilter: number | null = null;
  const tierArg = args.find((a) => a.startsWith('--tier='));
  if (tierArg) {
    tierFilter = parseInt(tierArg.split('=')[1], 10);
  }

  const results: TestResult[] = [];
  let totalPassed = 0;
  let totalFailed = 0;
  const suiteStartTime = Date.now();

  const suitesToRun = tierFilter
    ? registeredSuites.filter((s) => s.tier === tierFilter)
    : registeredSuites;

  let currentTierDisplay = -1;

  for (const suite of suitesToRun) {
    if (suite.tier !== currentTierDisplay) {
      currentTierDisplay = suite.tier;
      console.log(`\n---------------------------------------------------------------`);
      console.log(`  TIER ${currentTierDisplay} EXECUTION`);
      console.log(`---------------------------------------------------------------`);
    }

    console.log(`\n  ▶ ${suite.name}`);

    for (const testItem of suite.tests) {
      const testStart = Date.now();
      try {
        await testItem.fn();
        const duration = Date.now() - testStart;
        results.push({
          tier: suite.tier,
          suiteName: suite.name,
          testName: testItem.name,
          passed: true,
          durationMs: duration,
        });
        totalPassed++;
        console.log(`    ✔ PASS (${duration}ms) ${testItem.name}`);
      } catch (err: any) {
        const duration = Date.now() - testStart;
        results.push({
          tier: suite.tier,
          suiteName: suite.name,
          testName: testItem.name,
          passed: false,
          durationMs: duration,
          error: err,
        });
        totalFailed++;
        console.log(`    ✖ FAIL (${duration}ms) ${testItem.name}`);
        console.log(`      Error: ${err.message}`);
      }
    }
  }

  const totalDuration = Date.now() - suiteStartTime;

  console.log('\n===============================================================');
  console.log('  TEST SUMMARY');
  console.log('===============================================================');

  // Group by tier
  for (let t = 1; t <= 4; t++) {
    const tierResults = results.filter((r) => r.tier === t);
    if (tierResults.length === 0) continue;
    const tierPassed = tierResults.filter((r) => r.passed).length;
    const tierFailed = tierResults.filter((r) => !r.passed).length;
    const status = tierFailed === 0 ? '✔ ALL PASS' : '✖ HAS FAILURES';
    console.log(
      `  Tier ${t}: ${tierPassed} passed, ${tierFailed} failed (${tierResults.length} total) — ${status}`
    );
  }

  console.log('---------------------------------------------------------------');
  console.log(`  Total Tests: ${results.length}`);
  console.log(`  Passed:      ${totalPassed}`);
  console.log(`  Failed:      ${totalFailed}`);
  console.log(`  Duration:    ${(totalDuration / 1000).toFixed(2)}s`);
  console.log('===============================================================\n');

  if (totalFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
