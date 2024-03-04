import { TProcess } from '@types';
import { executeCommand } from './executeCommand';

export function getProcesses() {
  return new Promise((resolve, reject) => {
    executeCommand('tasklist', ['/fo', 'csv'])
      .then((tasks) => {
        try {
          const list = tasks as string;

          const response: Array<TProcess> = [];

          list.split('\n').forEach((line, index) => {
            try {
              if (index > 1) {
                const [name, pid, sessionName, sessionNumber, memoryUsage] =
                  line.split('","');

                if (
                  name &&
                  pid &&
                  sessionName &&
                  sessionNumber &&
                  memoryUsage
                ) {
                  const process: TProcess = {
                    name: name.replace('"', ''),
                    pid: Number(pid),
                    sessionName,
                    sessionNumber: Number(sessionNumber),
                    memoryUsage:
                      Number(
                        memoryUsage.replace(' K"', '').replace(/,/g, '')
                      ) || 0,
                  };

                  response.push(process);
                }
              }
            } catch (error) {
              console.error(error);
            }
          });

          resolve(response);
        } catch (error) {
          console.error(error);
          return reject(error);
        }
      })
      .catch((error) => {
        console.error(error);
        return reject(error);
      });
  });
}
