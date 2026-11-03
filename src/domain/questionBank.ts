export type ActivityKind = 'flashcards' | 'quiz' | 'fill-blank' | 'anagram' | 'unjumble';

export interface ActivityBase {
  id: string;
  classId?: string;
  title: string;
  enabled: boolean;
  imageId?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  imageId?: string;
}

export interface FlashcardActivity extends ActivityBase {
  kind: 'flashcards';
  cards: Flashcard[];
}

export interface QuizActivity extends ActivityBase {
  kind: 'quiz';
  prompt: string;
  correctAnswer: string;
  wrongAnswers: [string, string, string];
}

export interface WordActivity extends ActivityBase {
  kind: 'fill-blank' | 'anagram' | 'unjumble';
  prompt: string;
  answer: string;
  hint?: string;
}

export type LearningActivity = FlashcardActivity | QuizActivity | WordActivity;

export interface QuestionBank {
  version: 1;
  activities: LearningActivity[];
}

export const createQuestionBank = (): QuestionBank => ({ version: 1, activities: [] });

export const normalizeAnswer = (answer: string): string => answer.trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi');

export const shuffledQuizOptions = (activity: QuizActivity, random: () => number = Math.random): string[] => {
  const options = [activity.correctAnswer, ...activity.wrongAnswers];
  for (let index = options.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [options[index], options[other]] = [options[other], options[index]];
  }
  return options;
};

export const validateActivity = (activity: LearningActivity): string[] => {
  const issues: string[] = [];
  if (!activity.title.trim()) issues.push('Bộ nội dung cần có tên.');
  if (activity.kind === 'flashcards') {
    if (activity.cards.length < 1 || activity.cards.length > 7) issues.push('Flashcards cần từ 1 đến 7 thẻ.');
    activity.cards.forEach((card, index) => {
      if (!card.front.trim() && !card.imageId) issues.push(`Thẻ ${index + 1} cần ảnh hoặc nội dung mặt trước.`);
      if (!card.back.trim()) issues.push(`Thẻ ${index + 1} cần đáp án/mặt sau.`);
    });
  }
  if (activity.kind === 'quiz') {
    const options = [activity.correctAnswer, ...activity.wrongAnswers].map(normalizeAnswer);
    if (!activity.prompt.trim()) issues.push('Quiz cần có câu hỏi.');
    if (options.some((option) => !option)) issues.push('Quiz cần đủ 1 đáp án đúng và 3 đáp án sai.');
    if (new Set(options).size !== options.length) issues.push('Bốn đáp án Quiz phải khác nhau.');
  }
  if (activity.kind === 'fill-blank' || activity.kind === 'anagram' || activity.kind === 'unjumble') {
    if (!activity.prompt.trim()) issues.push('Bài điền khuyết cần có câu hỏi.');
    if (!activity.answer.trim()) issues.push('Bài điền khuyết cần có đáp án.');
  }
  return issues;
};

export const eligibleActivities = (bank: QuestionBank, classId: string): LearningActivity[] =>
  bank.activities.filter((activity) => activity.enabled && (!activity.classId || activity.classId === classId) && validateActivity(activity).length === 0);

export const isCorrectWordAnswer = (submitted: string, activity: WordActivity): boolean => normalizeAnswer(submitted) === normalizeAnswer(activity.answer);
