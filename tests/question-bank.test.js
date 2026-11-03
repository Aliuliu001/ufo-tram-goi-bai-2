import test from 'node:test';
import assert from 'node:assert/strict';
import { isCorrectWordAnswer, shuffledQuizOptions, validateActivity } from '../src/domain/questionBank.ts';

test('rejects a quiz with duplicate options', () => {
  const issues = validateActivity({ id: 'q1', title: 'Quiz', enabled: true, kind: 'quiz', prompt: '2 + 2?', correctAnswer: '4', wrongAnswers: ['3', '4', '5'] });
  assert.ok(issues.some((issue) => issue.includes('khác nhau')));
});

test('shuffles exactly one correct and three wrong answers', () => {
  const activity = { id: 'q1', title: 'Quiz', enabled: true, kind: 'quiz', prompt: 'Q', correctAnswer: 'Đúng', wrongAnswers: ['A', 'B', 'C'] };
  assert.deepEqual(new Set(shuffledQuizOptions(activity, () => 0.1)), new Set(['Đúng', 'A', 'B', 'C']));
});

test('word answers ignore harmless case and whitespace differences', () => {
  assert.equal(isCorrectWordAnswer('  Hành   tinh ', { id: 'w', title: 'W', enabled: true, kind: 'anagram', prompt: 'P', answer: 'hành tinh' }), true);
});
