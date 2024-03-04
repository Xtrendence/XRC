import type { Express } from 'express';
import { validSession } from '../utils/validSession';

export const publicRoutes = {
  validateToken: '/session/validate',
  login: '/session/login',
  publicKey: '/key/public',
};

export function addAuthMiddleware(app: Express) {
  const routes = Object.values(publicRoutes);

  app.use((req, res, next) => {
    try {
      const publicRoute = routes.some((route) => {
        return req.path.startsWith(route.replace(/\/:[^/]+/g, ''));
      });

      if (publicRoute) {
        next();
        return;
      }

      const token = req.headers?.authorization?.split('Bearer ')[1];

      if (token) {
        const valid = validSession(token);

        if (valid) {
          next();
        } else {
          res.status(401).send({ message: 'Unauthorized.' });
        }
      } else {
        res.status(401).send({ message: 'Unauthorized.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
  });
}
