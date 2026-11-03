const DB_NAME = 'ufo-tram-goi-bai-images';
const STORE = 'images';
const CLASS_KEY = 'ufo-classes';
const QUESTION_KEY = 'ufo-question-bank-v1';
const PREFERENCES_KEY = 'ufo-preferences';
const LEGACY_STUDENTS_KEY = 'ufo-students';
const openDb = () => new Promise((resolve, reject) => { const request = indexedDB.open(DB_NAME, 1); request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' }); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error || new Error('KhÃ´ng thá» má» kho áº£nh.')); });
const allImages = async () => { const db = await openDb(); return new Promise((resolve, reject) => { const request = db.transaction(STORE).objectStore(STORE).getAll(); request.onsuccess = () => { db.close(); resolve(request.result); }; request.onerror = () => { db.close(); reject(request.error); }; }); };
const replaceImages = async images => { const db = await openDb(); return new Promise((resolve, reject) => { const tx = db.transaction(STORE, 'readwrite'); const store = tx.objectStore(STORE); store.clear(); images.forEach(image => store.put(image)); tx.oncomplete = () => { db.close(); resolve(); }; tx.onabort = tx.onerror = () => { db.close(); reject(tx.error || new Error('KhÃ´ng thá» ghi kho áº£nh.')); }; }); };
const toDataUrl = blob => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(reader.error); reader.readAsDataURL(blob); });
const toBlob = dataUrl => fetch(dataUrl).then(response => response.blob());
const download = (content, name) => { const url = URL.createObjectURL(new Blob([content], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url); };

async function exportGame() {
  const images = await allImages();
  const packedImages = await Promise.all(images.map(async ({ blob, ...meta }) => ({ ...meta, dataUrl: await toDataUrl(blob) })));
  return JSON.stringify({
    format: 'ufo-tram-goi-bai-backup', version: 2, exportedAt: new Date().toISOString(),
    classes: JSON.parse(localStorage.getItem(CLASS_KEY) || 'null'),
    questions: JSON.parse(localStorage.getItem(QUESTION_KEY) || 'null'),
    preferences: JSON.parse(localStorage.getItem(PREFERENCES_KEY) || 'null'),
    legacyStudents: JSON.parse(localStorage.getItem(LEGACY_STUDENTS_KEY) || 'null'),
    images: packedImages
  }, null, 2);
}

function validate(data) {
  if (!data || data.format !== 'ufo-tram-goi-bai-backup' || ![1, 2].includes(data.version) || !Array.isArray(data.images)) throw new Error('File khÃ´ng ÄÃºng Äá»nh dáº¡ng backup UFO. Dá»¯ liá»u hiá»n táº¡i chÆ°a thay Äá»i.');
  if (!data.images.every(image => typeof image.id === 'string' && typeof image.dataUrl === 'string' && image.dataUrl.startsWith('data:image/'))) throw new Error('Backup cÃ³ áº£nh khÃ´ng há»£p lá». Dá»¯ liá»u hiá»n táº¡i chÆ°a thay Äá»i.');
  if (data.classes !== null && (!Array.isArray(data.classes.classes) || !data.classes.classes.length)) throw new Error('Backup thiáº¿u dá»¯ liá»u lá»p há»£p lá». Dá»¯ liá»u hiá»n táº¡i chÆ°a thay Äá»i.');
  if (data.questions !== undefined && data.questions !== null && !Array.isArray(data.questions.activities)) throw new Error('Backup cÃ³ ngÃ¢n hÃ ng cÃ¢u há»i khÃ´ng há»£p lá». Dá»¯ liá»u hiá»n táº¡i chÆ°a thay Äá»i.');
}

async function restoreGame(file) {
  const data = JSON.parse(await file.text());
  validate(data);
  if (!confirm(`KhÃ´i phá»¥c ${data.images.length} áº£nh, lá»p há»c vÃ  ná»i dung tá»« ${new Date(data.exportedAt).toLocaleString('vi-VN')}? Dá»¯ liá»u hiá»n táº¡i sáº½ bá» thay tháº¿.`)) return;
  // One IndexedDB transaction first: if it fails, the existing image library remains intact.
  const hydrated = await Promise.all(data.images.map(async ({ dataUrl, ...meta }) => ({ ...meta, blob: await toBlob(dataUrl) })));
  await replaceImages(hydrated);
  if (data.classes) localStorage.setItem(CLASS_KEY, JSON.stringify(data.classes));
  if (data.questions) localStorage.setItem(QUESTION_KEY, JSON.stringify(data.questions));
  if (data.preferences) localStorage.setItem(PREFERENCES_KEY, JSON.stringify(data.preferences));
  if (data.legacyStudents) localStorage.setItem(LEGACY_STUDENTS_KEY, JSON.stringify(data.legacyStudents));
  alert('ÄÃ£ khÃ´i phá»¥c dá»¯ liá»u. Trang sáº½ táº£i láº¡i Äá» Ã¡p dá»¥ng.');
  location.reload();
}

export function mountBackupControls(host) {
  const input = document.createElement('input'); input.type = 'file'; input.accept = '.json,application/json'; input.hidden = true;
  host.innerHTML = '<p class="muted">Má»t file JSON gá»m lá»p, cÃ¢u há»i, cÃ i Äáº·t vÃ  toÃ n bá» áº£nh. Backup cÃ³ thá» lá»n náº¿u cÃ³ nhiá»u áº£nh.</p><div class="image-library-actions"><button type="button" class="secondary-button" data-export>ð¥ Backup toÃ n bá»</button><button type="button" class="secondary-button" data-import>ð¤ KhÃ´i phá»¥c backup</button></div>';
  host.appendChild(input);
  host.querySelector('[data-export]').onclick = async () => { try { download(await exportGame(), `ufo-backup-${new Date().toISOString().slice(0, 10)}.json`); } catch (error) { alert(`KhÃ´ng thá» backup: ${error.message}`); } };
  host.querySelector('[data-import]').onclick = () => input.click();
  input.onchange = async () => { const file = input.files[0]; if (!file) return; try { await restoreGame(file); } catch (error) { alert(`KhÃ´ng thá» khÃ´i phá»¥c: ${error.message}`); } input.value = ''; };
}
