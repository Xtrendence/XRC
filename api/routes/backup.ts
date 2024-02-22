import type { Express } from 'express';
import { getFiles } from '../utils/getFiles';
import { readFileSync, writeFileSync } from 'fs';
import { validJSON } from '../utils/validJSON';
import gradient from 'gradient-string';
import { v4 } from 'uuid';
import { TBackupSettings } from '../../@types/TBackupSettings';

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

    const content = readFileSync(files.backupSettingsFile.path, 'utf-8');
    const settings = (
      validJSON(content) ? JSON.parse(content) : []
    ) as TBackupSettings;

    const id = v4();

    settings.push({ id, enabled, name, path, frequency, limit });

    writeFileSync(
      files.backupSettingsFile.path,
      JSON.stringify(settings, null, 4)
    );

    res.send({ settings });
  });

  app.put('/backup/:id', (req, res) => {
    const { id } = req.params;
    const { enabled, name, path, frequency, limit } = req.body;

    const content = readFileSync(files.backupSettingsFile.path, 'utf-8');
    const settings = (
      validJSON(content) ? JSON.parse(content) : []
    ) as TBackupSettings;

    const index = settings.findIndex((s) => s.id === id);

    if (index > -1) {
      settings[index] = { id, enabled, name, path, frequency, limit };
    } else {
      settings.push({ id, enabled, name, path, frequency, limit });
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
