import child_process from 'child_process';

export function executeCommand(command: string) {
  return new Promise((resolve, reject) => {
    child_process.exec(command, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr);
      } else if (stdout) {
        resolve(stdout);
      }
    });
  });
}
