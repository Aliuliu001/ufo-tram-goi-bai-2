import test from 'node:test';
import assert from 'node:assert/strict';

test('suspense sound module exports the scan sound controls', async () => {
  const sound = await import('../js/suspense-sound.js');
  assert.equal(typeof sound.startChase, 'function');
  assert.equal(typeof sound.stopChase, 'function');
  assert.equal(typeof sound.ping, 'function');
  assert.equal(typeof sound.reveal, 'function');
});
