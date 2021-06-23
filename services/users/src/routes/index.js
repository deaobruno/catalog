import express from 'express';
import {errorMiddleware} from '../middlewares/errorMiddleware.js';
import {userMiddleware} from '../middlewares/userMiddleware.js';
import {userController} from '../controllers/userController.js';

const app = express();

app.get('/users/email/:email', userController.findByEmail);

app.use(userMiddleware.validateToken);

app.route('/users')
  .post(
    userMiddleware.createRules,
    userMiddleware.validateUser,
    userMiddleware.hashPassword,
    userController.create
  )
  .get(
    userMiddleware.findRules,
    userMiddleware.validateFind,
    userMiddleware.paginate,
    userController.find
  );

app.route('/users/:id')
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

app.use((req, res) => {
  res.status(404).send({error: 'Not found'});
});

app.use(errorMiddleware.sendError);

export {app};