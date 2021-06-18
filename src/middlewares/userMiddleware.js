import {body, param, query, validationResult} from 'express-validator';
import {User} from '../models/user.js';

class UserMiddleware {
  constructor() {
    this.idRules = [
      param('id')
        .notEmpty()
        .isMongoId()
        .withMessage('Wrong format')
    ];

    this.findRules = [
      query('name')
        .if(name => typeof name !== 'undefined')
        .notEmpty()
        .trim()
        .escape(),
      query('email')
        .if(email => typeof email !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isEmail()
        .withMessage('Wrong format'),
      query('role')
        .if(role => typeof role !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isIn(['client', 'admin']),
    ];

    this.createRules = [
      body('name')
        .notEmpty()
        .trim()
        .escape(),
      body('email')
        .notEmpty()
        .trim()
        .escape()
        .isEmail()
        .withMessage('Wrong format'),
      body('role')
        .notEmpty()
        .trim()
        .escape()
        .isIn(['client', 'admin']),
      body('password')
        .notEmpty()
        .trim()
        .escape()
        .isLength({min: 5}),
    ];

    this.updateRules = [
      body('name')
        .if(name => typeof name !== 'undefined')
        .notEmpty()
        .trim()
        .escape(),
      body('email')
        .if(email => typeof email !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isEmail()
        .withMessage('Wrong format'),
      body('role')
        .if(role => typeof role !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isIn(['client', 'admin']),
      body('password')
        .if(password => typeof password !== 'undefined')
        .notEmpty()
        .trim()
        .escape()
        .isLength({min: 5}),
    ];
  }

  async validateId(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({errors: errors.array()});
    }

    await User.findById(req.params.id, (err, result) => {
      if (err) {
        next(err);

        return;
      }      

      if (!result) {
        let err = new Error('Not found');

        err.statusCode = 404;

        next(err);
        
        return;
      }

      next();
    });
  }

  async validateFind(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({errors: errors.array()});
    }

    next();
  }

  async validateUser(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).send({errors: errors.array()});
    }

    await User.findOne({email: req.body.email}, (err, result) => {
      if (err) {
        next(err);

        return;
      }

      if (result) {
        let err = new Error('Email already registered');

        err.statusCode = 409;

        next(err);

        return;
      }

      next();
    });
  }
}

const userMiddleware = new UserMiddleware();

export {userMiddleware};