const DB_NAME = 'ufo-tram-goi-bai-images';
const STORE = 'images';
const openDb = () => new Promise((resolve, reject) => { const request = indexedDB.open(DB_NAME, 1); request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' }); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error || new Error('Không thể mở kho ảnh.')); });
const all = async () => { const db = await openDb(); return new Promise((resolve, reject) => { const request = db.transaction(STORE).objectStore(STORE).getAll(); request.onsuccess = () => { db.close(); resolve(request.result); }; request.onerror = () => { db.close(); reject(request.error); }; }); };
const put = async asset => { const db = await openDb(); return new Promise((resolve, reject) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(asset); tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => { db.close(); reject(tx.error); }; }); };
const remove = async id => { const db = await openDb(); return new Promise((resolve, reject) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).delete(id); tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => { db.close(); reject(tx.error); }; }); };
const clear = async () => { const db = await openDb(); return new Promise((resolve, reject) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).clear(); tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => { db.close(); reject(tx.error); }; }); };
const idOf = name => name.trim().replace(/\.[^.]+$/, '').replace(/\s+/g, '-').toLowerCase();
const mb = bytes => `${(bytes / 1048576).toFixed(bytes > 10485760 ? 0 : 1)} MB`;
async function compress(file) { if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error(`${file.name}: chỉ hỗ trợ PNG, JPG hoặc WebP.`); const image = await new Promise((resolve, reject) => { const img = new Image(), url = URL.createObjectURL(file); img.onload = () => { URL.revokeObjectURL(url); resolve(img); }; img.onerror = () => reject(new Error(`${file.name}: không đọc được ảnh.`)); img.src = url; }); const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight)); const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(image.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(image.naturalHeight * scale)); const ctx = canvas.getContext('2d', { alpha: true }); ctx.drawImage(image, 0, 0, canvas.width, canvas.height); const alpha = ctx.getImageData(0, 0, Math.min(128, canvas.width), Math.min(128, canvas.height)).data; let hasAlpha = false; for (let i = 3; i < alpha.length; i += 4) if (alpha[i] < 255) { hasAlpha = true; break; } const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', hasAlpha ? .9 : .82)); return { id: idOf(file.name), originalName: file.name, blob: blob || file, width: canvas.width, height: canvas.height, hasAlpha, createdAt: new Date().toISOString() }; }

export function mountImageLibrary(host) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/png,image/jpeg,image/webp';
  input.multiple = true;
  input.hidden = true;
  let selected = new Set();

  const render = async () => {
    selected.clear();
    let assets;
    try {
      assets = await all();
    } catch {
      host.innerHTML = '<p class="muted">Kho ảnh không khả dụng. Game vẫn chạy nhưng ảnh chỉ dùng trong phiên này.</p>';
      return;
    }
    const bytes = assets.reduce((sum, asset) => sum + asset.blob.size, 0);
    let capacity = '';
    if (navigator.storage?.estimate) {
      const estimate = await navigator.storage.estimate();
      if (estimate.quota) capacity = ` · dùng ${Math.round((estimate.usage || 0) / estimate.quota * 100)}% bộ nhớ`;
    }
    host.innerHTML = `<p class="muted">${assets.length} ảnh · ${mb(bytes)} · WebP giữ nền trong suốt${capacity}.</p><div class="image-library-actions"><button type="button" class="secondary-button" data-upload>🖼️ Nạp ảnh</button><button type="button" class="secondary-button" data-refresh>↻ Làm mới</button>${assets.length ? `<button type="button" class="tiny-button" data-select-all>☑ Chọn tất cả</button><button type="button" class="tiny-button" data-clear>Xóa toàn bộ</button><button type="button" class="tiny-button" data-delete-selected style="display:none">🗑️ Xóa đã chọn (<span class="selected-count">0</span>)</button>` : ''}</div><div class="image-grid">${assets.map(asset => `<article class="image-card"><input type="checkbox" class="image-select" data-id="${asset.id}" style="position:absolute;top:8px;right:8px;cursor:pointer;width:18px;height:18px"><img src="${URL.createObjectURL(asset.blob)}" alt="${asset.originalName}"><strong>${asset.id}</strong><small>${asset.width}×${asset.height} · ${mb(asset.blob.size)}${asset.hasAlpha ? ' · trong suốt' : ''}</small><button type="button" data-delete="${asset.id}">Xóa</button></article>`).join('') || '<p class="muted">Chưa có ảnh. Kéo-thả hoặc nạp PNG, JPG, WebP.</p>'}</div>`;
    
    const updateSelection = () => {
      const count = selected.size;
      const btn = host.querySelector('[data-delete-selected]');
      const countSpan = host.querySelector('.selected-count');
      if (btn && countSpan) {
        btn.style.display = count ? 'block' : 'none';
        countSpan.textContent = count;
      }
    };
    
    host.querySelectorAll('.image-select').forEach(checkbox => {
      checkbox.onchange = () => {
        if (checkbox.checked) selected.add(checkbox.dataset.id);
        else selected.delete(checkbox.dataset.id);
        updateSelection();
      };
    });
    
    host.querySelector('[data-select-all]')?.addEventListener('click', () => {
      const allChecked = host.querySelectorAll('.image-select:checked').length === assets.length;
      host.querySelectorAll('.image-select').forEach(checkbox => {
        checkbox.checked = !allChecked;
        if (checkbox.checked) selected.add(checkbox.dataset.id);
        else selected.delete(checkbox.dataset.id);
      });
      updateSelection();
    });
    
    host.querySelector('[data-delete-selected]')?.addEventListener('click', async () => {
      if (!confirm(`Xóa ${selected.size} ảnh đã chọn?`)) return;
      for (const id of selected) await remove(id);
      render();
    });
    
    host.querySelector('[data-upload]').onclick = () => input.click();
    host.querySelector('[data-refresh]').onclick = render;
    host.querySelector('[data-clear]')?.addEventListener('click', async () => {
      if (confirm(`Xóa toàn bộ ${assets.length} ảnh?`)) {
        await clear();
        render();
      }
    });
    host.querySelectorAll('[data-delete]').forEach(button => button.onclick = async () => {
      if (confirm(`Xóa ảnh ${button.dataset.delete}?`)) {
        await remove(button.dataset.delete);
        render();
      }
    });
  };

  const upload = async files => {
    const errors = [];
    for (const file of files) try {
      await put(await compress(file));
    } catch (error) {
      errors.push(error.message);
    }
    if (errors.length) alert(errors.join('\n'));
    render();
  };

  input.onchange = () => upload([...input.files]);
  host.appendChild(input);
  host.ondragover = event => {
    event.preventDefault();
    host.classList.add('dragging');
  };
  host.ondragleave = () => host.classList.remove('dragging');
  host.ondrop = event => {
    event.preventDefault();
    host.classList.remove('dragging');
    upload([...event.dataTransfer.files]);
  };
  render();
}
