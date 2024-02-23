import type { Express } from 'express';
import { readFileSync } from 'fs';
import { getFiles, checkSettings } from '../utils/getFiles';
import gradient from 'gradient-string';
import { encryptRsa } from '../utils/encryptRsa';

const files = getFiles();

export function addSettingsRoutes(app: Express) {
  console.log(gradient('gray', 'white')('    [✓] Adding settings routes.'));

  app.get('/key/public', (_, res) => {
    checkSettings();
    const content = readFileSync(files.settingsFile.path, 'utf-8');
    const settings = JSON.parse(content);
    const publicKey = settings?.publicKey;
    res.send(publicKey);
  });

  app.post('/key/decryption', (req, res) => {
    const clientPublicKey = req.body?.publicKey;

    checkSettings();
    const content = readFileSync(files.settingsFile.path, 'utf-8');
    const settings = JSON.parse(content);
    const decryptionKey = settings?.decryptionKey;

    const encryptedKey = encryptRsa(decryptionKey, clientPublicKey);

    res.send({ encryptedKey });
  });
}
