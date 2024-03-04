import type { Express } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { getFiles } from '../utils/getFiles';
import gradient from 'gradient-string';
import { TSession } from '@types';
import { validSession } from '../utils/validSession';
import { decryptRsa } from '../utils/decryptRsa';
import bcrypt from 'bcrypt';
import forge from 'node-forge';
import { publicRoutes } from '../middleware/auth';

const files = getFiles();

export function addSessionsRoutes(app: Express) {
  console.log(gradient('pink', 'purple')('    [✓] Adding sessions routes.'));

  app.get('/session/logout/:token/single', (req, res) => {
    try {
      const token = req.params.token;

      const content = readFileSync(files.sessionsFile.path, 'utf-8');
      const sessions = (JSON.parse(content) || []) as TSession[];

      const newSessions = sessions.filter((session) => session.token !== token);

      writeFileSync(
        files.sessionsFile.path,
        JSON.stringify(newSessions, null, 4)
      );

      res.status(200).send({ message: 'Logged out.' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
  });

  app.get('/session/logout/:token/all', (_, res) => {
    try {
      writeFileSync(files.sessionsFile.path, JSON.stringify([]));

      res.status(200).send({ message: 'Logged out everywhere.' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
  });

  app.get(publicRoutes.validateToken, (req, res) => {
    try {
      const token = req.headers?.authorization?.split('Bearer ')[1];

      if (!token) return res.status(401).send({ valid: false });

      const valid = validSession(token);

      if (valid) {
        const content = readFileSync(files.settingsFile.path, 'utf-8');
        const settings = JSON.parse(content);

        res.status(200).send({
          valid,
          token: token,
          passwordChangeRequired: settings?.passwordChangeRequired,
        });
      } else {
        res.status(401).send({ valid });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
  });

  app.post(publicRoutes.login, (req, res) => {
    try {
      const encryptedPassword = req.body?.password;
      const password = decryptRsa(encryptedPassword);

      if (!password)
        return res.status(401).send({ message: 'Invalid password.' });

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

        writeFileSync(
          files.sessionsFile.path,
          JSON.stringify(sessions, null, 4)
        );

        res.status(200).send({
          token,
          passwordChangeRequired: settings?.passwordChangeRequired,
        });
      } else {
        res.status(401).send({ message: 'Invalid password.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
  });
}
