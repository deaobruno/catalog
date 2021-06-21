import express from 'express';
import {errorMiddleware} from '../middlewares/errorMiddleware.js';
import {router as userRouter} from './user.js';

const app = express();

app.use('/user', userRouter);

app.use((req, res) => {
  res.status(404).send({error: 'Not found'});
});

app.use(errorMiddleware.sendError);

export {app};