import { statSync, readdirSync } from 'fs';

export function folderSize(folder: string) {
    try {
        const stats = statSync(folder);
        if (stats.isFile()) {
            return stats.size;
        }

        let size = 0;
        const files = readdirSync(folder);

        for (const file of files) {
            size += folderSize(`${folder}/${file}`) || 0;
        }

        return size;
    } catch (error) {
        console.error(error);
    }
}
