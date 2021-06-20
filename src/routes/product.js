import {Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import {productMiddleware} from '../middlewares/productMiddleware.js';
import {productController} from '../controllers/productController.js';

const router = Router();

router.use(authMiddleware.validateToken);

router.route('/')
  .get(
    productMiddleware.findRules,
    productMiddleware.validateFind,
    productMiddleware.buildQuery,
    productMiddleware.paginate,
    productController.find
  )
  .post(
    authMiddleware.isAdmin,
    productMiddleware.createRules,
    productMiddleware.validateProduct,
    productController.create
  );

router.route('/:id')
  .get(
    productMiddleware.idRules,
    productMiddleware.validateId,
    productController.findOne
  )
  .put(
    authMiddleware.isAdmin,
    productMiddleware.idRules,
    productMiddleware.validateId,
    productMiddleware.updateRules,
    productMiddleware.validateProduct,
    productController.update
  )
  .delete(
    authMiddleware.isAdmin,
    productMiddleware.idRules,
    productMiddleware.validateId,
    productController.delete
  );

export {router};