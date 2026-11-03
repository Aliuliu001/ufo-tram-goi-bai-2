import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createClass,
  updateClass,
  deleteClass,
  duplicateClass,
  exportClassesJSON,
  importClassesJSON,
  importClassesCSV
} from '../js/class-manager.js';

test('createClass generates unique ID and timestamp', () => {
  const cls1 = createClass('Test Class 1', ['Alice', 'Bob']);
  const cls2 = createClass('Test Class 2', ['Charlie']);
  
  assert.ok(cls1.id !== cls2.id);
  assert.equal(cls1.name, 'Test Class 1');
  assert.deepEqual(cls1.students, ['Alice', 'Bob']);
  assert.ok(cls1.lastUsed > 0);
});

test('updateClass modifies correct class', () => {
  const classes = [
    { id: 'c1', name: 'Class A', students: ['Alice'], lastUsed: 1000 },
    { id: 'c2', name: 'Class B', students: ['Bob'], lastUsed: 2000 }
  ];
  
  const updated = updateClass(classes, 'c1', { name: 'Class A Updated' });
  
  assert.equal(updated[0].name, 'Class A Updated');
  assert.deepEqual(updated[0].students, ['Alice']);
  assert.equal(updated[1].name, 'Class B');
  assert.ok(updated[0].lastUsed > 1000);
});

test('deleteClass prevents deleting last class', () => {
  const classes = [{ id: 'c1', name: 'Only Class', students: [] }];
  const result = deleteClass(classes, 'c1');
  
  assert.equal(result.length, 1);
});

test('deleteClass removes correct class', () => {
  const classes = [
    { id: 'c1', name: 'Class A', students: [] },
    { id: 'c2', name: 'Class B', students: [] }
  ];
  
  const result = deleteClass(classes, 'c1');
  
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'c2');
});

test('duplicateClass creates copy with new ID', () => {
  const classes = [
    { id: 'c1', name: 'Original', students: ['Alice', 'Bob'], lastUsed: 1000 }
  ];
  
  const result = duplicateClass(classes, 'c1');
  
  assert.equal(result.length, 2);
  assert.ok(result[1].name.includes('Sao chép'));
  assert.deepEqual(result[1].students, ['Alice', 'Bob']);
  assert.ok(result[1].id !== 'c1');
});

test('exportClassesJSON produces valid JSON', () => {
  const classes = [
    { id: 'c1', name: 'Test', students: ['Alice'], lastUsed: 1000 }
  ];
  
  const json = exportClassesJSON(classes);
  const parsed = JSON.parse(json);
  
  assert.ok(Array.isArray(parsed.classes));
  assert.equal(parsed.classes[0].name, 'Test');
  assert.ok(parsed.exportedAt);
});

test('importClassesJSON validates format', () => {
  const validJSON = JSON.stringify({
    classes: [{ id: 'c1', name: 'Test', students: ['Alice'] }]
  });
  
  const result = importClassesJSON(validJSON);
  
  assert.equal(result.success, true);
  assert.equal(result.classes[0].name, 'Test');
});

test('importClassesJSON rejects invalid format', () => {
  const result = importClassesJSON('{ "invalid": true }');
  
  assert.equal(result.success, false);
  assert.ok(result.error);
});

test('importClassesCSV parses valid CSV', () => {
  const csv = `Class 3A, Alice, Bob, Charlie
Class 3B, David, Eve`;
  
  const result = importClassesCSV(csv);
  
  assert.equal(result.success, true);
  assert.equal(result.classes.length, 2);
  assert.equal(result.classes[0].name, 'Class 3A');
  assert.deepEqual(result.classes[0].students, ['Alice', 'Bob', 'Charlie']);
});

test('importClassesCSV handles empty lines', () => {
  const csv = `
  Class A, Student1

  Class B, Student2
  `;
  
  const result = importClassesCSV(csv);
  
  assert.equal(result.success, true);
  assert.equal(result.classes.length, 2);
});
