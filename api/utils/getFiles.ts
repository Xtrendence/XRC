import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import type { TFiles } from '@types';

const apiFolder = path.join(__dirname, '../');

export function getFiles() {
  const logsFolder = apiFolder + '/logs';
  const dataFolder = apiFolder + '/data';
  const settingsFolder = dataFolder + '/settings';
  const backupsFolder = dataFolder + '/backups';
  const backupSettingsFile = settingsFolder + '/backup.cfg';

  const files = {
    apiFolder: {
      type: 'folder',
      path: apiFolder,
    },
    logsFolder: {
      type: 'folder',
      path: logsFolder,
    },
    dataFolder: {
      type: 'folder',
      path: dataFolder,
    },
    settingsFolder: {
      type: 'folder',
      path: settingsFolder,
    },
    backupsFolder: {
      type: 'folder',
      path: backupsFolder,
    },
    backupSettingsFile: {
      type: 'file',
      path: backupSettingsFile,
      defaultContent: JSON.stringify([]),
    },
  } satisfies TFiles;

  Object.values(files).forEach((file) => {
    if (!existsSync(file.path)) {
      if (file.type === 'folder') {
        mkdirSync(file.path);
      } else {
        writeFileSync(file.path, file?.defaultContent || '');
      }
    }
  });

  return files;
}

export function getBinaries() {
  const binariesFolder = apiFolder + 'bin';

  const files = {
    binariesFolder: {
      type: 'folder',
      path: binariesFolder,
    },
    cmdow: {
      type: 'file',
      path: binariesFolder + '\\cmdow.exe',
    },
    cmdtime3: {
      type: 'file',
      path: binariesFolder + '\\cmdtime3.exe',
    },
    setvol: {
      type: 'file',
      path: binariesFolder + '\\SetVol.exe',
    },
    time: {
      type: 'file',
      path: binariesFolder + '\\Time-Executable.exe',
    },
  } satisfies TFiles;

  return files;
}
