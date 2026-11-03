const DB_NAME = 'ufo-tram-goi-bai-images';
const STORE = 'images';
const CLASS_KEY = 'ufo-classes';
const QUESTION_KEY = 'ufo-question-bank-v1';
const PREFERENCES_KEY = 'ufo-preferences';
const LEGACY_STUDENTS_KEY = 'ufo-students';
const IMAGE_WORD_PAIRS_KEY = 'ufo-image-word-pairs-v1';
const LEARNING_MODE_KEY = 'ufo-learning-mode-v1';
const openDb = () => new Promise((resolve, reject) => { const request = indexedDB.open(DB_NAME, 1); request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' }); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error || new Error('Không thể mở kho ảnh.')); });
const allImages = async () => { const db = await openDb(); return new Promise((resolve, reject) => { const request = db.transaction(STORE).objectStore(STORE).getAll(); request.onsuccess = () => { db.close(); resolve(request.result); }; request.onerror = () => { db.close(); reject(request.error); }; }); };
const replaceImages = async images => { const db = await openDb(); return new Promise((resolve, reject) => { const tx = db.transaction(STORE, 'readwrite'); const store = tx.objectStore(STORE); store.clear(); images.forEach(image => store.put(image)); tx.oncomplete = () => { db.close(); resolve(); }; tx.onabort = tx.onerror = () => { db.close(); reject(tx.error || new Error('Không thể ghi kho ảnh.')); }; }); };
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
    imageWordPairs: JSON.parse(localStorage.getItem(IMAGE_WORD_PAIRS_KEY) || 'null'),
    learningMode: localStorage.getItem(LEARNING_MODE_KEY) || 'call-only',
    images: packedImages
  }, null, 2);
}

function validate(data) {
  if (!data || data.format !== 'ufo-tram-goi-bai-backup' || ![1, 2].includes(data.version) || !Array.isArray(data.images)) throw new Error('File không đúng định dạng backup UFO. Dữ liệu hiện tại chưa thay đổi.');
  if (!data.images.every(image => typeof image.id === 'string' && typeof image.dataUrl === 'string' && image.dataUrl.startsWith('data:image/'))) throw new Error('Backup có ảnh không hợp lệ. Dữ liệu hiện tại chưa thay đổi.');
  if (data.classes !== null && (!Array.isArray(data.classes.classes) || !data.classes.classes.length)) throw new Error('Backup thiếu dữ liệu lớp hợp lệ. Dữ liệu hiện tại chưa thay đổi.');
  if (data.questions !== undefined && data.questions !== null && !Array.isArray(data.questions.activities)) throw new Error('Backup có ngân hàng câu hỏi không hợp lệ. Dữ liệu hiện tại chưa thay đổi.');
}

async function restoreGame(file) {
  const data = JSON.parse(await file.text());
  validate(data);
  if (!confirm(`Khôi phục ${data.images.length} ảnh, lớp học và nội dung từ ${new Date(data.exportedAt).toLocaleString('vi-VN')}? Dữ liệu hiện tại sẽ bị thay thế.`)) return;
  // One IndexedDB transaction first: if it fails, the existing image library remains intact.
  const hydrated = await Promise.all(data.images.map(async ({ dataUrl, ...meta }) => ({ ...meta, blob: await toBlob(dataUrl) })));
  await replaceImages(hydrated);
  if (data.classes) localStorage.setItem(CLASS_KEY, JSON.stringify(data.classes));
  if (data.questions) localStorage.setItem(QUESTION_KEY, JSON.stringify(data.questions));
  if (data.preferences) localStorage.setItem(PREFERENCES_KEY, JSON.stringify(data.preferences));
  if (data.legacyStudents) localStorage.setItem(LEGACY_STUDENTS_KEY, JSON.stringify(data.legacyStudents));
  if (data.imageWordPairs) localStorage.setItem(IMAGE_WORD_PAIRS_KEY, JSON.stringify(data.imageWordPairs));
  if (data.learningMode) localStorage.setItem(LEARNING_MODE_KEY, data.learningMode);
  alert('Đã khôi phục dữ liệu. Trang sẽ tải lại để áp dụng.');
  location.reload();
}

export function mountBackupControls(host) {
  const input = document.createElement('input'); input.type = 'file'; input.accept = '.json,application/json'; input.hidden = true;
  host.innerHTML = '<p class="muted">Một file JSON gồm lớp, câu hỏi, cài đặt và toàn bộ ảnh. Backup có thể lớn nếu có nhiều ảnh.</p><div class="image-library-actions"><button type="button" class="secondary-button" data-export>📥 Backup toàn bộ</button><button type="button" class="secondary-button" data-import>📤 Khôi phục backup</button></div>';
  host.appendChild(input);
  host.querySelector('[data-export]').onclick = async () => { try { download(await exportGame(), `ufo-backup-${new Date().toISOString().slice(0, 10)}.json`); } catch (error) { alert(`Không thể backup: ${error.message}`); } };
  host.querySelector('[data-import]').onclick = () => input.click();
  input.onchange = async () => { const file = input.files[0]; if (!file) return; try { await restoreGame(file); } catch (error) { alert(`Không thể khôi phục: ${error.message}`); } input.value = ''; };
}
