import forge from 'node-forge';
import { getFiles } from './getFiles';
import { readFileSync } from 'fs';

const files = getFiles();

export function decrypt(data: string) {
  const content = readFileSync(files.settingsFile.path, 'utf-8');
  const settings = JSON.parse(content);
  const key = settings?.decryptionKey;
  const iv = settings?.decryptionIv;
  const bufferFromHex = forge.util.hexToBytes(data);
  const byteStringBuffer = new forge.util.ByteStringBuffer(bufferFromHex);
  const decipher = forge.cipher.createDecipher(
    'AES-CBC',
    forge.util.hexToBytes(key)
  );
  decipher.start({ iv });
  decipher.update(byteStringBuffer);
  return decipher.output.toString();
}
