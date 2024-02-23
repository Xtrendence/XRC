import type { Express } from 'express';
import { getBinaries } from '../utils/getFiles';
import { exec } from 'child_process';
import gradient from 'gradient-string';

export function addVolumeRoutes(app: Express) {
  console.log(gradient('darkBlue', 'blue')('    [✓] Adding volume routes.'));

  let recentAudioChange = new Date().getTime();

  const binaries = getBinaries();

  app.get('/volume', function (_, res) {
    try {
      exec(`${binaries.setvol.path} report`, (_, stdout) => {
        const parts = stdout.split(' = ');
        const volume = Number(parts[1].split('\r')[0]);

        res.send({ volume, date: new Date() });
      });
    } catch (e) {
      console.log(e);
    }
  });

  app.put('/volume', function (req, res) {
    try {
      const volume = Number(req.body?.volume);

      if (
        volume !== undefined &&
        volume >= 0 &&
        volume <= 100 &&
        new Date().getTime() - recentAudioChange >= 1000
      ) {
        console.log(
          gradient('darkBlue', 'blue')(`Setting volume to ${volume}.`)
        );

        res.send({ volume });

        recentAudioChange = new Date().getTime();
        exec(`${binaries.setvol.path} ${volume}`);
      }
    } catch (e) {
      console.log(e);
    }
  });
}
