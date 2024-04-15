import express from 'express';
import dotenv from 'dotenv';
import gradient from 'gradient-string';
import cors from 'cors';
import { checkSettings } from './utils/getFiles';
import { addProcessRoutes } from './routes/processes';
import { addVolumeRoutes } from './routes/volume';
import { addPowerRoutes } from './routes/power';
import { addBackupRoutes } from './routes/backup';
import { addSettingsRoutes } from './routes/settings';
import { addSessionsRoutes } from './routes/sessions';
import { addAuthMiddleware } from './middleware/auth';
import { startup } from './utils/startup';

dotenv.config({
    path: '.env',
});

const port = process.env.API_PORT || 3040;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
    res.status(200).send({ status: 'OK' });
});

checkSettings();
startup();

addAuthMiddleware(app);

console.log(gradient('cyan', 'blue')('\n[-] Adding routes...'));

addProcessRoutes(app);
addVolumeRoutes(app);
addPowerRoutes(app);
addBackupRoutes(app);
addSessionsRoutes(app);
addSettingsRoutes(app);

console.log(
    gradient('orange', 'yellow')('\n[✓] All routes added. Starting server...')
);

app.listen(port, () => {
    console.log(
        gradient(
            'pink',
            'khaki'
        )(`\n--> Server is running at http://localhost:${port}`)
    );
});
