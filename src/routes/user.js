import {Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import {userMiddleware} from '../middlewares/userMiddleware.js';
import {userController} from '../controllers/userController.js';

const router = Router();

router.use(authMiddleware.validateToken);

router.route('/')
  .get(
    userMiddleware.validateFind,
    userController.find
  )
  .post(
    userMiddleware.validateCreate,
    userController.create
  );

router.route('/:id')
  .get(
    userMiddleware.validateId,
    userController.findOne
  )
  .put(
    userMiddleware.validateId,
    userMiddleware.validateUpdate,
    userController.update
  )
  .delete(
    userMiddleware.validateId,
    userController.delete
  );

export {router};