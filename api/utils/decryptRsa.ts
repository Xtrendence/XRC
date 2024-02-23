import forge from 'node-forge';
import { getFiles } from './getFiles';
import { readFileSync } from 'fs';

const files = getFiles();

export function decryptRsa(data: string) {
  const content = readFileSync(files.settingsFile.path, 'utf-8');
  const settings = JSON.parse(content);
  const privateKey = settings?.privateKey;
  const decrypted = forge.pki.privateKeyFromPem(privateKey).decrypt(data);
  return decrypted;
}
