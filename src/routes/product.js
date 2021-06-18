import {Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import {productMiddleware} from '../middlewares/productMiddleware.js';
import {productController} from '../controllers/productController.js';

const router = Router();

router.use(authMiddleware.validateToken);

router.route('/')
  .get(
    productMiddleware.validateFind,
    productController.find
  )
  .post(
    productMiddleware.validateCreate,
    productController.create
  );

router.route('/:id')
  .get(
    productMiddleware.validateId,
    productController.findOne
  )
  .put(
    productMiddleware.validateId,
    productMiddleware.validateUpdate,
    productController.update
  )
  .delete(
    productMiddleware.validateId,
    productController.delete
  );

export {router};