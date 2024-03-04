import type { Express } from 'express';
import { executeCommand } from '../utils/executeCommand';
import { createHash } from 'crypto';
import gradient from 'gradient-string';
import { getProcesses } from '../utils/getProcesses';
import { TProcess } from '@types';

export function addProcessRoutes(app: Express) {
  console.log(gradient('green', 'lime')('    [✓] Adding process routes.'));

  app.get('/processes', async (req, res) => {
    try {
      const response = (await getProcesses()) as Array<TProcess>;

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
    } catch (error) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  });

  app.delete('/processes/:pid', async (req, res) => {
    try {
      const pid = Number(req.params.pid);

      if (
        !pid ||
        isNaN(pid) ||
        typeof pid !== 'number' ||
        pid.toString().length > 10
      ) {
        res.status(400).send('Bad request');
        return;
      }

      const result = await executeCommand(`taskkill`, [`/pid`, `${pid}`, `/f`]);

      console.log(gradient('green', 'lime')(`Killing process "${pid}".`));

      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
      console.error(error);
    }
  });
}
