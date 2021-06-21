import {Router} from 'express';
import {userMiddleware} from '../middlewares/userMiddleware.js';
import {userController} from '../controllers/userController.js';

const router = Router();

router.get('/email/:email', userController.findByEmail);

router.route('/')
  .get(
    userMiddleware.findRules,
    userMiddleware.validateFind,
    userMiddleware.paginate,
    userController.find
  )
  .post(
    userMiddleware.createRules,
    userMiddleware.validateUser,
    userMiddleware.hashPassword,
    userController.create
  );

router.use(userMiddleware.validateToken);

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
    userMiddleware.hashPassword,
    userController.update
  )
  .delete(
    userMiddleware.idRules,
    userMiddleware.validateId,
    userController.delete
  );

export {router};