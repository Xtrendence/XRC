import express from 'express';
import dotenv from 'dotenv';
import gradient from 'gradient-string';

dotenv.config();

const port = process.env.API_PORT || 3000;

const app = express();

app.get('/', (_, res) => {
  res.status(200).send({ status: 'OK' });
});

app.listen(port, () => {
  console.log(
    gradient('pink', 'khaki')(`Server is running at http://localhost:${port}`)
  );
});
