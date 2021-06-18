import {Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import {authController} from '../controllers/authController.js';

const router = Router();

router.post(
  '/login',
  authMiddleware.validateLogin,
  authController.login
);

router.post(
  '/register',
  authMiddleware.validateRegister,
  authController.register
);

router.use(authMiddleware.validateToken);

router.post(
  '/refresh',
  authMiddleware.validateRefresh,
  authController.refresh
);

router.post(
  '/logout',
  authController.logout
);

export {router};