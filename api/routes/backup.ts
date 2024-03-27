import type { Express } from 'express';
import { getFiles } from '../utils/getFiles';
import {
    existsSync,
    mkdirSync,
    readFileSync,
    rmSync,
    statSync,
    writeFileSync,
} from 'fs';
import { validJSON } from '../utils/validJSON';
import gradient from 'gradient-string';
import directoryTree from 'directory-tree';
import { v4 } from 'uuid';
import { TBackupFiles, TBackupRoutine, TBackupRoutines } from '@types';
import { validateNewBackupRoutine } from '../utils/validateNewBackupRoutine';
import { formatPath } from '../utils/formatPath';
import { performBackups } from '../utils/performBackups';
import { getBackupSizes } from '../utils/getBackupSizes';
import { openFolder } from '../utils/openFolder';

const files = getFiles();

export function addBackupRoutes(app: Express) {
    console.log(
        gradient('brown', 'khaki', 'brown')('    [✓] Adding backup routes.')
    );

    const interval = process.env.DEV_MODE === 'true' ? 5 : 60;

    performBackups();

    setInterval(performBackups, 1_000 * interval);

    app.get('/backup', async (_, res) => {
        try {
            const content = readFileSync(
                files.backupRoutinesFile.path,
                'utf-8'
            );
            const routines = (
                validJSON(content) ? JSON.parse(content) : []
            ) as Array<TBackupRoutine>;

            const sizes = await getBackupSizes(routines);

            res.send({ routines, sizes });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error.' });
        }
    });

    app.get('/backup/files', async (_, res) => {
        try {
            const content = readFileSync(
                files.backupRoutinesFile.path,
                'utf-8'
            );
            const routines = (
                validJSON(content) ? JSON.parse(content) : []
            ) as Array<TBackupRoutine>;

            const sizes = await getBackupSizes(routines);

            const backups =
                routines.map((routine) => {
                    const backupFolder = `${files.backupsFolder.path}/${routine.id}`;
                    const tree = directoryTree(backupFolder, {
                        attributes: ['size', 'type', 'extension'],
                    });
                    return { routine: routine, files: tree };
                }) || ([] as TBackupFiles);

            res.send({ backups, sizes });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error.' });
        }
    });

    app.get('/backup/open/:id/:path', async (req, res) => {
        try {
            const { id, path } = req.params;

            if (!['source', 'backup'].includes(path)) {
                res.status(400).send({
                    message: 'Invalid path. Must be "source" or "backup".',
                });
                return;
            }

            const content = readFileSync(
                files.backupRoutinesFile.path,
                'utf-8'
            );

            const routines = (
                validJSON(content) ? JSON.parse(content) : []
            ) as TBackupRoutines;

            const routine = routines.find((r) => r.id === id);

            if (!routine) {
                res.status(404).send({ message: 'Backup routine not found.' });
                return;
            }

            const formattedPath =
                path === 'source'
                    ? routine.path
                    : `${files.backupsFolder.path}/${id}`;

            const exists = existsSync(formattedPath);

            if (!exists) {
                res.status(400).send({ message: 'Path does not exist.' });
                return;
            }

            const parentPath = formattedPath.split('/').slice(0, -1).join('/');

            const openPath =
                routine.type === 'file' && path === 'source'
                    ? parentPath.replace(/\\/g, '/').replace('//', '/')
                    : formattedPath.replace(/\\/g, '/').replace('//', '/');

            console.log(
                `Opening path ${openPath} which is a ${routine.type} (${path}). Path exists: ${exists}.`
            );

            try {
                openFolder(openPath);
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: 'Internal server error.' });
                return;
            }

            res.status(200).send({ message: 'Opening folder.' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error.' });
        }
    });

    app.post('/backup', async (req, res) => {
        try {
            const { enabled, name, path, frequency, limit, dependencies } =
                req.body;

            const valid = validateNewBackupRoutine({
                enabled,
                name,
                path,
                frequency,
                limit,
            });

            if (!valid) {
                res.status(400).send({ message: 'Invalid backup routine.' });
                return;
            }

            const content = readFileSync(
                files.backupRoutinesFile.path,
                'utf-8'
            );
            const routines = (
                validJSON(content) ? JSON.parse(content) : []
            ) as TBackupRoutines;

            const id = v4();

            const formattedPath = formatPath(path);

            const exists = existsSync(formattedPath);

            if (!exists) {
                res.status(400).send({
                    message:
                        'Path does not exist. Make sure that file or directory exists before creating a backup routine for it.',
                });
                return;
            }

            const isFile = !statSync(formattedPath).isDirectory();

            const routinePath = isFile
                ? formattedPath
                : formattedPath.charAt(formattedPath.length - 1) === '/'
                ? formattedPath
                : `${formattedPath}/`;

            routines.push({
                id,
                enabled,
                name,
                path: routinePath,
                frequency,
                limit,
                type: isFile ? 'file' : 'folder',
                dependencies: dependencies || [],
            });

            writeFileSync(
                files.backupRoutinesFile.path,
                JSON.stringify(routines, null, 4)
            );

            performBackups();

            const sizes = await getBackupSizes(routines);

            res.send({ routines, sizes });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error.' });
        }
    });

    app.put('/backup/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { enabled, name, path, frequency, limit, dependencies } =
                req.body;

            const valid = validateNewBackupRoutine({
                enabled,
                name,
                path,
                frequency,
                limit,
            });

            if (!valid) {
                res.status(400).send({ message: 'Invalid backup routines.' });
                return;
            }

            const content = readFileSync(
                files.backupRoutinesFile.path,
                'utf-8'
            );
            const routines = (
                validJSON(content) ? JSON.parse(content) : []
            ) as TBackupRoutines;

            const index = routines.findIndex((s) => s.id === id);

            const formattedPath = formatPath(path);

            const exists = existsSync(formattedPath);

            if (!exists) {
                res.status(400).send({ message: 'Path does not exist.' });
                return;
            }

            const isFile = !statSync(formattedPath).isDirectory();

            const routinePath = isFile
                ? formattedPath
                : formattedPath.charAt(formattedPath.length - 1) === '/'
                ? formattedPath
                : `${formattedPath}/`;

            const routine = {
                id,
                enabled,
                name,
                path: routinePath,
                frequency,
                limit,
                type: isFile ? 'file' : 'folder',
                dependencies: dependencies || [],
            } satisfies TBackupRoutine;

            if (index > -1) {
                routines[index] = routine;
            } else {
                routines.push(routine);
            }

            writeFileSync(
                files.backupRoutinesFile.path,
                JSON.stringify(routines, null, 4)
            );

            performBackups();

            const sizes = await getBackupSizes(routines);

            res.send({ routines, sizes });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error.' });
        }
    });

    app.put('/backup/all', async (req, res) => {
        try {
            const { enabled } = req.body;

            const content = readFileSync(
                files.backupRoutinesFile.path,
                'utf-8'
            );
            const routines = (
                validJSON(content) ? JSON.parse(content) : []
            ) as TBackupRoutines;

            routines.forEach((s) => (s.enabled = enabled));

            writeFileSync(
                files.backupRoutinesFile.path,
                JSON.stringify(routines, null, 4)
            );

            performBackups();

            const sizes = await getBackupSizes(routines);

            res.send({ routines, sizes });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error.' });
        }
    });

    app.delete('/backup/all', (_, res) => {
        try {
            writeFileSync(
                files.backupRoutinesFile.path,
                JSON.stringify([], null, 4)
            );
            rmSync(files.backupsFolder.path, { recursive: true, force: true });
            mkdirSync(files.backupsFolder.path);
            res.send({ routines: [], sizes: [] });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error.' });
        }
    });

    app.delete('/backup/routine/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { keepFiles } = req.body;

            const content = readFileSync(
                files.backupRoutinesFile.path,
                'utf-8'
            );
            const routines = (
                validJSON(content) ? JSON.parse(content) : []
            ) as TBackupRoutines;

            const index = routines.findIndex((s) => s.id === id);

            if (index > -1) {
                routines.splice(index, 1);
            }

            writeFileSync(
                files.backupRoutinesFile.path,
                JSON.stringify(routines, null, 4)
            );

            if (keepFiles === false) {
                const backupFolder = `${files.backupsFolder.path}/${id}`;
                rmSync(backupFolder, { recursive: true, force: true });
            }

            const sizes = await getBackupSizes(routines);

            res.send({ routines, sizes });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error.' });
        }
    });

    app.delete('/backup/files/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { date } = req.body;

            const backupFolder = `${files.backupsFolder.path}/${id}/${date}`;

            if (!existsSync(backupFolder)) {
                res.status(400).send({
                    message: 'Backup folder does not exist.',
                });
                return;
            }

            rmSync(backupFolder, { recursive: true, force: true });

            const content = readFileSync(
                files.backupRoutinesFile.path,
                'utf-8'
            );
            const routines = (
                validJSON(content) ? JSON.parse(content) : []
            ) as TBackupRoutines;

            const sizes = await getBackupSizes(routines);

            res.send({ routines, sizes });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error.' });
        }
    });
}
