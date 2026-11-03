export type StorageMode = 'persistent' | 'session';

/**
 * A small localStorage wrapper that keeps the game usable when embedded
 * browsers or private mode reject storage writes. Session mode is deliberate:
 * callers can warn the teacher that closing the page will discard changes.
 */
export class SafeStore {
  private memory = new Map<string, string>();
  private mode: StorageMode = 'persistent';

  get storageMode(): StorageMode {
    return this.mode;
  }

  getItem(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      this.mode = 'session';
      return this.memory.get(key) ?? null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      this.mode = 'session';
      this.memory.set(key, value);
    }
  }

  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      this.mode = 'session';
      this.memory.delete(key);
    }
  }
}

export const safeStore = new SafeStore();
