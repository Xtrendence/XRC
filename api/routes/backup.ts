import type { Express } from 'express';
import { getFiles } from '../utils/getFiles';
import { existsSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import { validJSON } from '../utils/validJSON';
import gradient from 'gradient-string';
import { v4 } from 'uuid';
import { TBackupRoutine, TBackupRoutines } from '@types';
import { validateNewBackupRoutine } from '../utils/validateNewBackupRoutine';
import { formatPath } from '../utils/formatPath';
import { performBackups } from '../utils/performBackups';
import { folderSize } from '../utils/folderSize';

const files = getFiles();

async function getSizes(routines: TBackupRoutines) {
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

export function addBackupRoutes(app: Express) {
  console.log(
    gradient('brown', 'khaki', 'brown')('    [✓] Adding backup routes.')
  );

  const interval = process.env.DEV_MODE === 'true' ? 5 : 60;

  performBackups();

  setInterval(performBackups, 1_000 * interval);

  app.get('/backup', async (_, res) => {
    const content = readFileSync(files.backupRoutinesFile.path, 'utf-8');
    const routines = (
      validJSON(content) ? JSON.parse(content) : []
    ) as Array<TBackupRoutine>;

    const sizes = await getSizes(routines);

    res.send({ routines, sizes });
  });

  app.post('/backup', async (req, res) => {
    const { enabled, name, path, frequency, limit, dependencies } = req.body;

    const valid = validateNewBackupRoutine({
      enabled,
      name,
      path,
      frequency,
      limit,
    });

    if (!valid) {
      res.status(400).send({ message: 'Invalid backup routine.' });
      return;
    }

    const content = readFileSync(files.backupRoutinesFile.path, 'utf-8');
    const routines = (
      validJSON(content) ? JSON.parse(content) : []
    ) as TBackupRoutines;

    const id = v4();

    const formattedPath = formatPath(path);

    const exists = existsSync(formattedPath);

    if (!exists) {
      res.status(400).send({
        message:
          'Path does not exist. Make sure that file or directory exists before creating a backup routine for it.',
      });
      return;
    }

    const isFile = !statSync(formattedPath).isDirectory();

    const routinePath = isFile
      ? formattedPath
      : formattedPath.charAt(formattedPath.length - 1) === '/'
      ? formattedPath
      : `${formattedPath}/`;

    routines.push({
      id,
      enabled,
      name,
      path: routinePath,
      frequency,
      limit,
      type: isFile ? 'file' : 'folder',
      dependencies: dependencies || [],
    });

    writeFileSync(
      files.backupRoutinesFile.path,
      JSON.stringify(routines, null, 4)
    );

    performBackups();

    const sizes = await getSizes(routines);

    res.send({ routines, sizes });
  });

  app.put('/backup/:id', async (req, res) => {
    const { id } = req.params;
    const { enabled, name, path, frequency, limit, dependencies } = req.body;

    const valid = validateNewBackupRoutine({
      enabled,
      name,
      path,
      frequency,
      limit,
    });

    if (!valid) {
      res.status(400).send({ message: 'Invalid backup routines.' });
      return;
    }

    const content = readFileSync(files.backupRoutinesFile.path, 'utf-8');
    const routines = (
      validJSON(content) ? JSON.parse(content) : []
    ) as TBackupRoutines;

    const index = routines.findIndex((s) => s.id === id);

    const formattedPath = formatPath(path);

    const exists = existsSync(formattedPath);

    if (!exists) {
      res.status(400).send({ message: 'Path does not exist.' });
      return;
    }

    const isFile = !statSync(formattedPath).isDirectory();

    const routinePath = isFile
      ? formattedPath
      : formattedPath.charAt(formattedPath.length - 1) === '/'
      ? formattedPath
      : `${formattedPath}/`;

    const routine = {
      id,
      enabled,
      name,
      path: routinePath,
      frequency,
      limit,
      type: isFile ? 'file' : 'folder',
      dependencies: dependencies || [],
    } satisfies TBackupRoutine;

    if (index > -1) {
      routines[index] = routine;
    } else {
      routines.push(routine);
    }

    writeFileSync(
      files.backupRoutinesFile.path,
      JSON.stringify(routines, null, 4)
    );

    performBackups();

    const sizes = await getSizes(routines);

    res.send({ routines, sizes });
  });

  app.put('/backup/all', async (req, res) => {
    const { enabled } = req.body;

    const content = readFileSync(files.backupRoutinesFile.path, 'utf-8');
    const routines = (
      validJSON(content) ? JSON.parse(content) : []
    ) as TBackupRoutines;

    routines.forEach((s) => (s.enabled = enabled));

    writeFileSync(
      files.backupRoutinesFile.path,
      JSON.stringify(routines, null, 4)
    );

    performBackups();

    const sizes = await getSizes(routines);

    res.send({ routines, sizes });
  });

  app.delete('/backup/:id', async (req, res) => {
    const { id } = req.params;
    const { keepFiles } = req.body;

    const content = readFileSync(files.backupRoutinesFile.path, 'utf-8');
    const routines = (
      validJSON(content) ? JSON.parse(content) : []
    ) as TBackupRoutines;

    const index = routines.findIndex((s) => s.id === id);

    if (index > -1) {
      routines.splice(index, 1);
    }

    writeFileSync(
      files.backupRoutinesFile.path,
      JSON.stringify(routines, null, 4)
    );

    if (keepFiles === false) {
      const backupFolder = `${files.backupsFolder.path}/${id}`;
      rmSync(backupFolder, { recursive: true, force: true });
    }

    const sizes = await getSizes(routines);

    res.send({ routines, sizes });
  });

  app.delete('/backup/all', (_, res) => {
    writeFileSync(files.backupRoutinesFile.path, JSON.stringify([], null, 4));
    res.send({ routines: [], sizes: [] });
  });
}
