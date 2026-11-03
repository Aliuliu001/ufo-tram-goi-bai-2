import { parseImageWordPairs, makeImageWordQuiz, normalizeWord } from './quiz-image-words.js?v=17';

const CARDS_KEY = 'ufo-question-bank-v1';
const PAIRS_KEY = 'ufo-image-word-pairs-v1';
const $ = (selector, root = document) => root.querySelector(selector);
const uid = () => `cards-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const loadCards = () => { try { const value = JSON.parse(localStorage.getItem(CARDS_KEY)); return Array.isArray(value.activities) ? value : { activities: [] }; } catch { return { activities: [] }; } };
const saveCards = activities => localStorage.setItem(CARDS_KEY, JSON.stringify({ activities }));
const loadPairs = () => { try { const value = JSON.parse(localStorage.getItem(PAIRS_KEY)); return Array.isArray(value.pairs) ? value.pairs : []; } catch { return []; } };
const getImage = async id => { try { const request = indexedDB.open('ufo-tram-goi-bai-images', 1); const db = await new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); return await new Promise((resolve, reject) => { const tx = db.transaction('images'); const read = tx.objectStore('images').get(id); read.onsuccess = () => { db.close(); resolve(read.result || null); }; read.onerror = () => { db.close(); reject(read.error); }; }); } catch { return null; } };
const shuffle = list => [...list].sort(() => Math.random() - .5);

export function mountQuestionBank(host) {
  host.innerHTML = `<div class="learning-tabs"><button type="button" data-tab="pairs">❓ Kho Input Quiz</button><button type="button" data-tab="cards">🃏 Bộ Flashcard</button></div><div class="learning-bank-content"></div>`;
  const content = $('.learning-bank-content', host);
  const select = tab => { host.querySelectorAll('[data-tab]').forEach(button => button.classList.toggle('active', button.dataset.tab === tab)); tab === 'pairs' ? renderPairs() : renderCards(); };
  host.querySelectorAll('[data-tab]').forEach(button => button.onclick = () => select(button.dataset.tab));
  const renderPairs = () => {
    const pairs = loadPairs();
    content.innerHTML = `<p class="muted"><b>Nhập mỗi dòng:</b> <code>Ảnh ID | từ</code>. Ví dụ: <code>trai-tao | apple</code>. Quiz sẽ đặt ảnh bên trái, 4 từ xáo ở bên phải (2×2).</p><textarea class="pairs-input" rows="10" aria-label="Kho Input Quiz">${pairs.map(pair => `${esc(pair.imageId)} | ${esc(pair.word)}`).join('\n')}</textarea><p class="pair-status">${pairs.length} cặp đã lưu · cần ít nhất 4 cặp để chơi Quiz.</p><button type="button" class="secondary-button" data-save-pairs>💾 Lưu Kho Input Quiz</button>`;
    $('[data-save-pairs]', content).onclick = () => { const parsed = parseImageWordPairs($('.pairs-input', content).value); if (parsed.issues.length) return alert(parsed.issues.join('\n')); if (parsed.pairs.length && parsed.pairs.length < 4) return alert('Quiz cần ít nhất 4 cặp Ảnh ID | Từ.'); localStorage.setItem(PAIRS_KEY, JSON.stringify({ pairs: parsed.pairs })); renderPairs(); };
  };
  const renderCards = () => {
    const activities = loadCards().activities.filter(item => item.kind === 'cards');
    content.innerHTML = `<div class="question-toolbar"><p class="muted">Bộ Flashcard đang bật sẽ được lấy ngẫu nhiên ở chế độ Flashcard.</p><button type="button" class="secondary-button" data-add>＋ Tạo bộ Flashcard</button></div><div class="question-list">${activities.map(item => `<article><div><strong>${esc(item.title)}</strong><small>${item.cards.length} thẻ · ${item.enabled ? 'Đang bật' : 'Đang tắt'}</small></div><button type="button" class="tiny-button" data-toggle="${item.id}">${item.enabled ? 'Tắt' : 'Bật'}</button><button type="button" class="tiny-button" data-remove="${item.id}">🗑️</button></article>`).join('') || '<p class="muted">Chưa có bộ Flashcard.</p>'}</div>`;
    $('[data-add]', content).onclick = openCardEditor;
    content.querySelectorAll('[data-toggle]').forEach(button => button.onclick = () => { const bank = loadCards(); const item = bank.activities.find(x => x.id === button.dataset.toggle); item.enabled = !item.enabled; saveCards(bank.activities); renderCards(); });
    content.querySelectorAll('[data-remove]').forEach(button => button.onclick = () => { if (!confirm('Xóa bộ Flashcard này?')) return; const bank = loadCards(); saveCards(bank.activities.filter(x => x.id !== button.dataset.remove)); renderCards(); });
  };
  const openCardEditor = () => {
    const dialog = $('#question-editor');
    dialog.innerHTML = `<form method="dialog" class="dialog-card question-form"><div class="dialog-head"><div><p class="eyebrow">FLASHCARD</p><h2>Tạo bộ thẻ</h2></div><button class="icon-button" value="cancel">×</button></div><label>Tên bộ<input name="title" placeholder="Ví dụ: Unit 5 - Food"></label><label>Mỗi dòng: Mặt trước | Đáp án<textarea name="cards" rows="7" placeholder="apple | quả táo&#10;banana | quả chuối"></textarea></label><div class="dialog-actions"><button class="secondary-button" value="cancel">Hủy</button><button class="primary-button" type="submit">Lưu Flashcard</button></div></form>`;
    const form = $('form', dialog);
    form.onsubmit = event => { event.preventDefault(); const data = new FormData(form); const cards = String(data.get('cards') || '').split('\n').filter(Boolean).map(line => { const [front, ...rest] = line.split('|'); return { front: front?.trim(), back: rest.join('|').trim() }; }); if (!String(data.get('title') || '').trim() || !cards.length || cards.length > 7 || cards.some(card => !card.front || !card.back)) return alert('Cần tên bộ và từ 1–7 dòng đúng dạng Mặt trước | Đáp án.'); const bank = loadCards(); bank.activities.push({ id: uid(), kind: 'cards', title: String(data.get('title')).trim(), cards, enabled: true }); saveCards(bank.activities); dialog.close(); renderCards(); };
    dialog.showModal();
  };
  select('pairs');
}

export async function runLearningActivity(classId, studentNames, onRelease, mode = 'flashcards') {
  if (mode === 'call-only') return onRelease();
  const dialog = $('#learning-dialog');
  const release = () => { dialog.close(); onRelease(); };
  if (mode === 'image-quiz') {
    const quiz = makeImageWordQuiz(loadPairs());
    if (!quiz) { alert('Quiz chưa có đủ 4 cặp Ảnh ID | Từ. UFO sẽ thả học sinh xuống.'); return onRelease(); }
    const asset = await getImage(quiz.imageId);
    if (!asset) { alert(`Chưa tìm thấy ảnh ID "${quiz.imageId}" trong Kho ảnh. UFO sẽ thả học sinh xuống.`); return onRelease(); }
    const src = URL.createObjectURL(asset.blob);
    dialog.innerHTML = `<form method="dialog" class="dialog-card learning-card image-word-quiz"><div class="dialog-head"><div><p class="eyebrow">QUIZ ẢNH → TỪ</p><h2>${esc(studentNames.join(' · '))}</h2><p class="muted">Nhìn hình và chọn từ đúng.</p></div></div><div class="quiz-split"><div class="quiz-question-image"><img src="${src}" alt="Hình câu hỏi"></div><div class="answer-options answer-options-grid">${quiz.options.map((word, index) => `<button type="button" data-answer="${index}">${esc(word)}</button>`).join('')}</div></div><p class="learning-feedback"></p></form>`;
    dialog.querySelectorAll('[data-answer]').forEach(button => button.onclick = () => { const correct = normalizeWord(quiz.options[Number(button.dataset.answer)]) === normalizeWord(quiz.correctWord); $('.learning-feedback', dialog).textContent = correct ? '✨ Chính xác! UFO sẽ thả bạn xuống.' : 'Chưa đúng — hãy thử lại.'; if (correct) { button.classList.add('correct'); setTimeout(release, 700); } });
    dialog.showModal(); return;
  }
  const items = loadCards().activities.filter(item => item.kind === 'cards' && item.enabled && (!item.classId || item.classId === classId));
  const item = shuffle(items)[0];
  if (!item) { alert('Chưa có bộ Flashcard đang bật. UFO sẽ thả học sinh xuống.'); return onRelease(); }
  let index = 0;
  const show = () => { const card = item.cards[index]; dialog.innerHTML = `<form method="dialog" class="dialog-card learning-card"><div class="dialog-head"><div><p class="eyebrow">FLASHCARD TRÊN UFO</p><h2>${esc(studentNames.join(' · '))}</h2><p class="muted">${esc(item.title)}</p></div></div><div class="flashcard"><span>${index + 1} / ${item.cards.length}</span><h2>${esc(card.front)}</h2><button type="button" class="secondary-button" data-flip>Xem đáp án</button><p class="answer" hidden>${esc(card.back)}</p></div><div class="dialog-actions"><button type="button" class="primary-button" data-next>${index === item.cards.length - 1 ? 'Xác nhận thả xuống' : 'Thẻ tiếp theo ➜'}</button></div></form>`; $('[data-flip]', dialog).onclick = () => $('.answer', dialog).hidden = false; $('[data-next]', dialog).onclick = () => index === item.cards.length - 1 ? release() : (index++, show()); };
  show(); dialog.showModal();
}
