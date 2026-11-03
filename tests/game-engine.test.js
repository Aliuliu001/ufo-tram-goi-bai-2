import test from 'node:test';
import assert from 'node:assert/strict';
import { createRound, pickNextStudent } from '../js/game-engine.js';

test('calls every student once before the round is complete', () => {
  let round = createRound(['An', 'Bình', 'Chi']);
  const called = [];

  for (let index = 0; index < 3; index += 1) {
    const result = pickNextStudent(round, () => 0);
    called.push(result.student);
    round = result.round;
  }

  assert.deepEqual(called, ['An', 'Bình', 'Chi']);
  assert.equal(round.isComplete, true);
});

test('returns no student after every student was called', () => {
  const round = { remaining: [], called: ['An'], isComplete: true };
  const result = pickNextStudent(round, () => 0.5);

  assert.equal(result.student, null);
  assert.equal(result.round.isComplete, true);
});
