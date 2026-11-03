import test from 'node:test';
import assert from 'node:assert/strict';
import { parseImageWordPairs, makeImageWordQuiz } from '../js/quiz-image-words.js';

test('parses image-word pairs and rejects duplicate words', () => {
  const valid = parseImageWordPairs('tao | apple\nchuoi | banana\nmeo | cat\ncho | dog');
  assert.equal(valid.issues.length, 0);
  assert.equal(valid.pairs.length, 4);
  assert.ok(parseImageWordPairs('tao | apple\nchuoi | Apple').issues.length);
});

test('creates image-word quiz with correct word and 3 distinct pool words', () => {
  const pairs = parseImageWordPairs('tao | apple\nchuoi | banana\nmeo | cat\ncho | dog\nca | fish').pairs;
  const quiz = makeImageWordQuiz(pairs, () => 0);
  assert.equal(quiz.options.length, 4);
  assert.equal(new Set(quiz.options).size, 4);
  assert.ok(quiz.options.includes(quiz.correctWord));
  assert.ok(pairs.some(pair => pair.imageId === quiz.imageId && pair.word === quiz.correctWord));
});

test('does not create quiz with fewer than four pairs', () => {
  assert.equal(makeImageWordQuiz(parseImageWordPairs('tao | apple\nchuoi | banana').pairs), null);
});
