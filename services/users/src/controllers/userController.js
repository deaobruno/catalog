import {User} from '../models/user.js';

class UserController {
  async create(req, res, next) {
    try {
      const user = await User.create(req.body);

      const {_id, name, email} = user;

      res.status(201).send({_id, name, email});
    } catch(err) {
      next(err);
    }
  }

  async findOne(req, res, next) {
    try {
      const user = await User.findById(req.params.id, '_id name email role');

      res.status(200).send(user);
    } catch(err) {
      next(err);
    }
  }

  async find(req, res, next) {
    try {
      let users = await User.find(req.query, '_id name email')
        .skip(req.skip)
        .limit(req.limit);

      if (users.length <= 0) {
        let err = new Error('Not found');

        err.statusCode = 404;

        next(err);

        return;
      }

      req.data.items = users;

      res.status(200).send(req.data);
    } catch(err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      req.body.updatedAt = Date.now();

      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {select: '_id name email'}
      );

      res.status(200).send(user);
    } catch(err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await User.findByIdAndDelete(req.params.id);

      res.sendStatus(204);
    } catch(err) {
      next(err);
    }
  }

  async findByEmail(req, res, next) {
    try {
      const user = await User.findOne(req.params);
      
      res.status(user ? 200 : 404).send(user);
    } catch(err) {
      next(err);
    }
  }
}

const userController = new UserController();

export {userController};