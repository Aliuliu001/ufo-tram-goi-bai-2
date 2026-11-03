import test from 'node:test';
import assert from 'node:assert/strict';
import { abductionProgress } from '../js/world3d-state.js';

test('abduction progress is zero before lifting begins', () => {
  assert.equal(abductionProgress(0), 0);
  assert.equal(abductionProgress(-1), 0);
});

test('abduction progress reaches one after its lift duration', () => {
  assert.equal(abductionProgress(1), 1);
  assert.equal(abductionProgress(3), 1);
});

test('abduction progress stays within zero and one', () => {
  assert.equal(abductionProgress(.5), .5);
});
