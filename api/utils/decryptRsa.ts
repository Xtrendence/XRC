import forge from 'node-forge';
import { getFiles } from './getFiles';
import { readFileSync } from 'fs';

const files = getFiles();

export function decryptRsa(data: string) {
  try {
    const content = readFileSync(files.settingsFile.path, 'utf-8');
    const settings = JSON.parse(content);
    const privateKey = settings?.privateKey;
    const decodedData = forge.util.decode64(data);
    const decrypted = forge.pki
      .privateKeyFromPem(privateKey)
      .decrypt(decodedData);
    return decrypted;
  } catch (error) {
    console.error(error);
  }
}
