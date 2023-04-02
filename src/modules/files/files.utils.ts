// Создаём утилиты , которые используем в сервисе.
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';

// Утилита для работы со временем создания/загрузки файла.
export const subtractHours = (date: Date, hours: number) => {
  date.setHours(date.getHours() - hours);
  return date;
};

// Утилита для физического удаления файла с сервера.
export const removePhysicalFile = async (path: string) => {
  const isFileExists = existsSync(path);
  if (isFileExists) {
    await unlink(path);
  }
};

// Утилита для физического удаления файлов с сервера.
export const removePhysicalFiles = async (paths: string[]) => {
  const promises: Promise<any>[] = [];
  for (let i = 0; i < paths.length; i += 1) {
    promises.push(removePhysicalFile(paths[i]));
  }
  await Promise.allSettled(promises);
};
