import { TBackupRoutines } from '@types';
import { getFiles } from './getFiles';
import { existsSync } from 'fs';
import { folderSize } from './folderSize';

const files = getFiles();

export async function getBackupSizes(routines: TBackupRoutines) {
  const sizes: Array<{
    id: string;
    size: number;
  }> = [];

  for (const routine of routines) {
    const backupFolder = `${files.backupsFolder.path}/${routine.id}`;

    if (!existsSync(backupFolder)) {
      continue;
    }

    const size = (await folderSize(backupFolder)) as number;
    sizes.push({ id: routine.id, size: size || 0 });
  }

  return sizes;
}
