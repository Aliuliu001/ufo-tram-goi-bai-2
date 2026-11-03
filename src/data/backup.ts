import { imageDB, BackupImageAsset } from './imageDB';
import { ClassroomStore } from '../domain/classroom';
import { QuestionBank } from '../domain/questionBank';

export interface GameBackup {
  format: 'ufo-tram-goi-bai-backup';
  version: 1;
  exportedAt: string;
  classroomStore: ClassroomStore;
  questionBank: QuestionBank;
  images: BackupImageAsset[];
}

export const createBackup = async (classroomStore: ClassroomStore, questionBank: QuestionBank): Promise<GameBackup> => ({
  format: 'ufo-tram-goi-bai-backup',
  version: 1,
  exportedAt: new Date().toISOString(),
  classroomStore,
  questionBank,
  images: await imageDB.exportAll(),
});

export const parseBackup = (raw: string): GameBackup => {
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new Error('File backup không phải JSON hợp lệ.'); }
  const backup = value as Partial<GameBackup>;
  if (backup.format !== 'ufo-tram-goi-bai-backup' || backup.version !== 1 || !backup.classroomStore || !backup.questionBank || !Array.isArray(backup.images)) {
    throw new Error('File backup không đúng định dạng UFO Trạm Gọi Bài. Dữ liệu hiện tại chưa bị thay đổi.');
  }
  if (!backup.images.every((image) => typeof image.id === 'string' && typeof image.dataUrl === 'string' && image.dataUrl.startsWith('data:image/'))) {
    throw new Error('Backup chứa ảnh không hợp lệ. Dữ liệu hiện tại chưa bị thay đổi.');
  }
  return backup as GameBackup;
};

/** Call only after teacher confirmation. Images are written before app metadata is replaced. */
export const restoreImagesFirst = async (backup: GameBackup): Promise<void> => {
  await imageDB.importAll(backup.images);
};
