import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'fs';
import { getFiles } from './getFiles';
import { TBackupRoutine, TBackupRoutines } from '../../@types/TBackupRoutine';

const files = getFiles();

function getBackups(routine: TBackupRoutine) {
  const backupFolder = `${files.backupsFolder.path}/${routine.id}`;

  if (!existsSync(backupFolder)) {
    return [];
  }

  const backups = readdirSync(backupFolder)
    .map(function (filename) {
      return {
        name: filename,
        time: Number(filename.split('-')[0]),
      };
    })
    .sort(function (a, b) {
      return a.time - b.time;
    })
    .map(function (v) {
      return v.name;
    });

  return backups;
}

function checkLimit(routine: TBackupRoutine) {
  const backupFolder = `${files.backupsFolder.path}/${routine.id}`;

  const backups = getBackups(routine);

  if (backups.length > routine.limit) {
    const file = `${backupFolder}/${backups[0]}`;
    rmSync(file, { recursive: true, force: true });
  }
}

export function performBackups() {
  const files = getFiles();
  const content = readFileSync(files.backupRoutinesFile.path, 'utf-8');
  const routines: TBackupRoutines = JSON.parse(content);

  routines
    .filter((routine) => routine.enabled === true)
    .forEach((routine) => {
      const backupFolder = `${files.backupsFolder.path}/${routine.id}`;

      const date = new Date();

      const latestBackup = getBackups(routine).pop();

      const requiresBackup =
        process.env.DEV_MODE === 'true' ||
        !latestBackup ||
        date.getTime() - Number(latestBackup.split('-')[0]) >
          routine.frequency * 60 * 1000;

      if (!requiresBackup) {
        return;
      }

      const backupFiles = `${backupFolder}/${date.getTime()}-${date
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '')
        .replace(/:/g, '-')}/`;

      if (!existsSync(backupFolder)) {
        mkdirSync(backupFolder);
      }

      if (!existsSync(backupFiles)) {
        mkdirSync(backupFiles);
      }

      if (routine.type === 'folder') {
        cpSync(routine.path, backupFiles, { recursive: true });
      } else {
        const filename = routine.path.split('/').pop();
        copyFileSync(routine.path, backupFiles + filename);
      }

      checkLimit(routine);
    });
}
