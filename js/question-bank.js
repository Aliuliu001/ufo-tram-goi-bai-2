const KEY = 'ufo-question-bank-v1';
const $ = (selector, root = document) => root.querySelector(selector);
const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const norm = value => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi');
const load = () => { try { const value = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(value.activities) ? value : { activities: [] }; } catch { return { activities: [] }; } };
const save = bank => localStorage.setItem(KEY, JSON.stringify(bank));
const shuffle = list => [...list].sort(() => Math.random() - .5);
const activityFor = classId => shuffle(load().activities.filter(item => item.enabled && (!item.classId || item.classId === classId))).shift();
const imageDb = () => new Promise((resolve, reject) => { const request = indexedDB.open('ufo-tram-goi-bai-images', 1); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
const getImages = async () => { try { const db = await imageDb(); return new Promise((resolve, reject) => { const request = db.transaction('images').objectStore('images').getAll(); request.onsuccess = () => { db.close(); resolve(request.result); }; request.onerror = () => { db.close(); reject(request.error); }; }); } catch { return []; } };
const getImage = async id => { if (!id) return null; const images = await getImages(); return images.find(image => image.id === id) || null; };

function check(item) {
  if (!item.title.trim()) return 'Cần đặt tên nội dung.';
  if (item.kind === 'quiz') { const all = [item.correct, ...item.wrong]; if (!item.prompt.trim() || all.some(x => !x.trim())) return 'Quiz cần câu hỏi, 1 đáp án đúng và 3 đáp án sai.'; if (new Set(all.map(norm)).size !== 4) return 'Bốn đáp án Quiz phải khác nhau.'; }
  if (item.kind === 'cards' && (!item.cards.length || item.cards.length > 7 || item.cards.some(card => !card.front || !card.back))) return 'Flashcards cần từ 1–7 dòng theo dạng Mặt trước | Đáp án.';
  if (['fill', 'anagram', 'unjumble'].includes(item.kind) && (!item.prompt.trim() || !item.answer.trim())) return 'Bài này cần câu hỏi và đáp án.';
  return '';
}

export function mountQuestionBank(host) {
  const render = () => {
    const bank = load();
    host.innerHTML = `<div class="question-toolbar"><p class="muted">${bank.activities.length} bộ nội dung. Nội dung bật sẽ được chọn ngẫu nhiên sau khi UFO bắt học sinh.</p><button class="secondary-button" data-add>＋ Tạo nội dung</button></div><div class="question-list">${bank.activities.map(item => `<article><div><strong>${item.title}</strong><small>${item.kind === 'cards' ? `${item.cards.length} flashcards` : item.kind} · ${item.enabled ? 'Đang bật' : 'Tắt'}</small></div><button class="tiny-button" data-toggle="${item.id}">${item.enabled ? 'Tắt' : 'Bật'}</button><button class="tiny-button" data-remove="${item.id}">🗑️</button></article>`).join('') || '<p class="muted">Chưa có nội dung. Tạo bộ đầu tiên để học sinh trả lời sau khi bị UFO bắt.</p>'}</div>`;
    $('[data-add]', host).onclick = () => editor();
    host.querySelectorAll('[data-toggle]').forEach(button => button.onclick = () => { const bank = load(); const item = bank.activities.find(x => x.id === button.dataset.toggle); item.enabled = !item.enabled; save(bank); render(); });
    host.querySelectorAll('[data-remove]').forEach(button => button.onclick = () => { if (!confirm('Xóa nội dung này?')) return; const bank = load(); bank.activities = bank.activities.filter(x => x.id !== button.dataset.remove); save(bank); render(); });
  };
  const editor = async () => {
    const images = await getImages();
    const dialog = $('#question-editor');
    dialog.innerHTML = `<form method="dialog" class="dialog-card question-form"><div class="dialog-head"><div><p class="eyebrow">NỘI DUNG HỌC TẬP</p><h2>Tạo bài mới</h2></div><button class="icon-button" value="cancel">×</button></div><label>Loại bài<select name="kind"><option value="quiz">Quiz 4 lựa chọn</option><option value="cards">Flashcards (1–7)</option><option value="fill">Điền từ còn thiếu</option><option value="anagram">Anagram</option><option value="unjumble">Unjumble</option></select></label><label>Tên bộ<input name="title" placeholder="Ví dụ: Unit 5 - Food"></label><label>Ảnh minh họa (tùy chọn)<select name="imageId"><option value="">Không dùng ảnh</option>${images.map(image => `<option value="${image.id}">${image.id} · ${image.originalName}</option>`).join('')}</select></label><label>Câu hỏi / hướng dẫn<textarea name="prompt" rows="3" placeholder="Nhập câu hỏi hoặc hướng dẫn"></textarea></label><label class="quiz-field">Đáp án đúng<input name="correct" placeholder="Đáp án đúng"></label><label class="quiz-field">Ba đáp án sai (mỗi dòng một đáp án)<textarea name="wrong" rows="3" placeholder="Đáp án sai 1&#10;Đáp án sai 2&#10;Đáp án sai 3"></textarea></label><label class="cards-field" hidden>Flashcards, mỗi dòng: Mặt trước | Đáp án<textarea name="cards" rows="5" placeholder="apple | quả táo&#10;banana | quả chuối"></textarea></label><label>Gợi ý (tùy chọn)<input name="hint" placeholder="Gợi ý cho học sinh"></label><div class="dialog-actions"><button class="secondary-button" value="cancel">Hủy</button><button class="primary-button" type="submit">Lưu nội dung</button></div></form>`;
    const form = $('form', dialog); const kind = $('[name=kind]', form); const refresh = () => { const cards = kind.value === 'cards'; form.querySelectorAll('.quiz-field').forEach(field => field.hidden = cards); $('.cards-field', form).hidden = !cards; }; kind.onchange = refresh; refresh();
    form.onsubmit = event => { event.preventDefault(); const data = new FormData(form); const value = { id: uid('activity'), kind: data.get('kind'), title: data.get('title'), imageId: data.get('imageId') || '', prompt: data.get('prompt'), correct: data.get('correct') || '', wrong: String(data.get('wrong') || '').split('\n').map(x => x.trim()), cards: String(data.get('cards') || '').split('\n').filter(Boolean).map(line => { const [front, ...rest] = line.split('|'); return { front: front?.trim(), back: rest.join('|').trim() }; }), hint: data.get('hint') || '', enabled: true }; const error = check(value); if (error) { alert(error); return; } const bank = load(); bank.activities.push(value); save(bank); dialog.close(); render(); }; dialog.showModal();
  };
  render();
}

export async function runLearningActivity(classId, studentNames, onRelease) {
  const item = activityFor(classId); if (!item) { onRelease(); return; }
  const dialog = $('#learning-dialog'); const who = studentNames.join(' · '); let complete = false;
  const asset = await getImage(item.imageId);
  const image = asset ? `<img class="learning-image" src="${URL.createObjectURL(asset.blob)}" alt="Ảnh minh họa cho câu hỏi">` : '';
  const release = () => { dialog.close(); onRelease(); };
  const header = `<div class="dialog-head"><div><p class="eyebrow">NHIỆM VỤ TRÊN UFO</p><h2>${who}</h2><p class="muted">${item.title}</p></div></div>`;
  if (item.kind === 'cards') { let index = 0; const show = () => { const card = item.cards[index]; dialog.innerHTML = `<form method="dialog" class="dialog-card learning-card">${header}${image}<div class="flashcard"><span>${index + 1} / ${item.cards.length}</span><h2>${card.front}</h2><button type="button" class="secondary-button" data-flip>Xem đáp án</button><p class="answer" hidden>${card.back}</p></div><div class="dialog-actions"><button type="button" class="primary-button" data-next>${index === item.cards.length - 1 ? 'Xác nhận thả xuống' : 'Thẻ tiếp theo ➜'}</button></div></form>`; $('[data-flip]', dialog).onclick = () => $('.answer', dialog).hidden = false; $('[data-next]', dialog).onclick = () => index === item.cards.length - 1 ? release() : (index++, show()); }; show(); }
  else if (item.kind === 'quiz') { const options = shuffle([item.correct, ...item.wrong]); dialog.innerHTML = `<form method="dialog" class="dialog-card learning-card">${header}${image}<h3>${item.prompt}</h3><div class="answer-options">${options.map(option => `<button type="button" data-answer="${option.replace(/"/g, '&quot;')}">${option}</button>`).join('')}</div><p class="learning-feedback"></p></form>`; dialog.querySelectorAll('[data-answer]').forEach(button => button.onclick = () => { const ok = norm(button.dataset.answer) === norm(item.correct); $('.learning-feedback', dialog).textContent = ok ? '✨ Chính xác! Có thể thả xuống.' : 'Chưa đúng — hãy thử lại.'; if (ok) { button.classList.add('correct'); setTimeout(release, 700); } }); }
  else { const letters = item.kind === 'anagram' ? shuffle([...item.answer]).join(' ') : item.prompt; dialog.innerHTML = `<form class="dialog-card learning-card">${header}${image}<h3>${letters}</h3><p class="muted">${item.hint || 'Nhập đáp án của em.'}</p><input class="learning-input" autofocus><p class="learning-feedback"></p><div class="dialog-actions"><button class="primary-button">Kiểm tra</button></div></form>`; $('form', dialog).onsubmit = event => { event.preventDefault(); const ok = norm($('.learning-input', dialog).value) === norm(item.answer); $('.learning-feedback', dialog).textContent = ok ? '✨ Chính xác! UFO sẽ thả em xuống.' : 'Chưa đúng — hãy thử lại.'; if (ok) setTimeout(release, 700); }; }
  dialog.showModal();
}
