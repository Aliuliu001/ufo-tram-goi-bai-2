import { ClassroomStore, createSampleStore } from './classroom';

const STORAGE_KEY = 'ufo-tram-goi-bai-3d:v1';

const isStore = (value: unknown): value is ClassroomStore => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ClassroomStore>;
  return candidate.version === 1 && Array.isArray(candidate.classrooms) && Array.isArray(candidate.logs) && !!candidate.settings;
};

export const loadStore = (): ClassroomStore => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSampleStore();
    const value: unknown = JSON.parse(raw);
    return isStore(value) ? value : createSampleStore();
  } catch {
    return createSampleStore();
  }
};

export const saveStore = (store: ClassroomStore): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};
