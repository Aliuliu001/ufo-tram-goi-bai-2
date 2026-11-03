import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseScanWinners, clampPickCount, scanTargetAt } from '../js/scan-round.js';

test('limits pick count to available students', () => {
  assert.equal(clampPickCount(0, 4), 1);
  assert.equal(clampPickCount(9, 4), 4);
});

test('chooses distinct winners while no-repeat is enabled', () => {
  const winners = chooseScanWinners(['An', 'Bình', 'Chi'], 2, () => 0);
  assert.deepEqual(winners, ['An', 'Bình']);
});

test('scanning target changes before revealing the final winner', () => {
  const target = scanTargetAt(['An', 'Bình', 'Chi'], 3, 3);
  assert.equal(target, 'Bình');
});
