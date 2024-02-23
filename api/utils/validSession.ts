import { readFileSync } from 'fs';
import { getFiles } from './getFiles';
import { TSession } from '@types';

const files = getFiles();

export function validSession(token: string) {
  const content = readFileSync(files.sessionsFile.path, 'utf-8');
  const sessions = (JSON.parse(content) || []) as TSession[];

  const session = sessions.find((session) => session.token === token);

  if (!session) {
    return false;
  }

  return true;
}
