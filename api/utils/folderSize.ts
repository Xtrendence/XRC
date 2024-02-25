import fastFolderSize from 'fast-folder-size';

export function folderSize(path: string) {
  return new Promise((resolve) => {
    fastFolderSize(path, (error, bytes) => {
      if (error) {
        throw error;
      }

      resolve(bytes || 0);
    });
  });
}
