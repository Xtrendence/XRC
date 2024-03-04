import type { Express } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { getFiles, checkSettings } from '../utils/getFiles';
import gradient from 'gradient-string';
import { decryptRsa } from '../utils/decryptRsa';
import bcrypt from 'bcrypt';
import { publicRoutes } from '../middleware/auth';

const files = getFiles();

export function addSettingsRoutes(app: Express) {
  console.log(gradient('gray', 'white')('    [✓] Adding settings routes.'));

  app.get('/settings', (_, res) => {
    try {
      checkSettings();
      const content = readFileSync(files.settingsFile.path, 'utf-8');
      const settings = JSON.parse(content);

      if (settings.passwordChangeRequired === true) {
        res.send({ passwordChangeRequired: true });
        return;
      }

      res.send({ settings });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
  });

  app.put('/settings/password', (req, res) => {
    try {
      const encryptedCurrentPassword = req.body?.currentPassword;
      const encryptedNewPassword = req.body?.newPassword;
      const currentPassword = decryptRsa(encryptedCurrentPassword);
      const newPassword = decryptRsa(encryptedNewPassword);

      const content = readFileSync(files.settingsFile.path, 'utf-8');
      const settings = JSON.parse(content);

      if (!currentPassword || !newPassword) {
        res.status(400).send({ message: 'Invalid password.' });
        return;
      }

      const valid = bcrypt.compareSync(currentPassword, settings?.password);

      if (valid) {
        const hash = bcrypt.hashSync(newPassword, 12);

        settings.password = hash;
        settings.passwordChangeRequired = false;

        writeFileSync(
          files.settingsFile.path,
          JSON.stringify(settings, null, 4)
        );

        res.status(200).send({ message: 'Password changed.' });
      } else {
        res.status(401).send({ message: 'Invalid password.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
  });

  app.get(publicRoutes.publicKey, (_, res) => {
    try {
      checkSettings();
      const content = readFileSync(files.settingsFile.path, 'utf-8');
      const settings = JSON.parse(content);
      const publicKey = settings?.publicKey;
      res.send(publicKey);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
  });
}
