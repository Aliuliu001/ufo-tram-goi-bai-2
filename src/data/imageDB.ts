export interface ImageAssetMeta {
  id: string;
  originalName: string;
  mimeType: string;
  byteSize: number;
  width: number;
  height: number;
  hasAlpha: boolean;
  createdAt: string;
}

export interface ImageAsset extends ImageAssetMeta {
  blob: Blob;
}

export interface BackupImageAsset extends ImageAssetMeta {
  dataUrl: string;
}

const DB_NAME = 'ufo-tram-goi-bai-images';
const STORE = 'images';
const VERSION = 1;

export const normalizeAssetId = (input: string): string =>
  input.trim().replace(/\.[a-z0-9]+$/i, '').replace(/\s+/g, '-').toLowerCase();

export const isSupportedImage = (file: File): boolean => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type);

const request = <T>(value: IDBRequest<T>): Promise<T> => new Promise((resolve, reject) => {
  value.onsuccess = () => resolve(value.result);
  value.onerror = () => reject(value.error ?? new Error('Không thể truy cập kho ảnh.'));
});

const open = (): Promise<IDBDatabase> => new Promise((resolve, reject) => {
  if (!('indexedDB' in window)) {
    reject(new Error('Trình duyệt không hỗ trợ IndexedDB.'));
    return;
  }
  const value = indexedDB.open(DB_NAME, VERSION);
  value.onupgradeneeded = () => {
    if (!value.result.objectStoreNames.contains(STORE)) value.result.createObjectStore(STORE, { keyPath: 'id' });
  };
  value.onsuccess = () => resolve(value.result);
  value.onerror = () => reject(value.error ?? new Error('Không thể mở kho ảnh.'));
});

const withStore = async <T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => Promise<T>): Promise<T> => {
  const db = await open();
  try {
    const transaction = db.transaction(STORE, mode);
    const result = await work(transaction.objectStore(STORE));
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('Không thể hoàn tất thao tác kho ảnh.'));
      transaction.onabort = () => reject(transaction.error ?? new Error('Thao tác kho ảnh đã bị hủy.'));
    });
    return result;
  } finally {
    db.close();
  }
};

const blobToDataUrl = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(reader.error ?? new Error('Không thể đọc ảnh để sao lưu.'));
  reader.readAsDataURL(blob);
});

const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => (await fetch(dataUrl)).blob();

const renderImage = async (file: File): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> => {
  const bitmap = await createImageBitmap(file);
  const limit = 1600;
  const scale = Math.min(1, limit / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d', { alpha: true })!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return { canvas, width, height };
};

const detectAlpha = (canvas: HTMLCanvasElement): boolean => {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return false;
  const sampleWidth = Math.min(128, canvas.width);
  const sampleHeight = Math.min(128, canvas.height);
  const data = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
  for (let index = 3; index < data.length; index += 4) if (data[index] < 255) return true;
  return false;
};

const canvasBlob = (canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> => new Promise((resolve) => canvas.toBlob(resolve, type, quality));

export const compressImage = async (file: File, id = normalizeAssetId(file.name)): Promise<ImageAsset> => {
  if (!isSupportedImage(file)) throw new Error(`${file.name}: chỉ hỗ trợ PNG, JPG hoặc WebP; HEIC và tệp khác không được nhập.`);
  if (!id) throw new Error(`${file.name}: không tạo được mã ảnh.`);
  const { canvas, width, height } = await renderImage(file);
  const hasAlpha = detectAlpha(canvas);
  const webp = await canvasBlob(canvas, 'image/webp', hasAlpha ? 0.9 : 0.82);
  const blob = webp && webp.size > 0 ? webp : file;
  return { id, originalName: file.name, mimeType: blob.type || file.type, byteSize: blob.size, width, height, hasAlpha, createdAt: new Date().toISOString(), blob };
};

export const imageDB = {
  async put(asset: ImageAsset): Promise<void> { await withStore('readwrite', (store) => request(store.put(asset)).then(() => undefined)); },
  async get(id: string): Promise<ImageAsset | undefined> { return withStore('readonly', (store) => request(store.get(id)) as Promise<ImageAsset | undefined>); },
  async list(): Promise<ImageAssetMeta[]> {
    const assets = await withStore('readonly', (store) => request(store.getAll()) as Promise<ImageAsset[]>);
    return assets.map(({ blob: _blob, ...meta }) => meta).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async remove(ids: string[]): Promise<void> { await withStore('readwrite', async (store) => { await Promise.all(ids.map((id) => request(store.delete(id)))); }); },
  async clear(): Promise<void> { await withStore('readwrite', (store) => request(store.clear()).then(() => undefined)); },
  async exportAll(): Promise<BackupImageAsset[]> {
    const assets = await withStore('readonly', (store) => request(store.getAll()) as Promise<ImageAsset[]>);
    return Promise.all(assets.map(async ({ blob, ...meta }) => ({ ...meta, dataUrl: await blobToDataUrl(blob) })));
  },
  async importAll(assets: BackupImageAsset[]): Promise<void> {
    const hydrated = await Promise.all(assets.map(async ({ dataUrl, ...meta }) => ({ ...meta, blob: await dataUrlToBlob(dataUrl) })));
    await withStore('readwrite', async (store) => { for (const asset of hydrated) await request(store.put(asset)); });
  },
  async estimate(): Promise<{ usage?: number; quota?: number }> { return navigator.storage?.estimate ? navigator.storage.estimate() : {}; },
};
