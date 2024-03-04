import type { Express } from 'express';
import gradient from 'gradient-string';
import { executeCommand } from '../utils/executeCommand';

export function addPowerRoutes(app: Express) {
  console.log(gradient('red', 'crimson')('    [✓] Adding power routes.'));

  app.post('/shutdown', (_, res) => {
    try {
      executeCommand('shutdown', ['/s']);
      console.log(gradient('red', 'crimson')('Shutting down.'));
      res.status(204);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error.');
    }
  });

  app.post('/restart', (_, res) => {
    try {
      executeCommand('shutdown', ['/r']);
      console.log(gradient('red', 'crimson')('Restarting.'));
      res.status(204);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error.');
    }
  });

  app.post('/sleep', (_, res) => {
    try {
      executeCommand('psshutdown64.exe', ['-d', '-t', '0']);
      console.log(gradient('red', 'crimson')('Putting device to sleep.'));
      res.status(204);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error.');
    }
  });

  app.post('/lock', (_, res) => {
    try {
      executeCommand('Rundll32.exe', ['user32.dll,LockWorkStation']);
      console.log(gradient('red', 'crimson')('Locking.'));
      res.status(204);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error.');
    }
  });
}
