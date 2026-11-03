import test from 'node:test';
import assert from 'node:assert/strict';
import {
  appendFlight,
  createSampleStore,
  getEligibleStudents,
  pickStudents,
  resetClassRound,
  selectClassroom,
} from '../src/domain/classroom.ts';

test('picks the configured number of unique active students', () => {
  const store = createSampleStore();
  store.settings.pickCount = 3;
  const result = pickStudents(store, () => 0.25);
  assert.equal(result.length, 3);
  assert.equal(new Set(result.map((student) => student.id)).size, 3);
});

test('does not repeat students in a no-repeat round', () => {
  const store = createSampleStore();
  store.settings.pickCount = 2;
  const firstFlight = pickStudents(store, () => 0.1);
  const afterFlight = appendFlight(store, firstFlight, '2026-11-03T00:00:00.000Z');
  const eligible = getEligibleStudents(afterFlight);
  assert.equal(eligible.some((student) => firstFlight.some((picked) => picked.id === student.id)), false);
});

test('allows previous students again when no-repeat is disabled', () => {
  const store = createSampleStore();
  const firstFlight = pickStudents(store, () => 0.1);
  const afterFlight = appendFlight(store, firstFlight, '2026-11-03T00:00:00.000Z');
  afterFlight.settings.noRepeat = false;
  assert.equal(getEligibleStudents(afterFlight).length, 8);
});

test('keeps round history separate for each classroom', () => {
  const store = createSampleStore();
  const firstFlight = pickStudents(store, () => 0.1);
  const withFlight = appendFlight(store, firstFlight, '2026-11-03T00:00:00.000Z');
  const otherClass = selectClassroom(withFlight, 'class-hazelnut');
  assert.equal(getEligibleStudents(otherClass).length, 8);
  assert.equal(otherClass.logs.length, 1);
});

test('resetting a round restores students only for its classroom', () => {
  const store = createSampleStore();
  const withFlight = appendFlight(store, pickStudents(store, () => 0.1), '2026-11-03T00:00:00.000Z');
  const reset = resetClassRound(withFlight);
  assert.equal(reset.logs.length, 0);
  assert.equal(getEligibleStudents(reset).length, 8);
});
