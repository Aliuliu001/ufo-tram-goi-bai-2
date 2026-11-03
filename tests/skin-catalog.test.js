import test from 'node:test';
import assert from 'node:assert/strict';
import { UFO_SKINS, CREW_SKINS, getUfoSkin, getCrewSkin } from '../js/skin-catalog.js';

test('catalog has at least four UFO skins', () => {
  assert.ok(UFO_SKINS.length >= 4);
});

test('catalog has at least four crew skins', () => {
  assert.ok(CREW_SKINS.length >= 4);
});

test('UFO skin IDs are unique', () => {
  const ids = UFO_SKINS.map(s => s.id);
  const unique = new Set(ids);
  assert.equal(ids.length, unique.size);
});

test('crew skin IDs are unique', () => {
  const ids = CREW_SKINS.map(s => s.id);
  const unique = new Set(ids);
  assert.equal(ids.length, unique.size);
});

test('getUfoSkin returns first skin as fallback', () => {
  const fallback = getUfoSkin('nonexistent');
  assert.equal(fallback.id, UFO_SKINS[0].id);
});

test('getCrewSkin returns first skin as fallback', () => {
  const fallback = getCrewSkin('nonexistent');
  assert.equal(fallback.id, CREW_SKINS[0].id);
});

test('getUfoSkin finds existing skin by ID', () => {
  const skin = getUfoSkin('rescue');
  assert.equal(skin.name, 'Đội cứu hộ Ngân Hà');
});

test('getCrewSkin finds existing skin by ID', () => {
  const skin = getCrewSkin('animals');
  assert.equal(skin.name, 'Biệt đội động vật');
});
