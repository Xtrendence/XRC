import forge from 'node-forge';
import { getFiles } from './getFiles';
import { readFileSync } from 'fs';

const files = getFiles();

export function encrypt(data: string) {
  try {
    const content = readFileSync(files.settingsFile.path, 'utf-8');
    const settings = JSON.parse(content);
    const key = settings?.decryptionKey;
    const iv = settings?.decryptionIv;
    const cipher = forge.cipher.createCipher(
      'AES-CBC',
      forge.util.hexToBytes(key)
    );
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(data));
    cipher.finish();
    const encrypted = cipher.output;
    return encrypted.toHex();
  } catch (error) {
    console.error(error);
  }
}
