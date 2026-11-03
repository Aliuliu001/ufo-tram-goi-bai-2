import test from 'node:test';
import assert from 'node:assert/strict';

async function scanTiming() {
  return import('../src/domain/scanTiming.ts');
}

test('scan duration accepts only 3, 6, 8, or 10 seconds', async () => {
  const { isScanSeconds, normalizeScanSeconds } = await scanTiming();
  assert.equal(isScanSeconds(3), true);
  assert.equal(isScanSeconds(6), true);
  assert.equal(isScanSeconds(8), true);
  assert.equal(isScanSeconds(10), true);
  assert.equal(isScanSeconds(5), false);
  assert.equal(normalizeScanSeconds(5), 6);
});

test('scan countdown never returns a negative second', async () => {
  const { remainingScanSeconds } = await scanTiming();
  assert.equal(remainingScanSeconds(10_000, 7_100), 3);
  assert.equal(remainingScanSeconds(10_000, 10_000), 0);
  assert.equal(remainingScanSeconds(10_000, 13_000), 0);
});
