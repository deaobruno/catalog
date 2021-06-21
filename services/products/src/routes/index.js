import express from 'express';
import {errorMiddleware} from '../middlewares/errorMiddleware.js';
import {router as productRouter} from './product.js';

const app = express();

app.use('/product', productRouter);

app.use((req, res) => {
  res.status(404).send({error: 'Not found'});
});

app.use(errorMiddleware.sendError);

export {app};