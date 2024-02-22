import type { Express } from 'express';
import { getFiles } from '../utils/getFiles';
import { existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { validJSON } from '../utils/validJSON';
import gradient from 'gradient-string';
import { v4 } from 'uuid';
import { TBackupSettings } from '@types';
import { validateNewBackupSetting } from '../utils/validateNewBackupSetting';
import { formatPath } from '../utils/formatPath';

const files = getFiles();

export function addBackupRoutes(app: Express) {
  console.log(
    gradient('brown', 'khaki', 'brown')('   [✓] Adding backup routes.')
  );

  app.get('/backup', (_, res) => {
    const content = readFileSync(files.backupSettingsFile.path, 'utf-8');
    const settings = (
      validJSON(content) ? JSON.parse(content) : []
    ) as TBackupSettings[];
    res.send({ settings });
  });

  app.post('/backup', (req, res) => {
    const { enabled, name, path, frequency, limit } = req.body;

    const valid = validateNewBackupSetting({
      enabled,
      name,
      path,
      frequency,
      limit,
    });

    if (!valid) {
      res.status(400).send({ message: 'Invalid backup setting.' });
      return;
    }

    const content = readFileSync(files.backupSettingsFile.path, 'utf-8');
    const settings = (
      validJSON(content) ? JSON.parse(content) : []
    ) as TBackupSettings;

    const id = v4();

    const formattedPath = formatPath(path);

    const exists = existsSync(formattedPath);

    if (!exists) {
      res
        .status(400)
        .send({
          message:
            'Path does not exist. Make sure that file or directory exists before creating a backup routine for it.',
        });
      return;
    }

    const isFile = !statSync(formattedPath).isDirectory();

    settings.push({
      id,
      enabled,
      name,
      path: formattedPath,
      frequency,
      limit,
      type: isFile ? 'file' : 'folder',
    });

    writeFileSync(
      files.backupSettingsFile.path,
      JSON.stringify(settings, null, 4)
    );

    res.send({ settings });
  });

  app.put('/backup/:id', (req, res) => {
    const { id } = req.params;
    const { enabled, name, path, frequency, limit } = req.body;

    const valid = validateNewBackupSetting({
      enabled,
      name,
      path,
      frequency,
      limit,
    });

    if (!valid) {
      res.status(400).send({ message: 'Invalid backup setting.' });
      return;
    }

    const content = readFileSync(files.backupSettingsFile.path, 'utf-8');
    const settings = (
      validJSON(content) ? JSON.parse(content) : []
    ) as TBackupSettings;

    const index = settings.findIndex((s) => s.id === id);

    const formattedPath = formatPath(path);

    const exists = existsSync(formattedPath);

    if (!exists) {
      res.status(400).send({ message: 'Path does not exist.' });
      return;
    }

    const isFile = !statSync(formattedPath).isDirectory();

    if (index > -1) {
      settings[index] = {
        id,
        enabled,
        name,
        path: formattedPath,
        frequency,
        limit,
        type: isFile ? 'file' : 'folder',
      };
    } else {
      settings.push({
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
      files.backupSettingsFile.path,
      JSON.stringify(settings, null, 4)
    );

    res.send({ settings });
  });

  app.put('/backup/all', (req, res) => {
    const { enabled } = req.body;

    const content = readFileSync(files.backupSettingsFile.path, 'utf-8');
    const settings = (
      validJSON(content) ? JSON.parse(content) : []
    ) as TBackupSettings;

    settings.forEach((s) => (s.enabled = enabled));

    writeFileSync(
      files.backupSettingsFile.path,
      JSON.stringify(settings, null, 4)
    );

    res.send({ settings });
  });

  app.delete('/backup/:id', (req, res) => {
    const { id } = req.params;

    const content = readFileSync(files.backupSettingsFile.path, 'utf-8');
    const settings = (
      validJSON(content) ? JSON.parse(content) : []
    ) as TBackupSettings;

    const index = settings.findIndex((s) => s.id === id);

    if (index > -1) {
      settings.splice(index, 1);
    }

    writeFileSync(
      files.backupSettingsFile.path,
      JSON.stringify(settings, null, 4)
    );

    res.send({ settings });
  });

  app.delete('/backup/all', (req, res) => {
    writeFileSync(files.backupSettingsFile.path, JSON.stringify([], null, 4));
    res.send({ settings: [] });
  });
}
