export const normalizeWord = value => String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi');

export function parseImageWordPairs(text) {
  const seenImages = new Set();
  const seenWords = new Set();
  const pairs = [];
  const issues = [];
  String(text || '').split('\n').forEach((line, index) => {
    if (!line.trim()) return;
    const [imageId, ...wordParts] = line.split('|');
    const image = String(imageId || '').trim();
    const word = wordParts.join('|').trim();
    if (!image || !word) {
      issues.push(`Dòng ${index + 1} cần đủ Ảnh ID | Từ.`);
      return;
    }
    const normalized = normalizeWord(word);
    if (seenImages.has(image)) issues.push(`Ảnh ID "${image}" bị trùng.`);
    else if (seenWords.has(normalized)) issues.push(`Từ "${word}" bị trùng.`);
    else {
      seenImages.add(image);
      seenWords.add(normalized);
      pairs.push({ imageId: image, word });
    }
  });
  return { pairs, issues };
}

export function makeImageWordQuiz(pairs, random = Math.random) {
  const unique = (pairs || []).filter((pair, index, list) => pair?.imageId && pair?.word && list.findIndex(x => normalizeWord(x.word) === normalizeWord(pair.word)) === index);
  if (unique.length < 4) return null;
  const pick = list => list[Math.floor(random() * list.length)];
  const correct = pick(unique);
  const distractors = [...unique.filter(pair => pair !== correct)];
  for (let i = distractors.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
  }
  const options = [correct.word, ...distractors.slice(0, 3).map(pair => pair.word)];
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { imageId: correct.imageId, correctWord: correct.word, options };
}
