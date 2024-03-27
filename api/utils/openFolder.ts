import { execSync } from 'child_process';

export function openFolder(path: string) {
    execSync(`start "" "${path}"`, {
        windowsHide: true,
        stdio: 'pipe',
    });
}
