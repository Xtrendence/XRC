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
import { getProcesses } from './getProcesses';
import { TProcess } from '../../@types/TProcess';
import { hashElement } from 'folder-hash';

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

  return backups || [];
}

function checkLimit(routine: TBackupRoutine) {
  const backupFolder = `${files.backupsFolder.path}/${routine.id}`;

  const backups = getBackups(routine);

  if (backups.length > routine.limit) {
    const file = `${backupFolder}/${backups[0]}`;
    rmSync(file, { recursive: true, force: true });
  }
}

async function hasChanges(
  backupFolder: string,
  latestBackup: string,
  routine: TBackupRoutine
) {
  try {
    const latestBackupFolder = `${backupFolder}/${latestBackup}`;

    const latestBackupContent =
      routine.type === 'file'
        ? `${latestBackupFolder}/${readdirSync(latestBackupFolder, 'utf-8')[0]}`
        : latestBackupFolder;

    const latestBackupHash = await hashElement(latestBackupContent, {
      encoding: 'hex',
    });

    const currentHash = await hashElement(routine.path, {
      encoding: 'hex',
    });

    if (routine.type === 'file') {
      if (latestBackupHash.hash === currentHash.hash) {
        return false;
      }
    } else {
      const latestBackupHashes = latestBackupHash.children
        .map((child) => child.hash)
        .sort();
      const currentHashes = currentHash.children
        .map((child) => child.hash)
        .sort();

      if (latestBackupHashes.join() === currentHashes.join()) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.log(error);
    return true;
  }
}

export function performBackups() {
  const files = getFiles();
  const content = readFileSync(files.backupRoutinesFile.path, 'utf-8');
  const routines: TBackupRoutines = JSON.parse(content) || [];

  routines
    .filter((routine) => routine.enabled === true)
    .forEach(async (routine) => {
      try {
        const backupFolder = `${files.backupsFolder.path}/${routine.id}`;

        const latestBackup = getBackups(routine).pop();

        if (existsSync(backupFolder) && latestBackup) {
          const checkChanges = await hasChanges(
            backupFolder,
            latestBackup,
            routine
          );

          if (!checkChanges) {
            return;
          }
        }

        const hasDependencies =
          routine?.dependencies && routine?.dependencies?.length > 0;

        if (hasDependencies) {
          const processes = (await getProcesses()) as Array<TProcess>;
          const dependencies = routine.dependencies as Array<string>;

          const isRunning = dependencies.every((dependency) => {
            return processes.some((process) => process.name === dependency);
          });

          if (!isRunning) {
            return;
          }
        }

        const date = new Date();

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
      } catch (error) {
        console.error(error);
      }
    });
}
