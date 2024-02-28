import forge from 'node-forge';

export function encryptRsa(data: string, publicKey: string) {
  const encrypted = forge.pki.publicKeyFromPem(publicKey).encrypt(data);
  return forge.util.encode64(encrypted);
}
