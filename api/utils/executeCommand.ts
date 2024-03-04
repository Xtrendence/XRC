import child_process from 'child_process';

export function executeCommand(
  command: string,
  args: Array<string>,
  killOnMessage?: boolean
) {
  return new Promise((resolve, reject) => {
    try {
      const process = child_process.spawn(command, args, {
        windowsHide: true,
        detached: true,
      });

      let result = '';
      let error = '';

      process.on('error', (data) => {
        error += data?.toString();
        process.kill();
        return reject(data?.toString());
      });

      process.stdout.on('data', (data) => {
        result += data?.toString();
      });

      process.stderr.on('data', (data) => {
        error += data?.toString();
        process.kill();
        return reject(data?.toString());
      });

      process.on('exit', () => {
        if (error) return reject(error);
        return resolve(result);
      });

      process.on('close', () => {
        if (error) return reject(error);
        return resolve(result);
      });

      process.on('message', () => {
        if (killOnMessage) {
          return process.kill();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
