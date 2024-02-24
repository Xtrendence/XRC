import type { Express } from 'express';
import { getFiles } from '../utils/getFiles';
import { existsSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import { validJSON } from '../utils/validJSON';
import gradient from 'gradient-string';
import { v4 } from 'uuid';
import { TBackupRoutines } from '@types';
import { validateNewBackupRoutine } from '../utils/validateNewBackupRoutine';
import { formatPath } from '../utils/formatPath';
import { performBackups } from '../utils/performBackups';

const files = getFiles();

export function addBackupRoutes(app: Express) {
  console.log(
    gradient('brown', 'khaki', 'brown')('    [✓] Adding backup routes.')
  );

  const interval = process.env.DEV_MODE === 'true' ? 5 : 60;

  performBackups();

  setInterval(performBackups, 1_000 * interval);

  app.get('/backup', (_, res) => {
    const content = readFileSync(files.backupRoutinesFile.path, 'utf-8');
    const routines = (
      validJSON(content) ? JSON.parse(content) : []
    ) as TBackupRoutines[];
    res.send({ routines });
  });

  app.post('/backup', (req, res) => {
    const { enabled, name, path, frequency, limit } = req.body;

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

    routines.push({
      id,
      enabled,
      name,
      path: formattedPath,
      frequency,
      limit,
      type: isFile ? 'file' : 'folder',
    });

    writeFileSync(
      files.backupRoutinesFile.path,
      JSON.stringify(routines, null, 4)
    );

    performBackups();

    res.send({ routines });
  });

  app.put('/backup/:id', (req, res) => {
    const { id } = req.params;
    const { enabled, name, path, frequency, limit } = req.body;

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

    if (index > -1) {
      routines[index] = {
        id,
        enabled,
        name,
        path: formattedPath,
        frequency,
        limit,
        type: isFile ? 'file' : 'folder',
      };
    } else {
      routines.push({
        id,
        enabled,
        name,
        path: formattedPath,
        frequency,
        limit,
        type: isFile ? 'file' : 'folder',
      });
    }

    writeFileSync(
      files.backupRoutinesFile.path,
      JSON.stringify(routines, null, 4)
    );

    performBackups();

    res.send({ routines });
  });

  app.put('/backup/all', (req, res) => {
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

    res.send({ routines });
  });

  app.delete('/backup/:id', (req, res) => {
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

    res.send({ routines });
  });

  app.delete('/backup/all', (req, res) => {
    writeFileSync(files.backupRoutinesFile.path, JSON.stringify([], null, 4));
    res.send({ routines: [] });
  });
}
