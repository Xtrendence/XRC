import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import type { TFiles } from '@types';
import bcrypt from 'bcrypt';
import { validJSON } from './validJSON';
import forge from 'node-forge';

const apiFolder = path.join(__dirname, '../');

export function getFiles() {
  const logsFolder = apiFolder + '/logs';
  const dataFolder = apiFolder + '/data';
  const settingsFolder = dataFolder + '/settings';
  const settingsFile = settingsFolder + '/settings.cfg';
  const backupsFolder = dataFolder + '/backups';
  const backupSettingsFile = settingsFolder + '/backup.cfg';

  const files = {
    apiFolder: {
      type: 'folder',
      path: apiFolder,
    },
    logsFolder: {
      type: 'folder',
      path: logsFolder,
    },
    dataFolder: {
      type: 'folder',
      path: dataFolder,
    },
    settingsFolder: {
      type: 'folder',
      path: settingsFolder,
    },
    settingsFile: {
      type: 'file',
      path: settingsFile,
      defaultContent: JSON.stringify({
        password: undefined,
        passwordChangeRequired: true,
      }),
    },
    backupsFolder: {
      type: 'folder',
      path: backupsFolder,
    },
    backupSettingsFile: {
      type: 'file',
      path: backupSettingsFile,
      defaultContent: JSON.stringify([]),
    },
  } satisfies TFiles;

  Object.values(files).forEach((file) => {
    if (!existsSync(file.path)) {
      if (file.type === 'folder') {
        mkdirSync(file.path);
      } else {
        writeFileSync(file.path, file?.defaultContent || '');
      }
    }
  });

  return files;
}

export function checkSettings() {
  const files = getFiles();

  const settingsFile = files.settingsFile.path;

  const content = readFileSync(settingsFile, 'utf-8');

  const settings = validJSON(content) ? JSON.parse(content) : {};

  if (settings?.password === undefined) {
    settings.password = bcrypt.hashSync('admin', 12);
    settings.passwordChangeRequired = true;
  }

  if (settings?.publicKey === undefined || settings?.privateKey === undefined) {
    const keys = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    settings.publicKey = forge.pki.publicKeyToRSAPublicKeyPem(keys.publicKey);
    settings.privateKey = forge.pki.privateKeyToPem(keys.privateKey);
  }

  if (
    settings?.decryptionKey === undefined ||
    settings?.decryptionIv === undefined
  ) {
    const decryptionKey = forge.util.bytesToHex(forge.random.getBytesSync(16));
    const decryptionIv = forge.util.bytesToHex(forge.random.getBytesSync(16));

    settings.decryptionKey = decryptionKey;
    settings.decryptionIv = decryptionIv;
  }

  writeFileSync(settingsFile, JSON.stringify(settings, null, 4));
}

export function getBinaries() {
  const binariesFolder = apiFolder + 'bin';

  const files = {
    binariesFolder: {
      type: 'folder',
      path: binariesFolder,
    },
    cmdow: {
      type: 'file',
      path: binariesFolder + '\\cmdow.exe',
    },
    cmdtime3: {
      type: 'file',
      path: binariesFolder + '\\cmdtime3.exe',
    },
    setvol: {
      type: 'file',
      path: binariesFolder + '\\SetVol.exe',
    },
    time: {
      type: 'file',
      path: binariesFolder + '\\Time-Executable.exe',
    },
  } satisfies TFiles;

  return files;
}
