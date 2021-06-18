import {User} from '../models/user.js';

class UserMiddleware {
  async validateId(req, res, next) {
    const {id} = req.params;

    if (id && typeof id === 'undefined') {
      let err = new Error('Missing id');

      err.statusCode = 400;

      next(err);

      return;
    }

    let user = await User.findById(id);

    if (!user) {
      let err = new Error('Not found');

      err.statusCode = 404;

      next(err);
      
      return;
    }

    next();
  }

  async validateFind(req, res, next) {
    const {name, email, role} = req.query;

    if (typeof name !== 'undefined' && !name) {
      let err = new Error('Missing name');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof email !== 'undefined' && !email) {
      let err = new Error('Missing email');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof email !== 'undefined' && !email.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
      let err = new Error('Wrong email format');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof role !== 'undefined' && !role) {
      let err = new Error('Missing role');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (role && !['client', 'admin'].includes(role)) {
      let err = new Error('Invalid role');

      err.statusCode = 400;

      next(err);

      return;
    }

    next();
  }

  async validateCreate(req, res, next) {
    const {name, email, role, password} = req.body;

    if (!name) {
      let err = new Error('Missing name');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!email) {
      let err = new Error('Missing email');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
      let err = new Error('Wrong email format');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!role) {
      let err = new Error('Missing role');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!['client', 'admin'].includes(role)) {
      let err = new Error('Invalid role');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (!password) {
      let err = new Error('Missing password');

      err.statusCode = 400;

      next(err);

      return;
    }

    const user = await User.findOne({email});

    if (user) {
      let err = new Error('Email already registered');

      err.statusCode = 409;

      next(err);

      return;
    }

    next();
  }

  async validateUpdate(req, res, next) {
    const {name, email, role} = req.body;

    if (typeof name !== 'undefined' && !name) {
      let err = new Error('Missing name');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof email !== 'undefined' && !email) {
      let err = new Error('Missing email');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof email !== 'undefined' && !email.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
      let err = new Error('Wrong email format');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof role !== 'undefined' && !role) {
      let err = new Error('Missing role');

      err.statusCode = 400;

      next(err);

      return;
    }

    if (typeof role !== 'undefined' && !['client', 'admin'].includes(role)) {
      let err = new Error('Invalid role');

      err.statusCode = 400;

      next(err);

      return;
    }

    const user = await User.findOne({email});

    if (user) {
      let err = new Error('Email already registered');

      err.statusCode = 409;

      next(err);

      return;
    }

    next();
  }
}

const userMiddleware = new UserMiddleware();

export {userMiddleware};