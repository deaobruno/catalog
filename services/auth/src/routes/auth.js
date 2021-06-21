import {Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import {authController} from '../controllers/authController.js';

const router = Router();

router.post(
  '/login',
  authMiddleware.authRules,
  authMiddleware.validateLogin,
  authController.login
);

router.post(
  '/register',
  authMiddleware.registerRules,
  authMiddleware.validateRegister,
  authController.register
);

router.use(authMiddleware.validateToken);

router.post(
  '/refresh',
  authMiddleware.refreshTokenRules,
  authMiddleware.validateRefresh,
  authController.refresh
);

router.post(
  '/logout',
  authController.logout
);

router.get('/isAdmin', authController.isAdmin);

export {router};