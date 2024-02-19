import express from 'express';
import dotenv from 'dotenv';
import gradient from 'gradient-string';
import { addProcessRoutes } from './routes/processes';
import cors from 'cors';

dotenv.config({
  path: '.env',
});

const port = process.env.API_PORT || 3000;

const app = express();
app.use(cors());

app.get('/', (_, res) => {
  res.status(200).send({ status: 'OK' });
});

addProcessRoutes(app);

app.listen(port, () => {
  console.log(
    gradient('pink', 'khaki')(`Server is running at http://localhost:${port}`)
  );
});
