import express from 'express';
import {errorMiddleware} from '../middlewares/errorMiddleware.js';
import {router as authRouter} from './auth.js';

const app = express();

app.use('/auth', authRouter);

app.use((req, res) => {
  res.status(404).send({error: 'Not found'});
});

app.use(errorMiddleware.sendError);

export {app};