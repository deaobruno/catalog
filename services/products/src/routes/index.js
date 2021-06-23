import express from 'express';
import {errorMiddleware} from '../middlewares/errorMiddleware.js';
import {productMiddleware} from '../middlewares/productMiddleware.js';
import {productController} from '../controllers/productController.js';

const app = express();

app.use(productMiddleware.validateToken);

app.route('/products')
  .post(
    productMiddleware.isAdmin,
    productMiddleware.createRules,
    productMiddleware.validateProduct,
    productController.create
  )
  .get(
    productMiddleware.findRules,
    productMiddleware.validateFind,
    productMiddleware.buildQuery,
    productMiddleware.paginate,
    productController.find
  );

app.route('/products/:id')
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

app.use((req, res) => {
  res.status(404).send({error: 'Not found'});
});

app.use(errorMiddleware.sendError);

export {app};