import type { Express } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { getFiles } from '../utils/getFiles';
import gradient from 'gradient-string';
import { TSession } from '@types';
import { validSession } from '../utils/validSession';
import { decryptRsa } from '../utils/decryptRsa';
import bcrypt from 'bcrypt';
import forge from 'node-forge';

const files = getFiles();

export function addSessionsRoutes(app: Express) {
  console.log(gradient('pink', 'purple')('    [✓] Adding sessions routes.'));

  app.get('/session/logout/:token', (req, res) => {
    const token = req.params.token;

    const content = readFileSync(files.sessionsFile.path, 'utf-8');
    const sessions = (JSON.parse(content) || []) as TSession[];

    const newSessions = sessions.filter((session) => session.token !== token);

    writeFileSync(
      files.sessionsFile.path,
      JSON.stringify(newSessions, null, 4)
    );

    res.status(200).send({ message: 'Logged out.' });
  });

  // Public route
  app.get('/session/validate/:token', (req, res) => {
    const token = req.params.token;
    const valid = validSession(token);
    res.status(200).send({ valid });
  });

  // Public route
  app.post('/session/login', (req, res) => {
    const encryptedPassword = req.body?.password;
    const password = decryptRsa(encryptedPassword);

    const content = readFileSync(files.settingsFile.path, 'utf-8');
    const settings = JSON.parse(content);
    const validPassword = settings?.password;

    const valid = bcrypt.compareSync(password, validPassword);

    if (valid) {
      const token = forge.util.bytesToHex(forge.random.getBytesSync(16));
      const content = readFileSync(files.sessionsFile.path, 'utf-8');
      const sessions = (JSON.parse(content) || []) as TSession[];

      sessions.push({
        token,
        date: new Date().getTime(),
        datetime: new Date().toISOString(),
      });

      writeFileSync(files.sessionsFile.path, JSON.stringify(sessions, null, 4));

      res.status(200).send({ token });
    } else {
      res.status(401).send({ message: 'Invalid password.' });
    }
  });
}
