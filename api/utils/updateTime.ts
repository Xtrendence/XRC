import { exec } from 'child_process';
import { getBinaries } from './getFiles';

export async function updateTime() {
    try {
        const binaries = getBinaries();
        const timeExecutable = binaries.time.path;
        exec(`cd ${binaries.binariesFolder.path} && ${timeExecutable}`);
    } catch (error) {
        console.error('Error updating time', error);
    }
}
