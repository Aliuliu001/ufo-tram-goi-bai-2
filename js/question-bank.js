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
  if (!item.title.trim()) return 'Cáº§n Äáº·t tÃªn ná»i dung.';
  if (item.kind === 'quiz') { const all = [item.correct, ...item.wrong]; if (!item.prompt.trim() || all.some(x => !x.trim())) return 'Quiz cáº§n cÃ¢u há»i, 1 ÄÃ¡p Ã¡n ÄÃºng vÃ  3 ÄÃ¡p Ã¡n sai.'; if (new Set(all.map(norm)).size !== 4) return 'Bá»n ÄÃ¡p Ã¡n Quiz pháº£i khÃ¡c nhau.'; }
  if (item.kind === 'cards' && (!item.cards.length || item.cards.length > 7 || item.cards.some(card => !card.front || !card.back))) return 'Flashcards cáº§n tá»« 1â7 dÃ²ng theo dáº¡ng Máº·t trÆ°á»c | ÄÃ¡p Ã¡n.';
  if (['fill', 'anagram', 'unjumble'].includes(item.kind) && (!item.prompt.trim() || !item.answer.trim())) return 'BÃ i nÃ y cáº§n cÃ¢u há»i vÃ  ÄÃ¡p Ã¡n.';
  return '';
}

export function mountQuestionBank(host) {
  const render = () => {
    const bank = load();
    host.innerHTML = `<div class="question-toolbar"><p class="muted">${bank.activities.length} bá» ná»i dung. Ná»i dung báº­t sáº½ ÄÆ°á»£c chá»n ngáº«u nhiÃªn sau khi UFO báº¯t há»c sinh.</p><button type="button" class="secondary-button" data-add>ï¼ Táº¡o ná»i dung</button></div><div class="question-list">${bank.activities.map(item => `<article><div><strong>${item.title}</strong><small>${item.kind === 'cards' ? `${item.cards.length} flashcards` : item.kind} Â· ${item.enabled ? 'Äang báº­t' : 'Táº¯t'}</small></div><button type="button" class="tiny-button" data-toggle="${item.id}">${item.enabled ? 'Táº¯t' : 'Báº­t'}</button><button type="button" class="tiny-button" data-remove="${item.id}">ðï¸</button></article>`).join('') || '<p class="muted">ChÆ°a cÃ³ ná»i dung. Táº¡o bá» Äáº§u tiÃªn Äá» há»c sinh tráº£ lá»i sau khi bá» UFO báº¯t.</p>'}</div>`;
    $('[data-add]', host).onclick = () => editor();
    host.querySelectorAll('[data-toggle]').forEach(button => button.onclick = () => { const bank = load(); const item = bank.activities.find(x => x.id === button.dataset.toggle); item.enabled = !item.enabled; save(bank); render(); });
    host.querySelectorAll('[data-remove]').forEach(button => button.onclick = () => { if (!confirm('XÃ³a ná»i dung nÃ y?')) return; const bank = load(); bank.activities = bank.activities.filter(x => x.id !== button.dataset.remove); save(bank); render(); });
  };
  const editor = async () => {
    const images = await getImages();
    const dialog = $('#question-editor');
    dialog.innerHTML = `<form method="dialog" class="dialog-card question-form"><div class="dialog-head"><div><p class="eyebrow">Ná»I DUNG Há»C Táº¬P</p><h2>Táº¡o bÃ i má»i</h2></div><button class="icon-button" value="cancel">Ã</button></div><label>Loáº¡i bÃ i<select name="kind"><option value="quiz">Quiz 4 lá»±a chá»n</option><option value="cards">Flashcards (1â7)</option><option value="fill">Äiá»n tá»« cÃ²n thiáº¿u</option><option value="anagram">Anagram</option><option value="unjumble">Unjumble</option></select></label><label>TÃªn bá»<input name="title" placeholder="VÃ­ dá»¥: Unit 5 - Food"></label><label>áº¢nh minh há»a (tÃ¹y chá»n)<select name="imageId"><option value="">KhÃ´ng dÃ¹ng áº£nh</option>${images.map(image => `<option value="${image.id}">${image.id} Â· ${image.originalName}</option>`).join('')}</select></label><label>CÃ¢u há»i / hÆ°á»ng dáº«n<textarea name="prompt" rows="3" placeholder="Nháº­p cÃ¢u há»i hoáº·c hÆ°á»ng dáº«n"></textarea></label><label class="quiz-field">ÄÃ¡p Ã¡n ÄÃºng<input name="correct" placeholder="ÄÃ¡p Ã¡n ÄÃºng"></label><label class="quiz-field">Ba ÄÃ¡p Ã¡n sai (má»i dÃ²ng má»t ÄÃ¡p Ã¡n)<textarea name="wrong" rows="3" placeholder="ÄÃ¡p Ã¡n sai 1&#10;ÄÃ¡p Ã¡n sai 2&#10;ÄÃ¡p Ã¡n sai 3"></textarea></label><label class="cards-field" hidden>Flashcards, má»i dÃ²ng: Máº·t trÆ°á»c | ÄÃ¡p Ã¡n<textarea name="cards" rows="5" placeholder="apple | quáº£ tÃ¡o&#10;banana | quáº£ chuá»i"></textarea></label><label>Gá»£i Ã½ (tÃ¹y chá»n)<input name="hint" placeholder="Gá»£i Ã½ cho há»c sinh"></label><div class="dialog-actions"><button class="secondary-button" value="cancel">Há»§y</button><button class="primary-button" type="submit">LÆ°u ná»i dung</button></div></form>`;
    const form = $('form', dialog); const kind = $('[name=kind]', form); const refresh = () => { const cards = kind.value === 'cards'; form.querySelectorAll('.quiz-field').forEach(field => field.hidden = cards); $('.cards-field', form).hidden = !cards; }; kind.onchange = refresh; refresh();
    form.onsubmit = event => { event.preventDefault(); const data = new FormData(form); const value = { id: uid('activity'), kind: data.get('kind'), title: data.get('title'), imageId: data.get('imageId') || '', prompt: data.get('prompt'), correct: data.get('correct') || '', wrong: String(data.get('wrong') || '').split('\n').map(x => x.trim()), cards: String(data.get('cards') || '').split('\n').filter(Boolean).map(line => { const [front, ...rest] = line.split('|'); return { front: front?.trim(), back: rest.join('|').trim() }; }), hint: data.get('hint') || '', enabled: true }; const error = check(value); if (error) { alert(error); return; } const bank = load(); bank.activities.push(value); save(bank); dialog.close(); render(); }; dialog.showModal();
  };
  render();
}

export async function runLearningActivity(classId, studentNames, onRelease) {
  const item = activityFor(classId); if (!item) { onRelease(); return; }
  const dialog = $('#learning-dialog'); const who = studentNames.join(' Â· '); let complete = false;
  const asset = await getImage(item.imageId);
  const image = asset ? `<img class="learning-image" src="${URL.createObjectURL(asset.blob)}" alt="áº¢nh minh há»a cho cÃ¢u há»i">` : '';
  const release = () => { dialog.close(); onRelease(); };
  const header = `<div class="dialog-head"><div><p class="eyebrow">NHIá»M Vá»¤ TRÃN UFO</p><h2>${who}</h2><p class="muted">${item.title}</p></div></div>`;
  if (item.kind === 'cards') { let index = 0; const show = () => { const card = item.cards[index]; dialog.innerHTML = `<form method="dialog" class="dialog-card learning-card">${header}${image}<div class="flashcard"><span>${index + 1} / ${item.cards.length}</span><h2>${card.front}</h2><button type="button" class="secondary-button" data-flip>Xem ÄÃ¡p Ã¡n</button><p class="answer" hidden>${card.back}</p></div><div class="dialog-actions"><button type="button" class="primary-button" data-next>${index === item.cards.length - 1 ? 'XÃ¡c nháº­n tháº£ xuá»ng' : 'Tháº» tiáº¿p theo â'}</button></div></form>`; $('[data-flip]', dialog).onclick = () => $('.answer', dialog).hidden = false; $('[data-next]', dialog).onclick = () => index === item.cards.length - 1 ? release() : (index++, show()); }; show(); }
  else if (item.kind === 'quiz') { const options = shuffle([item.correct, ...item.wrong]); dialog.innerHTML = `<form method="dialog" class="dialog-card learning-card">${header}${image}<h3>${item.prompt}</h3><div class="answer-options">${options.map(option => `<button type="button" data-answer="${option.replace(/"/g, '&quot;')}">${option}</button>`).join('')}</div><p class="learning-feedback"></p></form>`; dialog.querySelectorAll('[data-answer]').forEach(button => button.onclick = () => { const ok = norm(button.dataset.answer) === norm(item.correct); $('.learning-feedback', dialog).textContent = ok ? 'â¨ ChÃ­nh xÃ¡c! CÃ³ thá» tháº£ xuá»ng.' : 'ChÆ°a ÄÃºng â hÃ£y thá»­ láº¡i.'; if (ok) { button.classList.add('correct'); setTimeout(release, 700); } }); }
  else { const letters = item.kind === 'anagram' ? shuffle([...item.answer]).join(' ') : item.prompt; dialog.innerHTML = `<form class="dialog-card learning-card">${header}${image}<h3>${letters}</h3><p class="muted">${item.hint || 'Nháº­p ÄÃ¡p Ã¡n cá»§a em.'}</p><input class="learning-input" autofocus><p class="learning-feedback"></p><div class="dialog-actions"><button class="primary-button">Kiá»m tra</button></div></form>`; $('form', dialog).onsubmit = event => { event.preventDefault(); const ok = norm($('.learning-input', dialog).value) === norm(item.answer); $('.learning-feedback', dialog).textContent = ok ? 'â¨ ChÃ­nh xÃ¡c! UFO sáº½ tháº£ em xuá»ng.' : 'ChÆ°a ÄÃºng â hÃ£y thá»­ láº¡i.'; if (ok) setTimeout(release, 700); }; }
  dialog.showModal();
}
