import { exec } from 'child_process';
import type { Express } from 'express';
import gradient from 'gradient-string';

export function addPowerRoutes(app: Express) {
  console.log(gradient('red', 'crimson')('   [✓] Adding power routes.'));

  app.post('/shutdown', (_, res) => {
    exec('shutdown /s');
    console.log(gradient('red', 'crimson')('Shutting down.'));
    res.status(204);
  });

  app.post('/restart', (_, res) => {
    exec('shutdown /r');
    console.log(gradient('red', 'crimson')('Restarting.'));
    res.status(204);
  });

  app.post('/sleep', (_, res) => {
    exec('psshutdown64.exe -d -t 0');
    console.log(gradient('red', 'crimson')('Putting device to sleep.'));
    res.status(204);
  });

  app.post('/lock', (_, res) => {
    exec('Rundll32.exe user32.dll,LockWorkStation');
    console.log(gradient('red', 'crimson')('Locking.'));
    res.status(204);
  });
}
