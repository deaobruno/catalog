import express from 'express';
import {errorMiddleware} from '../middlewares/errorMiddleware.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import {authController} from '../controllers/authController.js';

const app = express();

app.post(
  '/auth/login',
  authMiddleware.authRules,
  authMiddleware.validateLogin,
  authController.login
);

app.post(
  '/auth/register',
  authMiddleware.registerRules,
  authMiddleware.validateRegister,
  authController.register
);

app.use(authMiddleware.validateToken);

app.get('/auth/validateToken', (req, res) => res.sendStatus(200));

app.get(
  '/auth/refresh/{refreshToken}',
  authMiddleware.refreshTokenRules,
  authMiddleware.validateRefresh,
  authController.refresh
);

app.get(
  '/auth/logout',
  authController.logout
);

app.get('/auth/isAdmin', authController.isAdmin);

app.use((req, res) => {
  res.status(404).send({error: 'Not found'});
});

app.use(errorMiddleware.sendError);

export {app};