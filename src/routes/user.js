import {Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import {userMiddleware} from '../middlewares/userMiddleware.js';
import {userController} from '../controllers/userController.js';

const router = Router();

router.use(authMiddleware.validateToken);

router.route('/')
  .get(
    userMiddleware.findRules,
    userMiddleware.validateFind,
    userController.find
  )
  .post(
    userMiddleware.createRules,
    userMiddleware.validateUser,
    userController.create
  );

router.route('/:id')
  .get(
    userMiddleware.idRules,
    userMiddleware.validateId,
    userController.findOne
  )
  .put(
    userMiddleware.idRules,
    userMiddleware.validateId,
    userMiddleware.updateRules,
    userMiddleware.validateUser,
    userController.update
  )
  .delete(
    userMiddleware.idRules,
    userMiddleware.validateId,
    userController.delete
  );

export {router};