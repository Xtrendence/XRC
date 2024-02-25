import { TProcess } from '@types';
import { executeCommand } from './executeCommand';

export function getProcesses() {
  return new Promise((resolve) => {
    executeCommand('tasklist /fo csv').then((tasks) => {
      const list = tasks as string;

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

      resolve(response);
    });
  });
}
