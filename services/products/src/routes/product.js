import {Router} from 'express';
import {productMiddleware} from '../middlewares/productMiddleware.js';
import {productController} from '../controllers/productController.js';

const router = Router();

router.use(productMiddleware.validateToken);

router.route('/')
  .get(
    productMiddleware.findRules,
    productMiddleware.validateFind,
    productMiddleware.buildQuery,
    productMiddleware.paginate,
    productController.find
  )
  .post(
    productMiddleware.isAdmin,
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
    productMiddleware.isAdmin,
    productMiddleware.idRules,
    productMiddleware.validateId,
    productMiddleware.updateRules,
    productMiddleware.validateProduct,
    productController.update
  )
  .delete(
    productMiddleware.isAdmin,
    productMiddleware.idRules,
    productMiddleware.validateId,
    productController.delete
  );

export {router};