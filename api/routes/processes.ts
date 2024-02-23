import type { Express } from 'express';
import { executeCommand } from '../utils/executeCommand';
import type { TProcess } from '@types';
import { createHash } from 'crypto';
import gradient from 'gradient-string';

export function addProcessRoutes(app: Express) {
  console.log(gradient('green', 'lime')('    [✓] Adding process routes.'));

  app.get('/processes', async (req, res) => {
    const list = (await executeCommand('tasklist /fo csv')) as string;

    const response: Array<TProcess> = [];

    list.split('\n').forEach((line, index) => {
      if (index > 1) {
        const [name, pid, sessionName, sessionNumber, memoryUsage] =
          line.split('","');

        if (name && pid && sessionName && sessionNumber && memoryUsage) {
          const process: TProcess = {
            name: name.replace('"', ''),
            pid: Number(pid),
            sessionName,
            sessionNumber: Number(sessionNumber),
            memoryUsage:
              Number(memoryUsage.replace(' K"', '').replace(/,/g, '')) || 0,
          };

          response.push(process);
        }
      }
    });

    const responseChecksum = createHash('sha256')
      .update(
        JSON.stringify(
          response
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((p) => {
              return { name: p.name, pid: p.pid };
            })
        )
      )
      .digest('hex');

    if (req.query?.checksum === responseChecksum) {
      res.status(200).send({
        changed: false,
      });

      return;
    }

    const sortedResponse = response.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    res.status(200).send(
      JSON.stringify({
        processes: sortedResponse,
        checksum: responseChecksum,
        changed: true,
      })
    );
  });

  app.delete('/processes/:pid', async (req, res) => {
    const pid = req.params.pid;

    if (!pid) {
      res.status(400).send('Bad request');
      return;
    }

    const result = await executeCommand(`taskkill /pid ${pid} /f`);

    console.log(gradient('green', 'lime')(`Killing process "${pid}".`));

    res.status(200).send(result);
  });
}
