import test from 'node:test';
import assert from 'node:assert/strict';
import { panicSpeed, escapeMove } from '../js/movement-profile.js';

test('panic run stays readable instead of sprinting across the map', () => {
  // V9: Giảm base speed để nhìn rõ, tăng panic multiplier để kịch tính
  assert.ok(panicSpeed(0) >= 1.5 && panicSpeed(0) <= 2); // Base speed giảm
  assert.ok(panicSpeed(1) >= 3.5 && panicSpeed(1) <= 4.5); // Panic max vẫn nhanh
});

test('escape move cycles through dodge tumble and hide actions', () => {
  assert.equal(escapeMove(0), 'dodge');
  assert.equal(escapeMove(1), 'tumble');
  assert.equal(escapeMove(2), 'hide');
});
