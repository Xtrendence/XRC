import forge from 'node-forge';

export function encryptRsa(data: string, publicKey: string) {
  try {
    const encrypted = forge.pki.publicKeyFromPem(publicKey).encrypt(data);
    return forge.util.encode64(encrypted);
  } catch (error) {
    console.error(error);
  }
}
