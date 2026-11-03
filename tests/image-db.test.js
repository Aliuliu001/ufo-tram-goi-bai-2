import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAssetId } from '../src/data/imageDB.ts';

test('normalizes teacher image identifiers', () => {
  assert.equal(normalizeAssetId(' 12.PNG '), '12');
  assert.equal(normalizeAssetId(' Boss Card 05.webp'), 'boss-card-05');
});
