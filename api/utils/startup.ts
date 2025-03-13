import { readFileSync } from 'fs';
import { getFiles } from './getFiles';
import { updateTime } from './updateTime';
import { checkLimitForAllRoutines } from './performBackups';

export function startup() {
    const files = getFiles();

    const settingsFile = files.settingsFile.path;
    const settings = JSON.parse(readFileSync(settingsFile).toString());

    const shouldUpdateTime =
        settings.updateTime === undefined ? true : settings.updateTime;

    if (shouldUpdateTime) {
        updateTime();
    }

    setInterval(() => {
        checkLimitForAllRoutines();
    }, 60_000);
}
